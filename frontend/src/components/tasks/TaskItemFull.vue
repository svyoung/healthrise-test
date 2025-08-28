<template>
    <button 
        @click="$emit('close')"
        class="mb-2 px-2 py-1 rounded hover:bg-gray-100 text-left"
    >
        ← Back to list
    </button>
    <div class="text-right block mb-2">
        <button @click="toggleEdit" class="ml-2 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 text-[.7rem] cursor-pointer">
            {{ isEditing ? 'Cancel' : 'Edit' }}
        </button>
        <button 
            @click="deleteTask" 
            class="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-[.7rem] cursor-pointer"
        >
            Delete
        </button>
    </div>
    <div class="bg-gray-100 p-4 rounded-lg relative mb-4 text-gray-500 text-left relative">
        <div class="justify-between items-center mb-2">
            <div v-if="!isEditing">
                <h2 class="text-md font-semibold border-b border-dotted border-gray-400 w-full pb-1">
  {{ task.title }}</h2>
            </div>
            <div v-else>
                <div class="text-[.7rem] leading-none mb-1">Title:</div>
                <input v-model="editableTask.title" class="border p-1 rounded w-full bg-white" />
            </div>
        </div>

        <div class="flex justify-between items-center text-[0.6rem] mb-6">
            <div>
                Due Date: 
                <span v-if="!isEditing">{{ formattedDueDate }}</span>
                <input v-else type="date" v-model="editableTask.dueDate" class="border rounded p-1 text-sm bg-white block w-full mb-2" />
            </div>

            <div>
                Priority: 
                <span v-if="!isEditing" :class="metadata.priority?.toLowerCase() === 'high' ? 'text-red-600' : 'text-gray-500'">
                        {{ metadata.priority ? capitalize(metadata.priority) : 'TBD' }}
                    </span>
                <PrioritySelection v-else v-model="editableTask.priority" />
            </div>

            <div>
                Status: 
                <span v-if="!isEditing">{{ capitalize(task.status) || 'TBD' }}</span>
                <StatusSelection v-else v-model="editableTask.status" />
            </div>

            <div v-if="metadata.tags?.length" class="mt-1 text-[.7rem] text-gray-600">
                Tags: 
                <span v-for="(tag, i) in metadata.tags" :key="i">
                    {{ tag }}<span v-if="i < metadata.tags.length - 1">, </span>
                </span>
            </div>

        </div>

        <div class="justify-between items-center mb-2 py-2">
            <div v-if="!isEditing">
                <p class="text-[0.8rem]">{{ task.description || 'No description added' }}</p>
            </div>
            <div v-else>
                <div class="text-[.7rem] leading-none mb-1">Description:</div>
                <input v-model="editableTask.description" class="border p-1 rounded w-full bg-white" />
            </div>
        </div>
        
        <div v-if="isEditing" class="mt-2">
            <button @click="submitChanges" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Save Changes
            </button>
        </div>
    </div>

    <div class="my-10">
        <h2 class="text-left mb-4 font-bold">Leave a comment</h2>
        <RichTextEditor v-model="newComment" class="w-full" />
        <button 
            @click="submitComment" 
            class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Submit
        </button>
    </div>

    <div class="mt-2 mb-2 text-[.7rem] text-left">
        <h2 class="text-[1rem] font-semibold mb-2">Comments</h2>
        <div 
          v-for="(comment, index) in parsedComments" 
          :key="index"
          class="bg-gray-100 text-gray-700 text-sm mb-2 p-2"
        >
            <div v-html="comment.text"></div>

            <!-- 
                This is getting the task.updatedAt instead of what should be comment.updatedAt 
                because right now we don't have a Comment entity set up in the db to track that separately.
            -->
            <span class="text-[.6rem] text-gray-400">updated on {{ formattedUpdatedDate || 'N/A' }}</span> 
        </div>
      </div>
  </template>
  

<script setup>
import { capitalize } from 'vue';
</script>

<script>
import RichTextEditor from '../editor/TextEditor.vue'
import { updateTask, removeTask } from '../../utils.js'
import PrioritySelection from '../inputs/PrioritySelection.vue'
import StatusSelection from '../inputs/StatusSelection.vue'

export default {
    name: 'TaskItemFull',
    props: ['task'],
    components: { RichTextEditor, StatusSelection, PrioritySelection },
    data() {
        return {
            newComment: '',
            isEditing: false,
            editableTask: { title: '', description: '', status: '', dueDate: '', priority: '' }
        };
    },
    computed: {
        parsedComments() {
            try {
                return JSON.parse(this.task.comments);
            } catch (e) {
                return [];
        }},
        metadata() {
            try {
                return JSON.parse(this.task.metadata);
            } catch (e) {
                return {};
            }
        },
        formattedDueDate() {
            if (!this.task.dueDate) return 'TBD'
            const date = new Date(this.task.dueDate)
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        },
        formattedUpdatedDate() {
            if (!this.task.dueDate) return 'TBD';
            const date = new Date(this.task.dueDate);
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        },
    },
    methods: {
        toggleEdit() {
            if (!this.isEditing) {
                    this.editableTask = { 
                    title: this.task.title, 
                    description: this.task.description || '',
                    status: this.task.status, 
                    dueDate: this.task.dueDate ? this.task.dueDate.slice(0,10) : '',
                    priority: this.metadata.priority || 'medium'
                };
            }
            this.isEditing = !this.isEditing;
        },
        async submitChanges() {
            console.log("Submitting changes", this.editableTask);
            if (!this.editableTask.title || !this.editableTask.priority || !this.editableTask.status || !this.editableTask.dueDate || !this.editableTask.description) {
                this.error = "All fields must be filled out.";
                return;
            }
            try {
                const updatedTask = {
                    ...this.task,
                    id: this.task.id,
                    title: this.editableTask.title,
                    description: this.editableTask.description,
                    status: this.editableTask.status,
                    dueDate: this.editableTask.dueDate,
                    updatedAt: new Date().toISOString()
                };
                const currentMetadata = typeof this.task.metadata === 'string' ? JSON.parse(this.task.metadata) : this.task.metadata || {};
                updatedTask.metadata = { ...currentMetadata, priority: this.editableTask.priority };
                updatedTask.metadata = JSON.stringify(updatedTask.metadata);

                console.log(updatedTask)

                await updateTask(updatedTask);
                this.$emit('update-task', updatedTask);
                this.isEditing = false;
            } catch (e) {
                console.error("Failed to update task:", e);
            }
        },
        async deleteTask() {
            if (!confirm("Are you sure you want to delete this task?")) return;

            try {
                await removeTask(this.task.id);
                this.$emit('delete-task', this.task.id);
                this.$emit('close');
            } catch (e) {
                console.error("Error deleting task:", e);
            }
        },
        submitComment() {
            console.log("this.newComment", this.newComment)
            if (!this.newComment.trim()) return

            const comments = this.parsedComments;

            comments.push({ text: this.newComment });
            const updatedTask = { ...this.task, comments: JSON.stringify(comments), updatedAt: new Date().toISOString() };

            try {
                updateTask(updatedTask);
                this.$emit('update-task', updatedTask);
                this.newComment = '';
            } catch (e) {
                console.error("Failed to update task:", e);
            }
        }
    }
};
</script>

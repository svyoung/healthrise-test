<template>
  <form @submit.prevent="submitTask" class="max-w-md mx-auto p-4">
  <div class="mb-4 flex flex-col">
    <label class="text-left text-[.8rem]">Title</label>
    <input 
      v-model="title" 
      placeholder="Title" 
      class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-400 transition"
    />
  </div>

  <div class="mb-4 flex flex-col">
    <label class="text-left text-[.8rem]">Asignee ID</label>
    <!-- this should be an autocomplete/search for users to select -->
    <input 
      v-model="assigneeId" 
      placeholder="Assignee ID" 
      class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-400 transition"
    />
  </div>

  <div class="mb-4 flex flex-col">
    <label class="text-left text-[.8rem]">Due Date</label>
    <input 
      v-model="dueDate" 
      placeholder="Due Date" 
      type="date" 
      class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-400 transition"
    />
  </div>

  <div class="mb-4 flex flex-col">
    <label class="text-left text-[.8rem]">Priority</label>
    <PrioritySelection v-model="priority" />
  </div>

  <div class="mb-4 flex flex-col">
    <label class="text-left text-[.8rem]">Status</label>
    <StatusSelection v-model="status" />
  </div>

  <div class="mb-4 flex flex-col">
    <RichTextEditor v-model="description" />
  </div>

  <p v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</p>

  <button 
    type="submit" 
    class="w-full bg-sky-400 text-white py-2 px-4 rounded hover:bg-sky-700 transition"
  >
    Create Task
  </button>
</form>
</template>

<script>
import RichTextEditor from '../editor/TextEditor.vue'
import PrioritySelection from '../inputs/PrioritySelection.vue'
import StatusSelection from '../inputs/StatusSelection.vue'
import { useTaskStore } from '../../stores/taskStore'

export default {
  components: { RichTextEditor, StatusSelection, PrioritySelection},
  data() {
    return {
      title: '',
      assigneeId: '',
      dueDate: '',
      description: '',
      priority: 'medium', // default priority
      status: 'todo', // default status
      error: ''
    }
  },
  methods: {
    resetForm() {
      this.title = ''
      this.assigneeId = ''
      this.dueDate = ''
      this.description = '' // this is supposed to be the "comments" field, but we are reusing it for the task description
      this.priority = 'medium'
      this.status = 'todo'
      this.error = ''
    },
    async submitTask() {
      console.log("Submitting task", this.title, this.assigneeId, this.dueDate, this.desciption, this.priority, this.status)
      if (!this.title || !this.description || !this.priority || !this.status || this.dueDate === '' || !this.assigneeId) {
        this.error = "All fields must be filled out.";
        return;
      }
      const newTask = {
        title: this.title,
        assigneeId: this.assigneeId,
        dueDate: this.dueDate,
        status: this.status,
        desciption: JSON.stringify([{ text: this.desciption }]),
        metadata: JSON.stringify({ priority: this.priority }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      try {
        const taskStore = useTaskStore()
        await taskStore.addTask(newTask)
        
        this.resetForm();
      } catch (err) {
        console.error('Error creating task', err);
      }
    }
  }
}
</script>

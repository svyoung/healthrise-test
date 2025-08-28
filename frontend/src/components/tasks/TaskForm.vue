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
    class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
  >
    Create Task
  </button>
</form>
</template>

<script>
import RichTextEditor from '../editor/TextEditor.vue'
import PrioritySelection from '../inputs/PrioritySelection.vue'
import StatusSelection from '../inputs/StatusSelection.vue'

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
      this.desciption = ''
      this.priority = 'medium'
      this.status = 'todo'
      this.error = ''
    },
    async submitTask() {
      if (!this.title || !this.desciption || !this.priority || !this.status || this.dueDate === '' || !this.assigneeId) {
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

      console.log("new task", newTask)

      try {
        const res = await fetch('http://localhost:4000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask)
        })
        const created = await res.json()
        console.log('Task created:', created)

        this.$emit('add-task', created)

        this.resetForm()
      } catch (err) {
        console.error('There was an error creating this task', err)
      }
    }
  }
}
</script>

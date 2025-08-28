<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Activity Log</h2>
  
      <div v-if="loading" class="text-gray-500 italic">Loading logs...</div>
      <div v-else-if="logs.length === 0" class="text-gray-500 italic">No activity yet.</div>
  
      <div 
        v-for="(log, index) in logs" 
        :key="index"
        class="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-semibold text-blue-600">{{ log.action }}</span>
          <span class="text-xs text-gray-500">{{ formatDate(log.timestamp) }}</span>
        </div>
  
        <div v-if="log.userId" class="text-sm text-gray-600">
          <span class="font-medium">User ID: </span> {{ log.userId }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ActivityLog",
    data() {
      return {
        logs: [],
        loading: true,
      }
    },
    methods: {
      async loadLogs() {
        try {
          const res = await fetch('http://localhost:4000/api/logs')
          if (!res.ok) throw new Error('Failed to fetch logs')
          const data = await res.json()
          this.logs = data
        } catch (err) {
          console.error(err)
          this.logs = []
        } finally {
          this.loading = false
        }
      },
      formatDate(timestamp) {
        return new Date(timestamp).toLocaleString()
      },
    },
    mounted() {
      this.loadLogs()
    },
  }
  </script>
  
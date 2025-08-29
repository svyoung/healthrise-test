import { defineStore } from 'pinia'
import { fetchTasks, updateTask, removeTask, createTask as createTaskAPI, fetchActivityLogs } from '../api'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    selectedTask: null,
    activityLogs: [],
    showActivityLog: false
  }),
  actions: {
    async loadTasks() {
      this.tasks = (await fetchTasks(30)) // "pagination" by limiting to 30 tasks
    },
    async addTask(newTask) {
      const created = await createTaskAPI(newTask)
      this.tasks.unshift(created)
    },
    selectTask(task) {
      this.selectedTask = task
    },
    async editTask(updatedTask) {
        try {
            await updateTask(updatedTask)
            const idx = this.tasks.findIndex(t => t.id === updatedTask.id)
            if (idx !== -1) this.tasks[idx] = updatedTask
            if (this.selectedTask?.id === updatedTask.id) {
              this.selectedTask = updatedTask
            }
          } catch (err) {
            console.error('Failed to update task:', err)
          }
    },
    async deleteTask(taskId) {
        try {
            await removeTask(taskId)
            this.tasks = this.tasks.filter(t => t.id !== taskId)
            if (this.selectedTask?.id === taskId) {
              this.selectedTask = null
            }
        } catch (err) {
            console.error('Failed to delete task:', err)
        }
    },
    async addComment(task, commentText) {
        const comments = (() => {
          try {
            return JSON.parse(task.comments)
          } catch {
            return []
          }
        })()
  
        comments.push({ text: commentText })
  
        const updatedTask = {
          ...task,
          comments: JSON.stringify(comments),
          updatedAt: new Date().toISOString(),
        }
  
        await this.editTask(updatedTask)
        return updatedTask
    },
    async loadActivityLogs() {
      this.activityLogs = await fetchActivityLogs()
    },
    showLogs() {
      this.showActivityLog = true
      this.loadActivityLogs()
    },
    closeLogs() {
      this.showActivityLog = false
    }
  }
})

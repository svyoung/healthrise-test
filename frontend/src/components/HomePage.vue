<template>
  <div class="min-h-screen p-4">
    <!-- header -->
    <div class="flex items-center justify-between mb-4">
      <button @click="menuOpen = !menuOpen" class="p-2 rounded hover:bg-gray-200">
        <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <h1 class="text-xl font-bold">Task Dashboard</h1>
    </div>

    <!-- mobile menu -->
    <div v-if="menuOpen"
      class="fixed inset-0 z-50 bg-white p-6 flex flex-col gap-6 w-full md:w-1/3 shadow-md">
      <button @click="menuOpen = false" class="absolute top-4 right-4 p-2 rounded hover:bg-gray-200">X</button>

      <ul class="flex flex-col gap-4 text-lg w-full">
        <li>
          <button @click="showFormMobile" class="w-full text-left">Add Task</button>
        </li>
        <li>
          <button @click="viewActivityLog" class="w-full text-left">View Activity Log</button>
        </li>
      </ul>
    </div>

    <!-- activity logs -->
    <div v-if="showActivityLog">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Activity Log</h2>
        <button @click="closeActivityLog" class="p-2 rounded hover:bg-gray-300 cursor-pointer">X</button>
      </div>
      <ActivityLog :logs="activityLogs"/>
    </div>

    <div v-else>
      <!-- mobile layout -->
      <div v-if="isMobile && showFormMobileActive" class="p-4 bg-white rounded shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Add Task</h2>
          <button @click="showFormMobileActive = false" class="p-2 rounded hover:bg-gray-200">
            View Task List
          </button>
        </div>
        <TaskForm @add-task="addTask"/>
      </div>

      <!-- desktop layout -->
      <div v-else class="flex flex-col md:flex-row gap-4">
        <!-- task form -->
        <div class="w-full md:w-2/5 order-2 md:order-1">
          <div v-if="showForm && !isMobile">
            <h2 class="text-xl font-bold mb-4">Add Task</h2>
            <TaskForm @add-task="addTask"/>
          </div>
        </div>

        <!-- task list -->
        <div class="w-full md:w-3/5 order-1 md:order-2">
          <h2 class="text-xl font-semibold mb-2">Tasks</h2>
          <div v-if="selectedTask" class="mt-4 bg-white p-4 rounded">
            <TaskItemFull :task="selectedTask" @close="selectedTask = null" @update-task="updateTaskInList" @delete-task="handleDeleteTask" />
          </div>
          <div v-else class="mt-4 text-gray-400">
            <TaskList :tasks="taskStore.tasks" @select-task="handleSelectTask"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskList from "./tasks/TaskList.vue"
import TaskForm from "./tasks/TaskForm.vue"
import TaskItemFull from "./tasks/TaskItemFull.vue"
import ActivityLog from "./activitylog/ActivityLog.vue"
import { useTaskStore } from '../stores/taskStore'

export default {
  components: { TaskList, TaskForm, TaskItemFull, ActivityLog },
  setup() {
    const taskStore = useTaskStore();
    return { taskStore };
  },
  data() {
    return {
      selectedTask: null,
      menuOpen: false,
      showForm: true,
      showFormMobileActive: false,
      isMobile: window.innerWidth < 768,
      showActivityLog: false,
    }
  },
  methods: {
    showFormMobile() {
      this.showFormMobileActive = true
      this.showActivityLog = false
      this.menuOpen = false
    },
    addTask(task) {
      this.taskStore.addTask(task);
      this.showFormMobileActive = false
    },
    viewActivityLog() {
      this.showActivityLog = true
      this.menuOpen = false
    },
    closeActivityLog() {
      this.showActivityLog = false
    },
    handleSelectTask(task) {
      this.selectedTask = task
    },
    updateTaskInList(updatedTask) {
      this.taskStore.editTask(updatedTask);
      this.selectedTask = updatedTask;
    },
    handleDeleteTask(taskId) {
      this.taskStore.deleteTask(taskId);
      if (this.selectedTask?.id === taskId) this.selectedTask = null;
    },
  },
  created() {
    this.taskStore.loadTasks();
    window.addEventListener("resize", () => {
      this.isMobile = window.innerWidth < 768
    })
  }
}
</script>

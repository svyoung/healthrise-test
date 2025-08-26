<template>
  <div>
    <TaskForm @submit="addTask" />
  </div>
</template>

<script setup lang="ts">
import TaskForm from './components/tasks/TaskForm.vue';
import { ref } from 'vue';

const tasks = ref<any[]>([]);

function addTask(task: any) {
  tasks.value.push(task);
}
</script>

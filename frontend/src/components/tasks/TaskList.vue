<template>
  <ul class="flex flex-col gap-4">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      :onSelectTask="onSelectTask"
    />
  </ul>
</template>


<script>
import TaskItem from './TaskItem.vue';

export default {
  name: 'TaskList',
  props: {
    tasks: Array,
    onSelectTask: Function,
  },
  components: { TaskItem }
};
</script>

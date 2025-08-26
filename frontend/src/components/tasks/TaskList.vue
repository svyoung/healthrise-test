<template>
  <div>
    <ul>
      <TaskItem
        v-for="task in tasks"
        :task="task"
        :setTasks="setTasks"
        :reload="reload"
      />
    </ul>
  </div>
</template>

<script>
import TaskItem from './TaskItem.vue';

export default {
  name: 'TaskList',
  props: ['tasks', 'setTasks', 'reload'],
  components: { TaskItem }
};
</script>

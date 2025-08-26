<template>
  <li>
    <h2>{{ task.title }}</h2>
    <p>{{ typeof task.description === 'string' ? task.description : 'No Description' }}</p>
    <button @click="markDone">Complete</button>
  </li>
</template>
<script>
export default {
  name: 'TaskItem',
  props: ['task', 'setTasks', 'reload'],
  methods: {
    async markDone() {
      if (typeof this.task.status === 'string') this.task.status = 'Done';
  else this.task.status = 1;
      try {
        await this.reload();
  } catch (e) { }

    }
  }
};
</script>

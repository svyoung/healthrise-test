<template>
  <form @submit.prevent="submitTask">
    <input v-model="title" placeholder="Task Title" />
    <input v-model="assigneeId" placeholder="Assignee ID" />
    <input v-model="dueDate" placeholder="Due Date" type="text" />
    <button type="submit">Create Task</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      assigneeId: '',
      dueDate: ''
    };
  },
  methods: {
    submitTask() {
      this.$emit('submit', {
        title: this.title,
        assigneeId: this.assigneeId,
        dueDate: this.dueDate
      });
    }
  }
};
</script>

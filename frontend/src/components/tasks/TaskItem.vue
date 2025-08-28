<template>
  <li 
    class="bg-[#ededed] hover:bg-gray-200 p-4 rounded-lg shadow-md mb-2 flex flex-row justify-between cursor-pointer text-left text-black items-center"
    @click="handleClick"
  >
    <div class="text-md font-semibold">{{ task.title }}</div>
    <div class="text-[.6rem] text-right">Due: {{ formattedDueDate }}</div>
  </li>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    task: Object,
    onSelectTask: Function,
  },
  computed: {
    parsedComments() {
      try {
        return JSON.parse(this.task.comments)
      } catch (e) {
        return []
      }
    },
    metadata() {
      try {
        return JSON.parse(this.task.metadata)
      } catch (e) {
        return {}
      }
    },
    formattedDueDate() {
      if (!this.task.dueDate) return 'TBD'
      const date = new Date(this.task.dueDate)
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    },
  },
  methods: {
    handleClick() {
      if (this.onSelectTask) this.onSelectTask(this.task)
    }
  }
}
</script>

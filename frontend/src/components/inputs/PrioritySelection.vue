<template>
  <select
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 
           focus:ring-blue-400 hover:border-gray-400 transition bg-white mb-2"
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
</template>

<script>
export default {
  name: "PrioritySelection",
  props: {
    modelValue: {
      type: String,
      default: ""
    }
  }
};
</script>

<template>
  <div>
    <h4>Comments</h4>
    <ul>
      <li v-for="c in comments">{{ c.text }}</li>
    </ul>
    <input />
    <button>Add</button>
  </div>
</template>

<script>
export default {
  name: 'CommentSection',
  props: ['comments']
};
</script>

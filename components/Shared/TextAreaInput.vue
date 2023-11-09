<template>
  <textarea
    :value="value"
    @input="handleInput"
    @keyup.enter="handleInput"
  ></textarea>
</template>

<script>
export default {
  name: 'TextAreaInput',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleInput($event) {
      this.$emit('input', $event.target.value)
    },
  },
}
</script>

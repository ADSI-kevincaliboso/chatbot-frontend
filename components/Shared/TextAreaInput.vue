<template>
  <div class="field">
    <textarea
      class="textarea"
      rows="2"
      :value="value"
      @input="handleInput"
      @keyup.enter="handleInput"
    ></textarea>
  </div>
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

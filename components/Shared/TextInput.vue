<template>
  <input
    class="input"
    :type="type"
    :value="value"
    autocomplete="off"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
}
</script>

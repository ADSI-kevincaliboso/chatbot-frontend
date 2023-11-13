<template>
  <select
    id="userType"
    name="userType"
    :value="value"
    @change="$emit('input', $event.target.value)"
  >
    <option value="user" selected>User</option>
    <option value="moderator">Moderator</option>
  </select>
</template>

<script>
export default {
  name: 'DropDown',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
}
</script>

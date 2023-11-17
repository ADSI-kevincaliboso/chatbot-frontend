<template>
  <div class="select">
    <select
      id="userType"
      name="userType"
      :value="value"
      @change="$emit('input', $event.target.value)"
    >
      <option :value="null" selected>Select a User type</option>
      <option value="user">User</option>
      <option value="moderator">Moderator</option>
    </select>
  </div>
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

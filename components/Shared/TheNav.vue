<template>
  <div class="sidenav">
    <ul class="nav-list">
      <li class="nav-item">
        <button type="button" @click="logoutUser">Logout</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TheNav',
  methods: {
    logoutUser() {
      // destroy user keys and remove authtoken
      this.$store.dispatch('logoutUser')
      // redirect to /
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.nav-item {
  list-style-type: none;
}
</style>

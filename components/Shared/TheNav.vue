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
      const roomId = this.$store.getters.chatroom
      // destroy user keys and remove authtoken
      this.$store.dispatch('logoutUser')
      this.$echo.leave(`chat.${roomId}`)

      if (
        this.$store.getters.userType === 'admin' ||
        this.$store.getters.userType === 'moderator'
      ) {
        this.$echo.leave(`chatrooms`)
      }
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

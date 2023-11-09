<template>
  <div>ChatRooms</div>
</template>

<script>
export default {
  name: 'ChatPage',
  middleware: ['checkAuth', 'auth'],
}
</script>

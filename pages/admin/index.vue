<template>
  <div>
    <h1>Dashboard</h1>
    <li v-for="chatroom in chatroomList" :key="chatroom.id">
      {{ chatroom }}
    </li>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AdminDashboardPage',
  layout: 'auth',
  middleware: ['checkAuth', 'auth'],
  asyncData(context) {
    return axios
      .get(`${process.env.baseUrl}/chat-rooms/`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${context.store.getters.token}`,
        },
      })
      .then((res) => {
        return {
          chatrooms: res.data,
        }
      })
      .catch((e) => new Error('Chatroom error'))
  },
  computed: {
    chatroomList() {
      return this.chatrooms
    },
  },
}
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <br />
    <TheSideNav />
  </div>
</template>

<script>
// import axios from 'axios'

import TheSideNav from '~/components/Shared/TheSideNav.vue'

export default {
  name: 'AdminDashboardPage',
  components: {
    TheSideNav,
  },
  layout: 'auth',
  middleware: ['checkAuth', 'auth', 'isAdmin'],
  // asyncData(context) {
  //   return axios
  //     .get(`${process.env.baseUrl}/chat-rooms/`, {
  //       headers: {
  //         Accept: 'application/json',
  //         Authorization: `Bearer ${context.store.getters.token}`,
  //       },
  //     })
  //     .then((res) => {
  //       return {
  //         chatrooms: res.data,
  //       }
  //     })
  //     .catch((e) => new Error('Chatroom error'))
  // },
  // computed: {
  //   chatroomList() {
  //     return this.chatrooms
  //   },
  // },
}
</script>

<template>
  <div>
    <br />
    <h1 class="title">Dashboard</h1>
    <br />
    <TheSideNav :rooms="rooms" @chatroomRefresh="refresh" />
  </div>
</template>

<script>
import axios from 'axios'

import TheSideNav from '~/components/Shared/TheSideNav.vue'

export default {
  name: 'AdminDashboardPage',
  components: {
    TheSideNav,
  },
  layout: 'auth',
  middleware: ['checkAuth', 'auth', 'isModerator'],
  data() {
    return {
      chatrooms: [],
    }
  },
  async fetch() {
    let res

    if (this.$store.getters.userType === 'admin') {
      res = await axios.get(`${process.env.baseUrl}/chat-rooms/`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$store.getters.token}`,
        },
      })
    } else {
      res = await axios.get(`${process.env.baseUrl}/chat-rooms/moderator`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$store.getters.token}`,
        },
      })
    }

    this.chatrooms = res.data
  },
  computed: {
    rooms() {
      return this.chatrooms
    },
  },
  mounted() {
    this.connect()
  },
  methods: {
    connect() {
      this.$echo.connector.options.auth.headers.Authorization = `Bearer ${this.$store.getters.token}`

      const privateChannel = this.$echo.private(`chatrooms`)
      privateChannel.listen(
        `.chatroom.assigned.to.${this.$store.getters.userId}`,
        (event) => {
          this.chatrooms.push(event.chatroom)
        }
      )

      // create listener for a broadcast when the chatroom assigned to you goes live
      privateChannel.listen(`.chatroom.active`, (event) => {
        if (event.chatroom.moderator === Number(this.$store.getters.userId)) {
          this.chatrooms.push(event.chatroom)
        }
      })

      privateChannel.listen('.chatroom.destroy', (event) => {
        this.chatrooms = this.chatrooms.filter(
          (chatroom) => chatroom.id !== event.chatroom.id
        )
      })
    },
    refresh($event) {
      this.chatrooms = [...$event]
    },
  },
}
</script>

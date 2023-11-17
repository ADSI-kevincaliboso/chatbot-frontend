<template>
  <div>
    <button class="button is-secondary" @click="getChatRooms">ChatRooms</button>
    <button
      v-show="this.$store.getters.userType === 'admin'"
      class="button is-secondary"
      @click="getUsers"
    >
      Users
    </button>

    <div>
      <ChatRooms v-show="showChatRooms" :chatrooms="rooms" />
      <UserTable
        v-show="showUserTable"
        :user-list="userList"
        @deleteUser="deleteUser"
        @addUser="addUser"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import ChatRooms from '~/components/Chat/ChatRooms.vue'
import UserTable from '~/components/UserTable.vue'
export default {
  name: 'TheSideNav',
  components: {
    ChatRooms,
    UserTable,
  },
  props: {
    rooms: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      users: [],
      showChatRooms: true,
      showUserTable: false,
    }
  },
  computed: {
    userList() {
      return this.users
    },
  },
  methods: {
    async getChatRooms() {
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

      // this.chatrooms = res.data
      this.$emit('chatroomRefresh', res.data)
      this.showChatRooms = true
      this.showUserTable = false
    },

    async getUsers() {
      const res = await axios.get(`${process.env.baseUrl}/users/`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$store.getters.token}`,
        },
      })

      this.users = res.data.data
      this.showChatRooms = false
      this.showUserTable = true
    },

    deleteUser($event) {
      const id = $event

      this.users = this.users.filter((user) => user.id !== id)
    },

    addUser($event) {
      this.users.push($event)
    },
  },
}
</script>

<template>
  <div>
    <h1>chatbot</h1>

    <div class="container">
      <ul>
        <li class="list-item" v-for="message in messageList" :key="message.id">
          <b>{{ message.sender.name }}</b> : {{ message.message }}
        </li>
      </ul>
    </div>

    <div>
      <ChatMessage @messageSent="addMessage" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ChatMessage from '~/components/Chat/ChatMessage.vue'
// create the chatroom immediately after entering as user here
// we need a way to get the value sent from chatmessage to message w/o refreshing the message get
export default {
  name: 'ChatPage',
  comments: {
    ChatMessage,
  },
  middleware: ['checkAuth', 'auth'],
  asyncData(context) {
    const id = context.store.getters.chatroom
    return axios
      .get(`${process.env.baseUrl}/chat/room/${id}/messages`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${context.store.getters.token}`,
        },
      })
      .then((res) => {
        context.store.dispatch('saveMessages', res.data.data)
      })
      .catch((e) => console.log(e))
  },
  computed: {
    messageList() {
      return this.$store.getters.messages
    },
  },
  mounted() {
    this.connect()
  },
  methods: {
    addMessage(message) {
      this.$store.dispatch('addMessage', message)
    },
    connect() {
      const roomId = this.$store.getters.chatroom
      this.$echo.private(`chat.${roomId}`).listen('.message.new', (event) => {
        this.messageList()
      })
    },
  },
}
</script>

<style scoped>
.container {
  border: 1px solid black;
  height: 400px;
  overflow-y: scroll;
}

li {
  list-style-type: none;
}
</style>

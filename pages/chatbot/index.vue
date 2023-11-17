<template>
  <div>
    <button v-if="$store.getters.userType === 'admin'" @click="redirectToAdmin">
      Go back to admin dashboard
    </button>

    <button
      v-if="$store.getters.userType === 'moderator'"
      @click="redirectToModerator"
    >
      Go back to moderator dashboard
    </button>

    <h1>Chatbot</h1>

    <div class="container">
      <ul>
        <li v-for="message in messageList" :key="message.id" class="lst-item">
          <b>{{ message.sender.name }}</b> : {{ message.message }}
        </li>
      </ul>
    </div>

    <div>
      <ChatMessage
        :chatbot-index="index"
        @messageSent="addMessage"
        @botMessageSent="botAddMessage"
      />
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
  layout: 'auth',
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
      .catch((e) => new Error('Chatroom error'))
  },
  data() {
    return {
      index: 0,
    }
  },
  computed: {
    messageList() {
      return this.$store.getters.messages
    },
    getIndex() {
      return this.index
    },
  },
  beforeMount() {
    this.connect()

    // get initial bot message here
    if (
      !this.$store.getters.chatbotDone &&
      this.$store.getters.userType === 'user'
    ) {
      this.chatbotInit()
    }
  },
  methods: {
    addMessage(message) {
      this.$store.dispatch('addMessage', message)
    },
    botAddMessage(message) {
      console.log('you are here')
      console.log(message)
      if (message.chatMessage && message.chatbotMessage) {
        this.$store.dispatch('addMessage', message.chatMessage)
        this.$store.dispatch('addMessage', message.chatbotMessage)
      } else {
        this.$store.dispatch('addMessage', message)
      }
      this.index++
    },
    connect() {
      const roomId = this.$store.getters.chatroom

      this.$echo.connector.options.auth.headers.Authorization = `Bearer ${this.$store.getters.token}`
      this.$echo.private(`chat.${roomId}`).listen('.message.new', (event) => {
        this.$store.dispatch('addMessage', event.chatMessage)
      })
    },
    async chatbotInit() {
      const res = await axios.get(`${process.env.baseUrl}/chatbot-messages`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$store.getters.token}`,
        },
      })
      this.botAddMessage(res.data.data[this.index])
      this.index++
    },
    redirectToAdmin() {
      this.$echo.leave(`chat.${this.$store.getters.chatroom}`)
      this.$router.push('/admin')
    },

    redirectToModerator() {
      this.$echo.leave(`chat.${this.$store.getters.chatroom}`)
      this.$router.push('/moderator')
    },
  },
}
</script>

<style scoped>
.container {
  border: 1px solid black;
  height: 400px;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}

li {
  list-style-type: none;
}
</style>

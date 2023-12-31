<template>
  <div class="container mt-4">
    <button
      v-if="$store.getters.userType === 'admin'"
      class="button is-text"
      @click="redirectToAdmin"
    >
      Go back to admin dashboard
    </button>

    <button
      v-if="$store.getters.userType === 'moderator'"
      class="button is-text"
      @click="redirectToModerator"
    >
      Go back to moderator dashboard
    </button>
    <h1 class="title">Chatbot</h1>

    <div
      class="chat-container box has-background-white-ter box-radius-20 px-5 py-2 is-flex is-flex-direction-column-reverse"
    >
      <ul>
        <li v-for="message in messageList" :key="message.id">
          <div
            :class="
              Number(message.sender.id) === Number($store.getters.userId) ||
              message.sender.user_type === $store.getters.userType
                ? 'm-3 is-flex is-fullheight is-justify-content-flex-start is-align-items-end is-flex-direction-row-reverse'
                : 'm-3 is-flex is-fullheight is-align-items-end'
            "
          >
            <div class="mr-2">
              <img
                v-if="message.sender.user_type === 'user'"
                src="~/assets/img/profile-user.png"
                alt="user-profile"
                class="profile-user"
              />
              <img
                v-else
                src="~/assets/img/robot.png"
                alt="robot-profile"
                class="profile-user"
              />
            </div>
            <div
              :class="
                Number(message.sender.id) === Number($store.getters.userId)
                  ? 'bubble-content-sent'
                  : 'bubble-content'
              "
            >
              {{ message.message }}
            </div>
          </div>
        </li>
        <div
          v-if="choicesButton.length > 0"
          class="is-flex is-justify-content-space-evenly mt-4"
        >
          <div v-for="choice in choices" :key="choice.reply_id">
            <b-button
              type="is-info is-light"
              size="is-small"
              @click="choiceSelected(choice.id, choice.reply_id)"
            >
              {{ choice.choice }}
            </b-button>
          </div>
        </div>
      </ul>
    </div>

    <div>
      <ChatMessage
        :chatbot-index="index"
        :chat-message-id="messageId"
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
      choices: [],
      botMessageId: 0,
    }
  },
  computed: {
    messageList() {
      return this.$store.getters.messages
    },
    getIndex() {
      return this.index
    },
    choicesButton() {
      return this.choices
    },
    messageId() {
      return this.botMessageId
    },
  },
  beforeMount() {
    this.connect()
  },
  mounted() {
    // get initial bot message here
    if (
      // eslint-disable-next-line eqeqeq
      this.$store.getters.chatbotDone == 0 &&
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
      if (message.chatMessage && message.chatbotMessage) {
        if (!message.chatbotMessage.chatbotId) {
          this.botMessageId = 0
        } else {
          this.botMessageId = message.chatbotMessage.chatbotId
        }
        if (
          message.chatbotMessage.choices?.length === 0 &&
          this.botMessageId !== 2
        ) {
          this.chatbotChoicesInit()
        }

        this.choices = []
        this.$store.dispatch('addMessage', message.chatMessage)
        this.$store.dispatch('addMessage', message.chatbotMessage)
      } else {
        this.$store.dispatch('addMessage', message)
      }
      this.index++
    },
    async choiceSelected(id, replyId) {
      this.botMessageId = id
      const choiceRes = await axios.get(
        `${process.env.baseUrl}/chatbot-choices/${id}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        }
      )

      this.botAddMessage(choiceRes.data.data)

      const res = await axios.post(
        `${process.env.baseUrl}/chatbot-messages/get-response`,
        {
          selectedId: Number(replyId),
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        }
      )

      this.choices = res.data.data.choices
      // putting the response of bot (res.data.data.message)
      const botRes = await axios.post(
        `${process.env.baseUrl}/chat/room/${this.$store.getters.chatroom}/message/bot`,
        {
          message: res.data.data.message,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        }
      )
      this.botAddMessage(botRes.data.data)

      if (this.choices.length === 0 && id !== 2) {
        this.chatbotChoicesInit()
      }
    },
    connect() {
      const roomId = this.$store.getters.chatroom

      this.$echo.connector.options.auth.headers.Authorization = `Bearer ${this.$store.getters.token}`
      this.$echo.private(`chat.${roomId}`).listen('.message.new', (event) => {
        this.$store.dispatch('addMessage', event.chatMessage)
      })
    },
    async chatbotInit() {
      const res = await axios.get(
        `${process.env.baseUrl}/chatbot-messages/init`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        }
      )

      // push the message to the chatmessage table first
      const chatbotMessage = res.data.data[0]
      this.choices = [...res.data.data[0].choices]
      const botRes = await axios.post(
        `${process.env.baseUrl}/chat/room/${this.$store.getters.chatroom}/message/bot`,
        {
          message: chatbotMessage.message,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        }
      )

      // get the result of the chat message creation then push it to botAddMessage
      this.botAddMessage(botRes.data.data)
      this.index++
    },
    async chatbotChoicesInit() {
      const res = await axios.get(
        `${process.env.baseUrl}/chatbot-messages/init`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        }
      )

      // push the message to the chatmessage table first
      this.choices = [...res.data.data[0].choices]
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
.chat-container {
  height: 500px;
  overflow: auto;
}

.profile-user {
  width: 25px;
  height: 25px;
}

.bubble-content {
  border: solid gray;
  padding: 20px;
  max-width: 650px;
  overflow: auto;
  height: 100%;
  border-radius: 15px;
  word-break: normal;
  margin-right: 10px;
}

.bubble-content-sent {
  border: solid gray;
  padding: 20px;
  max-width: 650px;
  overflow: auto;
  height: 100%;
  border-radius: 15px;
  justify-content: flex-end;
  word-break: normal;
  margin-right: 10px;
}

li {
  list-style-type: none;
}
</style>

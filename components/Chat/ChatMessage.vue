<template>
  <div>
    <TextAreaInput v-model="message" />
    <button
      v-show="
        $store.getters.chatbotDone == 1 || $store.getters.userType !== 'user'
      "
      class="button is-success"
      @click="sendMessage"
    >
      Send
    </button>

    <button
      v-show="
        $store.getters.chatbotDone == 0 && $store.getters.userType === 'user'
      "
      class="button is-success"
      @click="sendBotMessage"
    >
      Send
    </button>
  </div>
</template>

<script>
import axios from 'axios'
import TextAreaInput from '~/components/Shared/TextAreaInput.vue'
export default {
  name: 'ChatMessage',
  components: {
    TextAreaInput,
  },
  props: {
    chatbotIndex: {
      type: Number,
      required: true,
    },
    chatMessageId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      message: '',
    }
  },
  methods: {
    async sendMessage() {
      // send message then emit a event that the message is sent
      if (this.message) {
        const res = await axios
          .post(
            `${process.env.baseUrl}/chat/room/${this.$store.getters.chatroom}/message`,
            {
              message: this.message,
            },
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${this.$store.getters.token}`,
                'X-Socket-ID': this.$echo.socketId(),
              },
            }
          )
          .catch((_error) => {
            const userType = this.$store.getters.userType

            if (userType === 'admin') {
              this.$router.push('/admin')
            } else {
              this.$router.push('/chatbot')
            }
          })

        this.message = ''
        this.$emit('messageSent', res.data.data)
      }
    },

    async sendBotMessage() {
      let hasError, res

      if (this.$props.chatMessageId === 2) {
        // we also mark the doneWithChatbot here as done or 1
        res = await axios.post(
          `${process.env.baseUrl}/chatbot-messages/create-incident-report`,
          {
            messageId: this.$props.chatMessageId,
            message: this.message,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${this.$store.getters.token}`,
            },
          }
        )

        this.$store.dispatch('setChatbotDone', 1)
      } else {
        res = await axios
          .post(
            `${process.env.baseUrl}/chatbot-messages`,
            {
              message: this.message,
            },
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${this.$store.getters.token}`,
              },
            }
          )
          .catch((error) => {
            // show error toast in the future
            this.$buefy.toast.open({
              message: error.response.data.message,
              type: 'is-danger',
              position: 'is-bottom',
            })
            hasError = true
            return new Error(error)
          })

        if (hasError) {
          // we sent another request to chatmessage and add it to the message array also get the response which is going to be a "Sorry I don't have that option" then refresh
          // the chatbot choices
          return
        }
      }

      this.message = ''
      this.$emit('botMessageSent', {
        chatMessage: res.data.data.chatMessage,
        chatbotMessage: res.data.data.chatbotMessage,
      })
    },
  },
}
</script>

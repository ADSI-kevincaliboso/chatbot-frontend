<template>
  <div>
    <TextAreaInput v-model="message" />
    <button v-show="this.$store.getters.chatbotDone" @click="sendMessage">
      Send
    </button>

    <button v-show="!this.$store.getters.chatbotDone" @click="sendBotMessage">
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
      if (this.$props.chatbotIndex <= 3) {
        const res = await axios.post(
          `${process.env.baseUrl}/chatbot-messages`,
          {
            chatbotMessageId: this.$props.chatbotIndex,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${this.$store.getters.token}`,
            },
          }
        )
        // #TODO in the controller, also append the chatmessage created then push it first before pushing the chatbot-message response
        this.message = ''
        this.$emit('messageSent', res.data.data)

        if (this.$props.chatbotIndex >= 3) {
          // mark it as done
          this.$store.dispatch('setChatbotDone', true)
        }
      }
    },
  },
}
</script>

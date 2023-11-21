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
  },
  data() {
    return {
      message: '',
    }
  },
  methods: {
    async sendMessage() {
      console.log(this.$props.chatbotIndex)
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
            message: this.message,
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
        this.$emit('botMessageSent', {
          chatMessage: res.data.data.chatMessage,
          chatbotMessage: res.data.data.chatbotMessage,
        })

        if (this.$props.chatbotIndex >= 3) {
          // mark it as done
          this.$store.dispatch('setChatbotDone', 1)

          // send the true value to doneWithChatbot update
          await axios.patch(
            `${process.env.baseUrl}/users/${this.$store.getters.userId}`,
            null,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${this.$store.getters.token}`,
              },
            }
          )
        }
      }
    },
  },
}
</script>

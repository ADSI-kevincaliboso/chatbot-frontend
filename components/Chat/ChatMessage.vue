<template>
  <div>
    <TextAreaInput v-model="message" />
    <button @click="sendMessage">Send</button>
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
  },
}
</script>

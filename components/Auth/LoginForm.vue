<template>
  <form @submit.prevent="login">
    <label for="email">Email</label>
    <TextInput id="email" v-model="email" />

    <label for="password">Password</label>
    <TextInput id="password" v-model="password" />

    <button type="submit">Login</button>
  </form>
</template>

<script>
import axios from 'axios'
import TextInput from '~/components/Shared/TextInput.vue'

export default {
  name: 'LoginForm',
  components: {
    TextInput,
  },
  data() {
    return {
      email: '',
      password: '',
      errors: '',
    }
  },
  methods: {
    async login() {
      // we call axios

      const data = {
        email: this.email,
        password: this.password,
      }

      await axios
        .post(`${process.env.baseUrl}/login`, data, {
          headers: {
            Accept: 'application/json',
          },
        })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          this.errors = error.response.data.message
        }) // do this to get validation errors

      // store this to vuex
    },
  },
}
</script>

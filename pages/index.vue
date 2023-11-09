<template>
  <div>
    <form @submit.prevent="authUser">
      <div v-show="isLogin === false">
        <label for="username">Username/Nickname</label>
        <TextInput id="username" v-model="name" />
      </div>
      <div>
        <label for="email">Email</label>
        <TextInput id="email" v-model="email" />
      </div>

      <div>
        <label for="password">Password</label>
        <TextInput id="password" v-model="password" type="password" />
      </div>

      <button type="submit">{{ isLogin ? 'Login' : 'Signup' }}</button>
      <button type="button" @click="isLogin = !isLogin">
        switch to register
      </button>
    </form>

    <div>
      <p v-show="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import TextInput from '~/components/Shared/TextInput.vue'
export default {
  name: 'LoginPage',
  components: {
    TextInput,
  },
  middleware: ['checkAuth', 'auth'],
  data() {
    return {
      email: '',
      password: '',
      name: '',
      isLogin: true,
      error: '',
    }
  },
  methods: {
    // eslint-disable-next-line require-await
    authUser() {
      const authData = {
        name: this.name,
        email: this.email,
        password: this.password,
        isLogin: this.isLogin,
      }

      this.email = ''
      this.name = ''
      this.password = ''

      this.$store.dispatch('authUser', authData).then((res) => {
        if (!res) {
          this.error = this.$store.getters.error
        } else {
          this.$router.push('/chatbot')
        }
      })
    },
  },
}
</script>

<!-- eslint-disable no-lonely-if -->
<template>
  <div class="container height-full">
    <div class="columns is-centered is-vcentered height-full">
      <div class="column is-4">
        <form class="box p-6" @submit.prevent="authUser">
          <div v-show="isLogin === false" class="field">
            <label class="label" for="username">Username/Nickname</label>
            <TextInput id="username" v-model="name" />
          </div>

          <div class="field">
            <label class="label" for="email">Email</label>
            <TextInput id="email" v-model="email" />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <TextInput id="password" v-model="password" type="password" />
          </div>

          <button class="button is-primary" type="submit">
            {{ isLogin ? 'Login' : 'Signup' }}
          </button>
          <button
            class="button is-secondary"
            type="button"
            @click="isLogin = !isLogin"
          >
            switch to {{ isLogin ? 'register' : 'login' }}
          </button>

          <div class="help is-danger">
            <p v-show="error">{{ error }}</p>
          </div>
        </form>
      </div>
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
          switch (res) {
            case 'user':
              this.$router.push('/chatbot')
              break
            case 'admin':
              this.$router.push('/admin')
              break
            case 'moderator':
              this.$router.push('/moderator')
              break
            default:
              break
          }
        }
      })
    },
  },
}
</script>

<style scoped>
.height-full {
  height: 100%;
}
</style>

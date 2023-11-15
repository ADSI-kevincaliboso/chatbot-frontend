<!-- eslint-disable no-lonely-if -->
<template>
  <div class="container">
    <form class="form" @submit.prevent="authUser">
      <div v-show="isLogin === false" class="form-control">
        <label for="username">Username/Nickname</label>
        <TextInput id="username" v-model="name" />
      </div>

      <div class="form-control">
        <label for="email">Email</label>
        <TextInput id="email" v-model="email" />
      </div>

      <div class="form-control">
        <label for="password">Password</label>
        <TextInput id="password" v-model="password" type="password" />
      </div>

      <button type="submit">{{ isLogin ? 'Login' : 'Signup' }}</button>
      <button type="button" @click="isLogin = !isLogin">
        switch to {{ isLogin ? 'register' : 'login' }}
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
.container {
  height: 500px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form {
  border: 1px solid black;
  padding: 50px;
  border-radius: 20px;
}

.form-control {
  display: flex;
  /* align-items: center; */
  justify-content: center;
  flex-direction: column;
  margin-bottom: 20px;
}
</style>

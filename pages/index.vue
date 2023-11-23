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

          <b-button native-type="submit" type="is-primary" :loading="isLoading">
            {{ isLogin ? 'Login' : 'Signup' }}
          </b-button>
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
      loading: false,
    }
  },
  computed: {
    isLoading() {
      return this.loading
    },
  },
  methods: {
    authUser() {
      const authData = {
        name: this.name,
        email: this.email,
        password: this.password,
        isLogin: this.isLogin,
      }

      // this.email = ''
      // this.name = ''
      this.password = ''
      this.loading = true
      this.$store.dispatch('authUser', authData).then((res) => {
        if (!res) {
          this.$buefy.toast.open({
            message: 'Something went wrong. Please check your fields',
            type: 'is-danger',
            position: 'is-bottom',
          })
          // this.error = this.$store.getters.error
          this.loading = false
        } else {
          this.loading = false
          this.$buefy.toast.open({
            message: 'Login Successful!',
            type: 'is-success',
          })
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

<template>
  <div>
    <br />
    <h1 class="subtitle">User Table</h1>

    <button class="button is-primary" @click="toggleModal">
      Create Account
    </button>
    <br />
    <br />

    <div class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Modal title</p>
          <button
            class="delete"
            aria-label="close"
            @click="toggleModal"
          ></button>
        </header>
        <section class="modal-card-body">
          <form id="newUserForm" @submit.prevent="createAccount">
            <div class="field">
              <label for="name" class="label">Name</label>
              <TextInput id="name" v-model="name" />
            </div>

            <div class="field">
              <label for="email" class="label">Email</label>
              <TextInput id="email" v-model="email" />
            </div>

            <div class="field">
              <label for="userType" class="label">User Type</label>
              <DropDown v-model="userType" />
            </div>

            <div class="field">
              <label for="password" class="label">Password</label>
              <TextInput id="password" v-model="password" type="password" />
            </div>
            <p class="help is-danger">{{ errorMessage }}</p>
            <!-- <button type="submit">Create</button> -->
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" type="submit" form="newUserForm">
            Save changes
          </button>
          <button class="button" @click="toggleModal">Cancel</button>
        </footer>
      </div>
    </div>

    <div>
      <table class="table is-striped is-hoverable is-fullwidth is-vcentered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in userList" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.user_type }}</td>
            <td>
              <button class="button is-danger" @click="deleteUser(user.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import TextInput from '~/components/Shared/TextInput.vue'
import DropDown from '~/components/Shared/DropDown.vue'
export default {
  name: 'UserTable',
  components: {
    TextInput,
    DropDown,
  },
  props: {
    userList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      name: '',
      email: '',
      password: '',
      userType: '',
    }
  },
  computed: {
    errorMessage() {
      return this.$store.getters.error
    },
  },
  methods: {
    async deleteUser(id) {
      // delete from backend
      await axios.delete(`${process.env.baseUrl}/users/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$store.getters.token}`,
        },
      })
      // emits an event to parent to delete it from the userList
      this.$emit('deleteUser', id)
    },

    toggleModal() {
      this.$el.querySelector('.modal').classList.toggle('is-active')
    },

    async createAccount() {
      const data = {
        name: this.name,
        email: this.email,
        password: this.password,
        user_type: this.userType,
      }

      await axios
        .post(`${process.env.baseUrl}/users`, data, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        })
        .then((res) => {
          this.name = ''
          this.email = ''
          this.password = ''
          this.userType = ''

          this.showModal = false

          this.$emit('addUser', res.data.data)
          this.$el.querySelector('.modal').classList.toggle('is-active')
        })
        .catch((e) => {
          this.$store.commit('setError', e.response.data.message)
        })
    },
  },
}
</script>

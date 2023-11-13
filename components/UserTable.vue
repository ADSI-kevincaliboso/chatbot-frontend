<template>
  <div>
    <h1>User Table</h1>
    <button @click="toggleModal">Create Account</button>

    <div v-show="showModal">
      <form @submit.prevent="createAccount">
        <label for="name">Name</label>
        <TextInput id="name" v-model="name" />

        <label for="email">Email</label>
        <TextInput id="email" v-model="email" />

        <label for="userType">User Type</label>
        <DropDown v-model="userType" />

        <label for="password">Password</label>
        <TextInput id="password" v-model="password" type="password" />

        <button type="submit">Create</button>
      </form>
    </div>
    <div>
      <table>
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
            <td><button @click="deleteUser(user.id)">Delete</button></td>
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
      this.showModal = !this.showModal
    },

    async createAccount() {
      const data = {
        name: this.name,
        email: this.email,
        password: this.password,
        user_type: this.userType,
      }

      const res = await axios.post(`${process.env.baseUrl}/users`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$store.getters.token}`,
        },
      })

      this.name = ''
      this.email = ''
      this.password = ''
      this.userType = ''

      this.showModal = false

      this.$emit('addUser', res.data.data)
    },
  },
}
</script>

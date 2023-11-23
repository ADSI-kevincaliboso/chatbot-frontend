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
          <b-button
            type="is-success"
            native-type="submit"
            form="newUserForm"
            :loading="action"
          >
            Save changes
          </b-button>
          <button class="button" @click="toggleModal">Cancel</button>
        </footer>
      </div>
    </div>

    <div>
      <b-table
        :data="isEmpty ? [] : userList"
        :striped="true"
        :loading="isLoading"
        :mobile-cards="true"
      >
        <b-table-column v-slot="props" field="id" label="ID" width="40" numeric>
          {{ props.row.id }}
        </b-table-column>

        <b-table-column v-slot="props" field="name" label="Name" width="40">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column v-slot="props" field="email" label="Email" width="40">
          {{ props.row.email }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="userType"
          label="User Type"
          width="40"
        >
          {{ props.row.user_type }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="action"
          label="Actions"
          width="40"
        >
          <b-button
            type="is-danger"
            :loading="action"
            @click="confirm(props.row.id)"
          >
            Delete
          </b-button>
        </b-table-column>
      </b-table>
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
    state: {
      type: Boolean,
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
      isEmpty: false,
      actionLoading: false,
    }
  },
  computed: {
    errorMessage() {
      return this.$store.getters.error
    },
    isLoading() {
      return this.$props.state
    },
    action() {
      return this.actionLoading
    },
  },
  methods: {
    confirm(id) {
      this.$buefy.dialog.confirm({
        message: 'Are you sure you want to delete this record?',
        onConfirm: () => this.deleteUser(id),
      })
    },
    async deleteUser(id) {
      this.actionLoading = true
      // delete from backend
      await axios.delete(`${process.env.baseUrl}/users/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.$store.getters.token}`,
        },
      })
      // emits an event to parent to delete it from the userList
      this.actionLoading = false
      this.$buefy.toast.open({
        message: 'User Deleted',
        type: 'is-danger',
      })
      this.$emit('deleteUser', id)
    },

    toggleModal() {
      this.$el.querySelector('.modal').classList.toggle('is-active')
    },

    async createAccount() {
      this.actionLoading = true
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
      this.actionLoading = false
      this.$buefy.toast.open({
        message: 'User Created',
        type: 'is-success',
      })
    },
  },
}
</script>

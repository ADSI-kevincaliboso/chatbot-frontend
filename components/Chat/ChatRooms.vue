<template>
  <div>
    <br />
    <h1 class="subtitle">Chatrooms</h1>

    <div>
      <b-table
        :data="isEmpty ? [] : chatrooms"
        :striped="true"
        :loading="isLoading"
        :mobile-cards="true"
      >
        <b-table-column v-slot="props" field="id" label="ID" width="40" numeric>
          {{ props.row.id }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="chatroomName"
          label="Chatroom Name"
          width="40"
        >
          {{ props.row.name }}
        </b-table-column>

        <b-table-column
          v-slot="props"
          field="actions"
          label="Actions"
          width="40"
        >
          <b-button type="is-light is-primary" @click="enterRoom(props.row.id)">
            Enter Chatroom
          </b-button>

          <div v-show="$store.getters.userType === 'admin'">
            <ModeratorOptions v-model="moderator" />
            <b-button
              type="is-light is-secondary"
              :loading="action"
              @click="assignModerator(props.row.id)"
            >
              Assign Moderator
            </b-button>
          </div>
        </b-table-column>
        <template #empty>
          <div class="has-text-centered">No records</div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import ModeratorOptions from '~/components/Shared/ModeratorOptions.vue'
export default {
  name: 'ChatRooms',
  components: {
    ModeratorOptions,
  },
  props: {
    chatrooms: {
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
      moderator: 0,
      isEmpty: false,
      actionLoading: false,
    }
  },
  computed: {
    isLoading() {
      return this.$props.state
    },
    action() {
      return this.actionLoading
    },
  },
  methods: {
    enterRoom(id) {
      // store the id on user's chatroomId store and Cookie (i think i have an action already for a mutator)
      this.$store.dispatch('takeOverChat', id)
      // redirect admin to chatbot page
      this.$router.push('/chatbot')
    },
    async assignModerator(roomId) {
      this.actionLoading = true
      if (this.moderator === 0) {
        // remove the moderator from chatroom
      } else {
        await axios.post(
          `${process.env.baseUrl}/chat-rooms/assign`,
          {
            moderator_id: this.moderator,
            chatroom_id: roomId,
          },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${this.$store.getters.token}`,
            },
          }
        )
      }
      this.actionLoading = false
      this.$buefy.toast.open({
        message: 'Moderator Assigned',
        type: 'is-success',
      })
    },
  },
}
</script>

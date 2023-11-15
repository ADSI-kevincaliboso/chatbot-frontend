<template>
  <div>
    <h1>Chatrooms</h1>

    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Chatroom Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="chatroom in chatrooms" :key="chatroom.id">
            <td>{{ chatroom.id }}</td>
            <td>{{ chatroom.name }}</td>
            <td>
              <button @click="enterRoom(chatroom.id)">Enter Chatroom</button>

              <div v-show="$store.getters.userType === 'admin'">
                <ModeratorOptions v-model="moderator" />
                <button @click="assignModerator(chatroom.id)">
                  Assign Moderator
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
  },
  data() {
    return {
      moderator: 0,
    }
  },
  methods: {
    enterRoom(id) {
      // store the id on user's chatroomId store and Cookie (i think i have an action already for a mutator)
      this.$store.dispatch('takeOverChat', id)
      // redirect admin to chatbot page
      this.$router.push('/chatbot')
    },
    /**
     * #TODO
     */
    async assignModerator(roomId) {
      if (this.moderator === 0) {
        // remove the moderator from chatroom
      } else {
        // assign the chatroom to the moderator
        // use the store action too

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
    },
  },
}
</script>

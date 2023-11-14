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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatRooms',
  props: {
    chatrooms: {
      type: Array,
      required: true,
    },
  },
  methods: {
    enterRoom(id) {
      // store the id on user's chatroomId store and Cookie (i think i have an action already for a mutator)
      this.$store.dispatch('takeOverChat', id)
      // redirect admin to chatbot page
      this.$router.push('/chatbot')
    },
  },
}
</script>

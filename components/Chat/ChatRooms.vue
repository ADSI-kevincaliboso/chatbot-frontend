<template>
  <div>
    <h1>Chatrooms</h1>

    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Chatroom Name</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="chatroom in chatrooms" :key="chatroom.id">
            <td>{{ chatroom.id }}</td>
            <td>{{ chatroom.name }}</td>
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
}
</script>

<template>
  <div class="select">
    <select
      id="moderator"
      name="moderator"
      :value="value"
      @change="$emit('input', Number($event.target.value))"
    >
      <option :value="Number(0)" selected>Select moderator</option>
      <option
        v-for="user in moderatorList"
        :key="user.id"
        :value="Number(user.id)"
      >
        {{ user.name }}
      </option>
    </select>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ModeratorOptions',
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      moderators: [],
    }
  },
  computed: {
    moderatorList() {
      return this.moderators
    },
  },
  async created() {
    if (this.$store.getters.userType === 'admin') {
      return await axios
        .get(`${process.env.baseUrl}/users/moderators`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.$store.getters.token}`,
          },
        })
        .then((res) => {
          this.moderators = [...res.data]
        })
        .catch((e) => new Error('Users error'))
    }
  },
}
</script>

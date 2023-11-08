<template>
  <div>
    <TheNav :show="toggle" />
    <nuxt />
  </div>
</template>

<script>
import TheNav from '~/components/Shared/TheNav.vue'
export default {
  components: {
    TheNav,
  },
  computed: {
    toggle() {
      return this.$store.getters.isAuth
    },
  },
}
</script>

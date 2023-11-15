<template>
  <div>
    <TheNav />
    <nuxt />
  </div>
</template>

<script>
import TheNav from '~/components/Shared/TheNav.vue'
export default {
  name: 'Auth',
  components: {
    TheNav,
  },
}
</script>

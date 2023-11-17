<template>
  <div class="container is-fluid is-fullheight">
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

<style>
html,
body,
#__nuxt,
#__layout {
  height: 100% !important;
}
</style>

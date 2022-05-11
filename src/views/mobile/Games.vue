<template>
  <div id="MobileGames">
    <MobileHeader></MobileHeader>
    this is mobile Root
  </div>
</template>

<script>
  import MobileHeader from './components/MobileHeader.vue';
  export default {
    name: 'MobileGames',
    components: {
      MobileHeader,
    },
  };
</script>

<style lang="scss" scoped>
  #MobileGames {
  }
</style>

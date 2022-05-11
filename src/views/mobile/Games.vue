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

<style lang="scss">
  html {
    font-size: 15px;
    @media screen and (max-width: 500px) {
      font-size: 14px;
    }
    @media screen and (max-width: 400px) {
      font-size: 12px;
    }
    @media screen and (max-width: 300px) {
      font-size: 10px;
    }
  }
</style>

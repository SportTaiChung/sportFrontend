<template>
  <div id="Games">
    <div class="head">
      <GamesHeader></GamesHeader>
    </div>
    <div class="setUp">
      <GamesSetup></GamesSetup>
    </div>
    <div class="main">
      <!-- <nav-menu></nav-menu>
      <router-view /> -->
    </div>

    <div class="test">123trs</div>
  </div>
</template>

<script>
  import GamesHeader from '@/components/GamesHeader.vue';
  import GamesSetup from '@/components/GamesSetup.vue';
  export default {
    name: 'Games',
    components: { GamesHeader, GamesSetup },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #Games {
    height: 100%;
    .head {
      width: 100%;
      height: 70px;
      border-bottom: 1px solid #267258;
      @include base-background();
    }
    .setUp {
      width: 100%;
      height: 38px;
      @include background-color-hederTop();
    }
    .main {
      width: 100%;
      height: calc(100% - 108px);
      display: flex;
      nav-menu {
        height: 100%;
      }
      .main_body {
        width: 100%;
        height: 100%;
        display: flex;
        // @include background-color-hederTop();
        // background: #ffb5b5;
      }
    }
  }
</style>

<template>
  <div id="PCGames">
    <div class="head">
      <GamesHeader></GamesHeader>
    </div>
    <div class="setUp">
      <GamesSetup></GamesSetup>
    </div>
    <div class="main">
      <GamesNavMenu></GamesNavMenu>
      <GamesTableList></GamesTableList>
    </div>
  </div>
</template>

<script>
  import GamesHeader from './components/GamesHeader.vue';
  import GamesSetup from './components/GamesSetup.vue';
  import GamesNavMenu from './components/GamesNavMenu.vue';
  import GamesTableList from './components/GamesTableList.vue';
  export default {
    name: 'PCGames',
    components: { GamesHeader, GamesSetup, GamesNavMenu, GamesTableList },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #PCGames {
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
    }
  }
</style>

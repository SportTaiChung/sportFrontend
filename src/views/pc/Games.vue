<template>
  <div id="PCGames">
    <div class="head">
      <GamesHeader></GamesHeader>
    </div>
    <div class="setUp">
      <GamesSetup></GamesSetup>
    </div>
    <div class="main">
      <GamesNavMenu :isNavMenuCollapse.sync="isNavMenuCollapse"></GamesNavMenu>
      <GamesTableList :isNavMenuCollapse="isNavMenuCollapse"></GamesTableList>
      <MoreGame v-if="isShowMoreGame"></MoreGame>
      <GamesBetInfo />
    </div>
  </div>
</template>

<script>
  import GamesHeader from './components/GamesHeader.vue';
  import GamesSetup from './components/GamesSetup.vue';
  import GamesNavMenu from './components/GamesNavMenu.vue';
  import GamesTableList from './components/GamesTable/GamesTableList.vue';
  import MoreGame from './components/GamesTable/MoreGame.vue';
  import GamesBetInfo from './components/GamesBetInfo/GamesBetInfo.vue';
  export default {
    name: 'PCGames',
    components: { GamesHeader, GamesSetup, GamesNavMenu, GamesTableList, GamesBetInfo, MoreGame },
    data() {
      return {
        // 左側選單是否縮起選單
        isNavMenuCollapse: false,
      };
    },
    created() {
      //* Test 可在控制台下這個,來測試更新賠率
      //   game.setFakeUpdate({
      //     "LeagueID": 7859,
      //         "WagerTypeID": 101,
      //         "WagerGrpID": 0,
      //         "GameID": 100701236,
      //         "HdpPos": 2,
      //         "GameType": 1,
      //         "HomeHdp": "",
      //         "AwayHdp": "",
      //         "HomeHdpOdds": "1.84",
      //         "AwayHdpOdds": "",
      //         "OULine": "",
      //         "OverOdds": "0",
      //         "UnderOdds": "0",
      //         "HomeOdds": "0",
      //         "AwayOdds": "0",
      //         "DrewOdds": "0",
      //         "Status": 0,
      //         "EvtStatus": 0
      // })
      window.game = this;
      window.store = this.$store;
    },
    computed: {
      isShowMoreGame() {
        return this.$store.state.MoreGame.isShowMoreGame;
      },
    },
    methods: {
      setFakeUpdate(data) {
        this.$store.commit('Game/updateGameList', [data]);
      },
    },
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

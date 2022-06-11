<template>
  <div id="PCGames">
    <div class="head">
      <GamesHeader></GamesHeader>
    </div>
    <div class="setUp">
      <GamesSetup ref="GamesSetup" @SelectLeague="SelectLeague"></GamesSetup>
    </div>
    <div class="main">
      <GamesNavMenu
        ref="GamesNavMenu"
        :isNavMenuCollapse.sync="isNavMenuCollapse"
        @ChangeCat="ChangeCat()"
      ></GamesNavMenu>
      <GamesTableList
        :isNavMenuCollapse="isNavMenuCollapse"
        @AddToCart="AddToCartEvent()"
      ></GamesTableList>
      <MoreGame v-if="isShowMoreGame"></MoreGame>
      <GamesBetInfo ref="GamesBetInfo" @openSetup="isShowSetup = true" />
    </div>

    <GamesSetupNew v-show="isShowSetup" @closeMe="isShowSetup = false"></GamesSetupNew>
  </div>
</template>

<script>
  import GamesHeader from './components/GamesHeader.vue';
  import GamesSetup from './components/GamesSetup.vue';
  import GamesSetupNew from './components/GamesSetupNew.vue';
  import GamesNavMenu from './components/GamesNavMenu.vue';
  import GamesTableList from './components/GamesTable/GamesTableList.vue';
  import MoreGame from '../../components/MoreGame.vue';
  import GamesBetInfo from './components/GamesBetInfo/GamesBetInfo.vue';
  export default {
    name: 'PCGames',
    components: {
      GamesHeader,
      GamesSetup,
      GamesSetupNew,
      GamesNavMenu,
      GamesTableList,
      GamesBetInfo,
      MoreGame,
    },
    data() {
      return {
        // 左側選單是否縮起選單
        isNavMenuCollapse: false,
        isShowSetup: false,
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
      AddToCartEvent() {
        this.$refs.GamesBetInfo.resetGroupIndex();
      },
      SelectLeague() {
        this.$refs.GamesNavMenu.reCallGameDetailAPI();
      },
      ChangeCat() {
        this.$refs.GamesSetup.clearLeagueList();
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

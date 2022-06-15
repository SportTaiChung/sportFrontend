<template>
  <div id="PCGames">
    <div class="head">
      <GamesHeader @openService="openService()"></GamesHeader>
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
      <MoreGame v-if="isShowMoreGame" @AddToCart="AddToCartEvent()"></MoreGame>
      <GamesBetInfo
        ref="GamesBetInfo"
        @openSetting="
          isShowSetting = true;
          $refs.GamesSettingDialog.loadSettings();
        "
      />
    </div>

    <GamesSettingDialog
      ref="GamesSettingDialog"
      v-show="isShowSetting"
      @closeMe="isShowSetting = false"
    ></GamesSettingDialog>
    <ServiceChat :isOpen="isOpenServiceChat" @closeMe="isOpenServiceChat = false"></ServiceChat>
  </div>
</template>

<script>
  import GamesHeader from './components/GamesHeader.vue';
  import GamesSetup from './components/GamesSetup.vue';
  import GamesSettingDialog from './components/GamesSettingDialog.vue';
  import GamesNavMenu from './components/GamesNavMenu.vue';
  import GamesTableList from './components/GamesTable/GamesTableList.vue';
  import MoreGame from '../../components/MoreGame.vue';
  import GamesBetInfo from './components/GamesBetInfo/GamesBetInfo.vue';
  import ServiceChat from '@/components/ServiceChat';
  export default {
    name: 'PCGames',
    components: {
      GamesHeader,
      GamesSetup,
      GamesSettingDialog,
      GamesNavMenu,
      GamesTableList,
      GamesBetInfo,
      MoreGame,
      ServiceChat,
    },
    data() {
      return {
        // 左側選單是否縮起選單
        isNavMenuCollapse: false,
        isShowSetting: false,
        isOpenServiceChat: false,
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
      openService() {
        this.isOpenServiceChat = true;
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

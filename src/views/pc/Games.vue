<template>
  <div id="PCGames">
    <div class="head">
      <GamesHeader
        :unreadQACount="unreadQACount"
        @openService="openServiceChat()"
        @openPersonal="openPersonal()"
      ></GamesHeader>
    </div>
    <div class="setUp">
      <GamesSetup
        ref="GamesSetup"
        :isShowGameBet="isShowGameBet"
        @SelectLeague="SelectLeague"
        @ClickShowGameBet="ShowGameBet"
      ></GamesSetup>
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
        v-show="isShowGameBet"
        @openSetting="
          isShowSetting = true;
          $refs.GamesSettingDialog.loadSettings();
        "
        @openStrayCount="isShowStrayCount = true"
      />
    </div>

    <GamesSettingDialog
      ref="GamesSettingDialog"
      v-show="isShowSetting"
      @closeMe="isShowSetting = false"
    ></GamesSettingDialog>

    <StrayCountDialog
      ref="StrayCountDialog"
      v-if="isShowStrayCount"
      @closeMe="isShowStrayCount = false"
    ></StrayCountDialog>

    <!-- 客服聊天室窗 -->
    <ServiceChat
      :isOpen="isOpenServiceChat"
      @closeMe="isOpenServiceChat = false"
      @updateUnreadCount="updateUnreadCount"
    ></ServiceChat>

    <PersonalPanel v-if="isOpenPersonalPanel" @closeMe="isOpenPersonalPanel = false">
    </PersonalPanel>

    <ChatSocket></ChatSocket>
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
  import StrayCountDialog from './components/StrayCountDialog.vue';
  import ServiceChat from '@/components/ServiceChat';
  import PersonalPanel from '@/components/PersonalPanel';
  import ChatSocket from '@/components/ChatSocket';

  export default {
    name: 'PCGames',
    components: {
      GamesHeader,
      GamesSetup,
      GamesSettingDialog,
      StrayCountDialog,
      GamesNavMenu,
      GamesTableList,
      GamesBetInfo,
      MoreGame,
      ServiceChat,
      PersonalPanel,
      ChatSocket,
    },
    data() {
      return {
        // 左側選單是否縮起選單
        isNavMenuCollapse: false,
        // 顯示設定
        isShowSetting: false,
        // 顯示過關計算器
        isShowStrayCount: false,
        // 顯示客服對話
        isOpenServiceChat: false,
        // 顯示投注面板
        isShowGameBet: false,
        // 顯示個人設置
        isOpenPersonalPanel: false,
        // QA未讀數量
        unreadQACount: 0,

        websocketObj: null,
        wsHeartflag: false,
        reconnectTime: 0,
      };
    },
    created() {
      //* Test 可在控制台下這個,來測試更新賠率
      //   game.setFakeUpdate({
      //     "LeagueID": 1247,
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
      //         "EvtStatus": -1
      // })
      window.game = this;
      window.store = this.$store;
    },
    mounted() {
      this.updateIsNavMenuCollapse();
    },
    computed: {
      isShowMoreGame() {
        return this.$store.state.MoreGame.isShowMoreGame;
      },
      ScreenWidth() {
        return this.$store.state.ScreenWidth;
      },
      isAddNewToChart() {
        return this.$store.state.BetCart.isAddNewToChart;
      },
    },
    watch: {
      ScreenWidth() {
        this.updateIsNavMenuCollapse();
      },
      // 有新增投注到購物車事件
      isAddNewToChart() {
        this.isShowGameBet = true;
      },
      isOpenServiceChat: {
        handler() {
          this.$store.commit('Game/setIsShowService', this.isOpenServiceChat);
        },
        immediate: true,
      },
    },
    methods: {
      ShowGameBet(val) {
        this.isShowGameBet = val;
      },
      updateIsNavMenuCollapse() {
        if (this.ScreenWidth < 1400) {
          this.isNavMenuCollapse = true;
        }
      },
      setFakeUpdate(data) {
        this.$store.commit('Game/updateGameList', {
          isUpdateFromOtherStore: false,
          updateData: [data],
        });
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
      openServiceChat() {
        this.isOpenServiceChat = true;
      },
      openPersonal() {
        this.isOpenPersonalPanel = true;
      },
      updateUnreadCount(count) {
        this.unreadQACount = count;
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

<template>
  <div id="MobileGames">
    <div class="main-layout">
      <!-- HEADER -->
      <MobileHeader
        ref="header"
        :activeCollapse="activeCollapse"
        :unreadQACount="unreadQACount"
        @toggleAllCollapse="toggleAllCollapse()"
        @openService="openService()"
        @ChangeCat="ChangeCat()"
      ></MobileHeader>

      <!-- 主遊戲 table 容器 -->
      <div class="gameTableContainer">
        <template v-if="GameList.length">
          <mGameTable
            v-for="(gameData, index) in GameList"
            :key="index"
            :gameData="gameData"
            :isExpanded="isExpanded(index)"
            :hasMoreGame="gameData.Items.hasMoreCount"
            @openWagerTypePopup="isShowWagerTypePopup = true"
          ></mGameTable>
        </template>
        <template v-else>
          <div class="noData" v-if="!$store.state.isLoading"> 暫無賽事 </div>
        </template>
      </div>

      <!-- FOOTER -->
      <MobileFooter
        :hasLeagueFiltered="hasLeagueFiltered"
        @openBetInfoPopup="openBetInfoPopup()"
        @openBetRecordView="openBetRecordView()"
        @openMenuPanel="openMenuPanel()"
        @openLeaguesPanel="openLeaguesPanel()"
      ></MobileFooter>
    </div>

    <div class="fixed-container">
      <MoreGame v-if="isShowMoreGame" @openBetRecordView="openBetRecordView()"></MoreGame>

      <!-- 下注面板 (多注時) -->
      <mGamesBetInfoAll
        v-show="isShowBetInfo && betCartList.length !== 1"
        @onCloseBetInfo="isShowBetInfo = false"
      ></mGamesBetInfoAll>

      <!-- 下注面板 (單注時) -->
      <mGamesBetInfoSingle
        v-show="betCartList.length === 1 && isShowBetInfoSingle"
        @onHide="isShowBetInfoSingle = false"
      ></mGamesBetInfoSingle>

      <!-- 投注紀錄面板 -->
      <mBetRecordView
        v-if="isShowBetRecordView"
        @onCloseBetRecordView="isShowBetRecordView = false"
      ></mBetRecordView>

      <!-- 玩法選擇彈窗 -->
      <mWagerTypePopup
        v-if="isShowWagerTypePopup"
        @closeWagerTypePopup="isShowWagerTypePopup = false"
      ></mWagerTypePopup>

      <!-- 功能選單 -->
      <mMenuPanel
        :isOpen="isOpenMenuPanel"
        @closeMe="isOpenMenuPanel = false"
        @updateGameDetail="$refs.header.reCallGameDetailAPI()"
        @openStrayCount="isShowStrayCount = true"
      ></mMenuPanel>

      <!-- 聯盟選擇面板 -->
      <mLeaguesPanel
        ref="leaguesPanel"
        :isOpen="isOpenLeaguesPanel"
        @closeMe="isOpenLeaguesPanel = false"
        @onLeaguesListChanged="$refs.header.reCallGameDetailAPI()"
        @hasLeagueFiltered="(val) => (hasLeagueFiltered = val)"
      ></mLeaguesPanel>

      <!-- 過關計算器 -->
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
    </div>
  </div>
</template>

<script>
  import MobileHeader from './components/MobileHeader.vue';
  import MobileFooter from './components/MobileFooter.vue';
  import mGameTable from './components/mGameTable.vue';
  import mGamesBetInfoAll from './components/mGamesBetInfoAll.vue';
  import mGamesBetInfoSingle from './components/mGamesBetInfoSingle.vue';
  import mBetRecordView from './components/mBetRecordView.vue';
  import mWagerTypePopup from './components/mWagerTypePopup.vue';
  import mMenuPanel from './components/mMenuPanel.vue';
  import MoreGame from '@/components/MoreGame.vue';
  import ServiceChat from '@/components/ServiceChat.vue';
  import mLeaguesPanel from './components/mLeaguesPanel.vue';
  import StrayCountDialog from '../pc/components/StrayCountDialog.vue';

  export default {
    name: 'MobileGames',
    components: {
      MobileHeader,
      MobileFooter,
      mGameTable,
      mGamesBetInfoAll,
      mGamesBetInfoSingle,
      mBetRecordView,
      mWagerTypePopup,
      mMenuPanel,
      mLeaguesPanel,
      MoreGame,
      ServiceChat,
      StrayCountDialog,
    },
    data() {
      return {
        activeCollapse: [],
        isShowBetInfo: false,
        isShowBetInfoSingle: true,
        isShowBetRecordView: false,
        isShowWagerTypePopup: false,
        isOpenMenuPanel: false,
        isOpenLeaguesPanel: false,
        isOpenServiceChat: false,
        isShowStrayCount: false,
        // QA未讀數量
        unreadQACount: 0,
        hasLeagueFiltered: false,
      };
    },
    computed: {
      GameList() {
        return this.gameStore.GameList;
      },
      gameStore() {
        return this.$store.state.Game;
      },
      isShowMoreGame() {
        return this.$store.state.MoreGame.isShowMoreGame;
      },
      betCartList() {
        return this.$store.state.BetCart.betCartList;
      },
    },
    methods: {
      toggleCollapse(index) {
        if (this.activeCollapse.includes(index)) {
          this.activeCollapse = this.activeCollapse.filter((it) => it !== index);
        } else {
          this.activeCollapse.push(index);
        }
      },
      toggleAllCollapse() {
        this.activeCollapse =
          this.activeCollapse.length > 0
            ? []
            : new Array(this.GameList.length).fill(0).map((it, index) => index);
      },
      isExpanded(index) {
        return this.activeCollapse.includes(index);
      },
      openBetInfoPopup() {
        if (this.betCartList.length === 1) {
          this.isShowBetInfoSingle = true;
        } else {
          this.isShowBetInfo = true;
        }
      },
      openBetRecordView() {
        this.isShowBetRecordView = true;
      },
      openMenuPanel() {
        this.isOpenMenuPanel = true;
      },
      openLeaguesPanel() {
        this.isOpenLeaguesPanel = true;
      },
      openService() {
        this.isOpenServiceChat = true;
      },
      updateUnreadCount(count) {
        this.unreadQACount = count;
      },
      ChangeCat() {
        this.$refs.leaguesPanel.clearLeagueList();
      },
    },
    watch: {
      betCartList(list) {
        list.length === 0 && (this.isShowBetInfoSingle = true);
      },
    },
  };
</script>

<style lang="scss">
  html {
    font-size: 15px;
    @media screen and (max-width: 1000px) {
      font-size: 14px;
    }
    @media screen and (max-width: 768px) {
      font-size: 12px;
    }
    @media screen and (max-width: 350px) {
      font-size: 10px;
    }
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }

  #MobileGames {
    width: 100%;
    height: 100%;

    .main-layout {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      .gameTableContainer {
        overflow: auto;
        flex: 1;

        .noData {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
      }

      .el-collapse-item__header {
        line-height: 200%;
        height: auto;
        background-color: #e8e8e8;
        border-bottom: 2px solid #d0d0d0;
      }
    }
    .fixed-container {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;

      & > div {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
      }
    }
  }
</style>

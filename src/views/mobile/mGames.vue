<template>
  <div id="MobileGames">
    <div class="main-layout">
      <!-- HEADER -->
      <MobileHeader
        ref="header"
        :activeCollapse="activeCollapse"
        @toggleAllCollapse="toggleAllCollapse"
      ></MobileHeader>

      <!-- 主遊戲 table 容器 -->
      <div class="gameTableContainer">
        <template v-if="GameList.length">
          <mGameTable
            v-for="(gameData, index) in GameList"
            :key="index"
            :gameData="gameData"
            :isExpanded="isExpanded(index)"
            @openWagerTypePopup="isShowWagerTypePopup = true"
          ></mGameTable>
        </template>
        <template v-else>
          <div class="noData" v-if="!$store.state.isLoading"> NO DATA </div>
        </template>
      </div>

      <!-- FOOTER -->
      <MobileFooter
        @onOpenBetInfoPopup="onOpenBetInfoPopup"
        @onOpenBetRecordView="onOpenBetRecordView"
        @onOpenMorePanel="onOpenMorePanel"
      ></MobileFooter>
    </div>

    <div class="fixed-container">
      <MoreGame v-if="isShowMoreGame" @onOpenBetRecordView="onOpenBetRecordView"></MoreGame>

      <mGamesBetInfoAll
        v-show="isShowBetInfo && betCartList.length !== 1"
        @onCloseBetInfo="isShowBetInfo = false"
      ></mGamesBetInfoAll>

      <mGamesBetInfoSingle
        v-show="betCartList.length === 1 && isShowBetInfoSingle"
        @onHide="isShowBetInfoSingle = false"
      ></mGamesBetInfoSingle>

      <mBetRecordView
        v-if="isShowBetRecordView"
        @onCloseBetRecordView="isShowBetRecordView = false"
      ></mBetRecordView>

      <mWagerTypePopup
        v-if="isShowWagerTypePopup"
        @closeWagerTypePopup="isShowWagerTypePopup = false"
      ></mWagerTypePopup>

      <mMenuPanel
        v-show="isShowMorePanel"
        @closeMorePanel="isShowMorePanel = false"
        @updateGameDetail="$refs.header.reCallGameDetailAPI()"
      ></mMenuPanel>
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
  import mWagerTypePopup from './components/mWagerTypePopup';
  import mMenuPanel from './components/mMenuPanel';
  import MoreGame from '../../components/MoreGame.vue';

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
      MoreGame,
    },
    data() {
      return {
        activeCollapse: [],
        isShowBetInfo: false,
        isShowBetInfoSingle: true,
        isShowBetRecordView: false,
        isShowWagerTypePopup: false,
        isShowMorePanel: false,
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
      onOpenBetInfoPopup() {
        this.isShowBetInfo = true;
      },
      onOpenBetRecordView() {
        this.isShowBetRecordView = true;
      },
      onOpenMorePanel() {
        this.isShowMorePanel = true;
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
    width: 100vw;
    height: 100vh;
  }

  #MobileGames {
    width: 100vw;
    height: 100vh;

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

<template>
  <div id="MobileGames">
    <div class="main-layout">
      <!-- HEADER -->
      <MobileHeader
        :activeCollapse="activeCollapse"
        @toggleAllCollapse="toggleAllCollapse"
        @openWagerTypePopup="isShowWagerTypePopup = true"
      ></MobileHeader>

      <!-- 主遊戲 table 容器 -->
      <div class="gameTableContainer" v-if="GameList.length !== 0">
        <div style="display: flex">
          <!-- 左半邊 - 隊伍資訊 -->
          <div class="left-area">
            <mGameInfo
              v-for="(source, index) in GameList[0].Items.List"
              :key="index"
              :source="source"
              :isExpanded="isExpanded(index)"
              @toggleCollapse="toggleCollapse(index)"
            ></mGameInfo>
          </div>
          <!-- 右半邊 - 下注資訊-->
          <div class="right-area">
            <div v-for="(source, index) in GameList[0].Items.List" :key="index">
              <mGameBetting
                :source="source"
                :bestHead="GameList[0].Items.BestHead"
                :isExpanded="isExpanded(index)"
                @toggleCollapse="toggleCollapse(index)"
              ></mGameBetting>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <MobileFooter
        @onOpenBetInfoPopup="onOpenBetInfoPopup"
        @onOpenBetRecordView="onOpenBetRecordView"
        @onOpenMorePanel="onOpenMorePanel"
      ></MobileFooter>
    </div>

    <div class="fixed-container">
      <MoreGame v-if="isShowMoreGame"></MoreGame>

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

      <mMenuPanel v-show="isShowMorePanel" @closeMorePanel="isShowMorePanel = false"></mMenuPanel>
    </div>
  </div>
</template>

<script>
  import MobileHeader from './components/MobileHeader.vue';
  import MobileFooter from './components/MobileFooter.vue';
  import mGameInfo from './components/mGameInfo.vue';
  import mGameBetting from './components/mGameBetting.vue';
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
      mGameInfo,
      mGameBetting,
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

        .left-area {
          width: 35%;
          transition: width 600ms ease-out;

          @media screen and(max-width: 480px) {
            width: calc(200px);
          }
        }
        .right-area {
          flex: 1;
          overflow-x: auto;
          overflow-y: hidden;
          box-shadow: inset 0px 0px 15px rgba(0, 0, 0, 0.1);
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

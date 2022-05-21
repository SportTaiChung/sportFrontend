<template>
  <div id="MobileGames">
    <div class="main-layout">
      <!-- HEADER -->
      <MobileHeader
        :activeCollapse="activeCollapse"
        @toggleAllCollapse="toggleAllCollapse"
      ></MobileHeader>

      <!-- 主遊戲 table 容器 -->
      <div class="gameTableContainer">
        <div style="display: flex">
          <!-- 左半邊 - 隊伍資訊 -->
          <div class="left-area">
            <mGameInfo
              v-for="(source, index) in GameList"
              :key="index"
              :source="source"
              :isExpanded="isExpanded(index)"
              @toggleCollapse="toggleCollapse(index)"
            ></mGameInfo>
          </div>
          <!-- 右半邊 - 下注資訊-->
          <div class="right-area">
            <mGameBetting
              v-for="(source, index) in GameList"
              :key="index"
              :source="source"
              :isExpanded="isExpanded(index)"
              @toggleCollapse="toggleCollapse(index)"
            ></mGameBetting>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <MobileFooter @onOpenBetInfoPopup="isShowBetInfo = true"></MobileFooter>
    </div>

    <div class="float-layout">
      <mGamesBetInfoAll
        v-if="isShowBetInfo"
        @onCloseBetInfo="isShowBetInfo = false"
      ></mGamesBetInfoAll>
    </div>
  </div>
</template>

<script>
  import MobileHeader from './components/MobileHeader.vue';
  import MobileFooter from './components/MobileFooter.vue';
  import mGameInfo from './components/mGameInfo.vue';
  import mGameBetting from './components/mGameBetting.vue';
  import mGamesBetInfoAll from './components/mGamesBetInfoAll.vue';

  export default {
    name: 'MobileGames',
    components: {
      MobileHeader,
      MobileFooter,
      mGameInfo,
      mGameBetting,
      mGamesBetInfoAll,
    },
    data() {
      return {
        activeCollapse: [],
        isShowBetInfo: false,
      };
    },

    computed: {
      GameList() {
        return this.$store.getters['Game/gameListFinalData'];
      },
      gameStore() {
        return this.$store.state.Game;
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
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;

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
          overflow-x: overlay;
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
    .float-layout {
    }
  }
</style>

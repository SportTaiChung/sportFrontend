<template>
  <div id="MobileGames">
    <!-- HEADER -->
    <MobileHeader></MobileHeader>

    <!-- 主遊戲 table 容器 -->
    <div class="gameTableContainer">
      <div style="display: flex">
        <!-- 左半邊 - 隊伍資訊 -->
        <div class="left-area">
          <virtual-list
            class="virtual-list"
            :data-key="'uid'"
            :data-sources="GameList"
            :data-component="itemComponent"
            :keeps="40"
          />
        </div>
        <!-- 右半邊 - 下注資訊-->
        <div class="right-area">
          <mGameBetting
            v-for="(gameData, index) in GameList"
            :key="index"
            :gameData="gameData"
          ></mGameBetting>
        </div>
      </div>
    </div>
    <MobileFooter></MobileFooter>
  </div>
</template>

<script>
  import MobileHeader from './components/MobileHeader.vue';
  import MobileFooter from './components/MobileFooter.vue';
  import VirtualList from 'vue-virtual-scroll-list';
  import mGameInfo from './components/mGameInfo.vue';
  import mGameBetting from './components/mGameBetting.vue';

  export default {
    name: 'MobileGames',
    components: {
      MobileHeader,
      MobileFooter,
      VirtualList,
      mGameBetting,
    },
    data() {
      return {
        itemComponent: mGameInfo,
        activeCollapse: [],
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
    methods: {},
  };
</script>

<style lang="scss">
  html {
    font-size: 15px;
    @media screen and (max-width: 500px) {
      font-size: 14px;
    }
    @media screen and (max-width: 400px) {
      font-size: 12px;
    }
    @media screen and (max-width: 300px) {
      font-size: 10px;
    }
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }

  #MobileGames {
    display: flex;
    flex-direction: column;
    height: 100%;

    .gameTableContainer {
      overflow: auto;
      flex: 1;

      .left-area {
        width: 35%;
        transition: width 600ms ease-out;

        @media screen and(max-width: 480px) {
          width: calc(170px);
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

    table.betting-table {
      th {
        height: 33px;
        background-color: #e8e8e8;
      }
      td {
        height: 33px;
        min-width: 100px;
        text-align: center;
      }
    }
  }
</style>

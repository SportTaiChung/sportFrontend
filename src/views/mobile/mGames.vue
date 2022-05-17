<template>
  <div id="MobileGames">
    <!-- HEADER -->
    <MobileHeader></MobileHeader>

    <!-- 遊戲類型 -->
    <ul class="gameTypeNav">
      <li
        v-for="(catData, index) in gameStore.BallTypeList"
        :key="index"
        class="gameTypeItem"
        :class="gameStore.selectCatID == catData.catid ? 'active' : ''"
        @click.stop="menuItemClickHandler(catData, null, index)"
      >
        <i class="el-icon-basketball"></i>
        {{ catData.catName }}
      </li>
    </ul>

    <!-- 玩法類型 -->
    <div class="playTypeBar">
      <div class="playTypeBtn">美足 - 全場 / 上半</div>

      <i class="el-collapse-item__arrow el-icon-arrow-right is-active"></i>
    </div>

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
  </div>
</template>

<script>
  import MobileHeader from './components/MobileHeader.vue';
  import VirtualList from 'vue-virtual-scroll-list';
  import mGameInfo from './components/mGameInfo.vue';
  import mGameBetting from './components/mGameBetting.vue';

  export default {
    name: 'MobileGames',
    components: {
      MobileHeader,
      VirtualList,
      mGameBetting,
    },
    data() {
      return {
        itemComponent: mGameInfo,
        activeCollapse: [],
      };
    },
    mounted() {
      if (this.gameStore.BallTypeList.length !== 0) {
        // 一進入頁面預設選取第一個
        this.menuItemClickHandler(this.gameStore.BallTypeList[0], null, 0);
      }

      // 10秒打一次
      this.intervalEvent = setInterval(() => {
        this.$store.dispatch('Game/GetGameDetailSmall');
      }, 10000);
    },
    computed: {
      GameList() {
        return this.$store.getters['Game/gameListFinalData'];
      },
      gameStore() {
        return this.$store.state.Game;
      },
      gameTypeID() {
        return parseInt(this.$route.query.gameType);
      },
    },
    methods: {
      menuItemClickHandler(catData, WagerTypeKey, catIndex, isDefaultSystemSelect = false) {
        let clickCatID = null;
        let clickWagerTypeKey = null;

        clickCatID = catData.catid;

        if (catData.Items.length === 0) {
          clickWagerTypeKey = 1;
        } else {
          clickWagerTypeKey = catData.Items[0].WagerTypeKey;
        }
        // 獲取遊戲detail
        this.callGetGameDetail(clickCatID, clickWagerTypeKey);
      },

      callGetGameDetail(CatID, WagerTypeKey) {
        let postData = null;

        //* Test 測試CODE 指定數據
        if (false) {
          postData = {
            GameType: 1,
            CatID: 102,
            WagerTypeKey: 1,
          };
        } else {
          postData = {
            GameType: this.gameTypeID,
            CatID,
            WagerTypeKey,
          };
        }
        this.$store.dispatch('Game/GetGameDetail', postData).then((res) => {
          console.log(
            'getGameDetail done GameType CatID WagerTypeKey',
            this.gameTypeID,
            CatID,
            WagerTypeKey
          );
        });
      },
    },
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
    ul.gameTypeNav {
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: center;
      min-height: 50px;
      padding: 0.4rem;
      width: 100%;
      background-color: #3fa381;
      overflow-x: auto;
      overflow-y: hidden;

      li {
        width: 68px;
        height: 100%;
        display: flex;
        flex: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        text-align: center;
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.6);

        &.active {
          color: #fff;
        }

        i {
          font-size: 150%;
        }
      }
    }

    .playTypeBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8em;
      line-height: 1em;
      color: #fff;
      padding: 5px;
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      z-index: 5;
      background-color: #7d9364;

      .playTypeBtn {
        border: 1px solid #fff;
        border-radius: 45px;
        padding: 2px 22px;
        line-height: normal;
        background-color: rgba(255, 255, 255, 0.15);
      }
    }

    .gameTableContainer {
      height: calc(100vh - 200px);
      overflow: auto;

      .left-area {
        width: 35%;
        transition: width 500ms ease-out;

        @media screen and(max-width: 480px) {
          width: calc(170px);
        }
      }
      .right-area {
        float: left;
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

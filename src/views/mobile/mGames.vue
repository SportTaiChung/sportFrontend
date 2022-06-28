<template>
  <div id="MobileGames">
    <div class="main-layout">
      <!-- HEADER -->
      <MobileHeader
        :unreadQACount="unreadQACount"
        @openService="openService()"
        @gameTypeClickHandler="gameTypeClickHandler"
      ></MobileHeader>

      <!-- 彩種導覽列 -->
      <mGameCatNav
        @onCatTypeClick="menuItemClickHandler"
        @callGetFavoriteGameDetail="callGetFavoriteGameDetail()"
      ></mGameCatNav>

      <!-- 主遊戲 table 容器 -->
      <div class="gameTableContainer">
        <template v-if="GameList.length">
          <!-- loop 當前彩種所有賽事 -->
          <mGameTable
            v-for="(gameData, index) in GameList"
            :key="index"
            :gameData="gameData"
            :hasMoreGame="gameData.Items.hasMoreCount"
            @openWagerTypePopup="isShowWagerTypePopup = true"
          ></mGameTable>
        </template>
        <template v-else>
          <!-- 無賽事 -->
          <div class="noData" v-if="!$store.state.isLoading"> {{ $t('Common.NoGame') }} </div>
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
        ref="betInfoAll"
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
        @updateGameDetail="reCallGameDetailAPI()"
        @openStrayCount="isShowStrayCount = true"
      ></mMenuPanel>

      <!-- 聯盟選擇面板 -->
      <mLeaguesPanel
        ref="leaguesPanel"
        :isOpen="isOpenLeaguesPanel"
        @closeMe="isOpenLeaguesPanel = false"
        @onLeaguesListChanged="reCallGameDetailAPI()"
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
  import mGameTable from './components/GameTable/mGameTable.vue';
  import mGamesBetInfoAll from './components/mGamesBetInfoAll.vue';
  import mGamesBetInfoSingle from './components/mGamesBetInfoSingle.vue';
  import mBetRecordView from './components/mBetRecordView.vue';
  import mWagerTypePopup from './components/mWagerTypePopup.vue';
  import mMenuPanel from './components/MenuPanel/mMenuPanel.vue';
  import MoreGame from '@/components/MoreGame.vue';
  import ServiceChat from '@/components/ServiceChat.vue';
  import mLeaguesPanel from './components/mLeaguesPanel.vue';
  import StrayCountDialog from '../pc/components/StrayCountDialog.vue';
  import mGameCatNav from './components/mGameCatNav.vue';

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
      mGameCatNav,
    },
    mounted() {
      if (this.gameStore.MenuList.length !== 0) {
        // 一進入頁面預設選取第一個
        this.menuItemClickHandler(this.gameStore.MenuList[0], null, 0);
      } else {
        this.$store.commit('SetLoading', false);
      }

      // 更新 賠率: 每10秒
      this.intervalEvent = setInterval(() => {
        if (this.isFavoriteMode) {
          this.$store.dispatch('Game/GetFavoriteGameDetailSmall');
        } else {
          this.$store.dispatch('Game/GetGameDetailSmall');
        }
      }, 10000);

      // 更新 MENU: 每20秒
      this.intervalEvent2 = setInterval(() => {
        this.$store.dispatch('Game/GetMenuGameCatList', false);
      }, 20000);

      // 強制修正 viewport高度
      function syncHeight() {
        document.documentElement.style.setProperty(
          '--window-inner-height',
          `${window.innerHeight}px`
        );
      }
      window.addEventListener('resize', syncHeight);

      // 強制禁用 ios 兩指縮放 (舊)
      document.documentElement.addEventListener(
        'touchstart',
        function (event) {
          if (event.touches.length > 1) {
            event.preventDefault();
          }
        },
        false
      );

      // 強制禁用 ios 兩指縮放 (新)
      document.documentElement.addEventListener(
        'gesturestart',
        function (event) {
          event.preventDefault();
        },
        false
      );

      // 強制禁用 ios 點兩下縮放
      var lastTouchEnd = 0;
      document.documentElement.addEventListener(
        'touchend',
        function (event) {
          var now = Date.now();
          if (now - lastTouchEnd <= 300 && event.cancelable) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );
    },
    beforeDestroy() {
      clearInterval(this.intervalEvent);
      clearInterval(this.intervalEvent2);
    },
    data() {
      return {
        isShowBetInfo: false,
        isShowBetInfoSingle: true,
        isShowBetRecordView: false,
        isShowWagerTypePopup: false,
        isOpenMenuPanel: false,
        isOpenLeaguesPanel: false,
        isOpenServiceChat: false,
        isShowStrayCount: false,
        latestSelectCatId: null,
        latestSelectWagerTypeKey: null,
        // QA未讀數量
        unreadQACount: 0,
        hasLeagueFiltered: false,

        // interval IDs
        intervalEvent: null,
        intervalEvent2: null,
      };
    },
    computed: {
      GameList() {
        return this.gameStore.GameList;
      },
      gameStore() {
        return this.$store.state.Game;
      },
      gameTypeID() {
        return this.$store.state.Game.selectGameType;
      },
      isFavoriteMode() {
        return this.gameStore.selectCatID === -999;
      },
      isShowMoreGame() {
        return this.$store.state.MoreGame.isShowMoreGame;
      },
      betCartList() {
        return this.$store.state.BetCart.betCartList;
      },
      isCallGameDetailAPI() {
        return this.$store.state.Game.isCallGameDetailAPI;
      },
      favorites() {
        return this.$store.state.Setting.UserSetting.favorites;
      },
    },
    methods: {
      menuItemClickHandler(catData, WagerTypeKey) {
        // 清除聯盟篩選
        this.clearLeagueList();

        const clickCatID = catData.catid;

        if (WagerTypeKey === null) {
          if (catData.Items.length === 0) {
            WagerTypeKey = 1;
          } else {
            WagerTypeKey = catData.Items[0].WagerTypeKey;
          }
        }
        this.latestSelectCatId = clickCatID;
        this.latestSelectWagerTypeKey = WagerTypeKey;
        // 獲取遊戲detail
        this.callGetGameDetail(clickCatID, WagerTypeKey);
      },
      callGetGameDetail(CatID, WagerTypeKey = null, updateBehind = false) {
        if (!updateBehind) {
          this.$store.commit('SetLoading', true);
        }
        let postData = null;
        postData = {
          GameType: this.gameTypeID,
          CatID,
          WagerTypeKey,
        };

        this.$store.dispatch('Game/GetGameDetail', { postData, updateBehind }).then((res) => {
          console.log(
            'getGameDetail done GameType CatID WagerTypeKey',
            this.gameTypeID,
            CatID,
            WagerTypeKey
          );
          this.$store.commit('SetLoading', false);
        });
      },
      reCallGameDetailAPI() {
        const catId = this.latestSelectCatId || this.gameStore.selectCatID;
        const WagerTypeKey = this.latestSelectWagerTypeKey || this.gameStore.selectWagerTypeKey;
        this.callGetGameDetail(catId, WagerTypeKey);
      },
      gameTypeClickHandler(gameType) {
        console.log(gameType);
        this.$store.commit('Game/setGameType', gameType);
        const menuData = this.gameStore.FullMenuList.find((menu) => menu.GameType === gameType);
        const catid = menuData.LeftMenu.item.length !== 0 ? menuData.LeftMenu.item[0].catid : 1;
        this.callGetGameDetail(catid, null);
        this.$store.dispatch('Game/GetMenuGameCatList', true);
      },
      // 最愛
      callGetFavoriteGameDetail(isUpdateBehind = false) {
        if (!isUpdateBehind) {
          this.$store.commit('SetLoading', true);
        }
        this.$store
          .dispatch('Game/GetFavoriteGameDetail')
          .then((res) => {})
          .finally(() => {
            if (!isUpdateBehind) {
              this.$store.commit('SetLoading', false);
            }
          });
      },
      openBetInfoPopup() {
        if (this.betCartList.length === 1) {
          this.isShowBetInfoSingle = true;
        } else {
          this.isShowBetInfo = true;
          this.$refs.betInfoAll.tabIndex = 1;
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
      clearLeagueList() {
        this.$refs.leaguesPanel.clearLeagueList();
        this.$store.commit('Game/changeCatReset');
      },
    },
    watch: {
      betCartList(list) {
        list.length === 0 && (this.isShowBetInfoSingle = true);
      },
      isCallGameDetailAPI: {
        handler() {
          if (this.isFavoriteMode) {
            this.callGetFavoriteGameDetail(true);
          } else {
            this.callGetGameDetail(
              this.gameStore.selectCatID,
              this.gameStore.selectWagerTypeKey,
              true
            );
          }
        },
      },
      favorites(val) {
        if (val.length === 0 && this.isFavoriteMode) {
          this.reCallGameDetailAPI();
        }
      },
    },
  };
</script>

<style lang="scss">
  :root {
    --window-inner-height: 100%;
  }

  * {
    user-select: none;
  }
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
    height: var(--window-inner-height);
    margin-top: 0.01px;
    overflow-x: hidden;
    overflow-y: hidden;
    touch-action: manipulation;
    margin-top: 0.01px;
  }

  body {
    margin-bottom: 0px;
    margin-top: 0px;
    margin-left: 0px;
    margin-right: 0px;
    padding-bottom: 0px;
    padding-top: 0px;
    padding-left: 0px;
    padding-right: 0px;
    touch-action: manipulation;
    text-size-adjust: 100%;
    -webkit-overflow-scrolling: touch;
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

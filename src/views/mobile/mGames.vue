<template>
  <div id="MobileGames">
    <!-- 主要布局 -->
    <div class="main-layout">
      <!-- HEADER -->
      <div class="main-header">
        <MobileHeader
          :unreadQACount="unreadQACount"
          :page="page"
          @openService="openService()"
          @gameTypeClickHandler="gameTypeClickHandler"
          @goPage="(v) => (page = v)"
        ></MobileHeader>
      </div>

      <div class="main-body">
        <!-- 投注頁 -->
        <template v-if="page === PageEnum.game">
          <!-- 投注彩種導覽列 -->
          <mGameCatNav
            v-if="page === PageEnum.game"
            @onCatTypeClick="menuItemClickHandler"
            @callGetFavoriteGameDetail="callGetFavoriteGameDetail()"
          ></mGameCatNav>

          <!-- 桌子組件 -->
          <template v-if="GameList.length">
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
        </template>

        <!-- 賽果頁 -->
        <template v-else-if="page === PageEnum.gameResult">
          <!-- 賽果彩種導覽列-->
          <mGameResultCatNav
            v-if="page === PageEnum.gameResult"
            :date="gameResultDate"
            @onCatTypeClick="menuItemClickHandler"
            @changeGameResultCatId="(id) => (gameResultCatId = id)"
            @openDatePicker="$refs.gameResult.isShowDatePicker = true"
          ></mGameResultCatNav>

          <!-- 桌子組件 -->
          <template v-if="true">
            <mGameResultTable
              ref="gameResult"
              :selectedCatId="gameResultCatId"
              @date="(date) => (gameResultDate = date)"
            ></mGameResultTable>
          </template>
          <template v-else>
            <!-- 無賽果 -->
            <div class="noData" v-if="!$store.state.isLoading">
              {{ $t('Common.NoGameResult') }}
            </div>
          </template>
        </template>

        <!-- 公告頁 -->
        <template v-else-if="page === PageEnum.announcement">
          <mAnnouncement></mAnnouncement>
        </template>

        <!-- 即時比分頁 -->
        <template v-else-if="page === PageEnum.liveScore">
          <mLiveScorePage></mLiveScorePage>
        </template>

        <!-- 過關計算器頁 -->
        <template v-else-if="page === PageEnum.strayCounter">
          <mStrayCounter ref="StrayCountDialog"></mStrayCounter>
        </template>
      </div>

      <div class="main-footer">
        <!-- FOOTER -->
        <MobileFooter
          :hasLeagueFiltered="hasLeagueFiltered"
          @openBetInfoPopup="openBetInfoPopup()"
          @openBetRecordView="openBetRecordView()"
          @openMenuPanel="openMenuPanel()"
          @openLeaguesPanel="openLeaguesPanel()"
        ></MobileFooter>
      </div>
    </div>

    <!-- 覆蓋 / 浮動型 組件區 -->
    <div class="fixed-container">
      <!-- 更多玩法面板 -->
      <MoreGame v-if="isShowMoreGame" @openBetRecordView="openBetRecordView()"></MoreGame>

      <!-- 下注面板 (單注時) -->
      <mGamesBetInfoSingle
        v-show="isShowBetInfoSingleReal"
        :isShowMoreGame="isShowMoreGame"
        @onHide="isShowBetInfoSingle = false"
      ></mGamesBetInfoSingle>

      <!-- 下注面板 (多注時) -->
      <mGamesBetInfoAll
        ref="betInfoAll"
        v-if="isShowBetInfo && betCartList.length !== 1"
        @onCloseBetInfo="isShowBetInfo = false"
      ></mGamesBetInfoAll>

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
        @openPersonal="isOpenPersonalPanel = true"
        @goPage="(v) => (page = v)"
      ></mMenuPanel>

      <!-- 聯盟選擇面板 -->
      <mLeaguesPanel
        ref="leaguesPanel"
        :isOpen="isOpenLeaguesPanel"
        @closeMe="isOpenLeaguesPanel = false"
        @onLeaguesListChanged="reCallGameDetailAPI()"
        @hasLeagueFiltered="(val) => (hasLeagueFiltered = val)"
      ></mLeaguesPanel>

      <!-- 客服聊天室窗 -->
      <ServiceChat
        :isOpen="isOpenServiceChat"
        @closeMe="isOpenServiceChat = false"
        @updateUnreadCount="updateUnreadCount"
      ></ServiceChat>

      <!-- 個人設置 -->
      <PersonalPanel v-if="isOpenPersonalPanel" @closeMe="isOpenPersonalPanel = false">
      </PersonalPanel>

      <!-- 購物車浮動球 -->
      <mFloatingBetCart
        v-show="isShowFloatingBall"
        @openBetInfoPopup="openBetInfoPopup()"
      ></mFloatingBetCart>
    </div>
    <ChatSocket></ChatSocket>
  </div>
</template>

<script>
  import MobileHeader from './components/MobileHeader.vue';
  import MobileFooter from './components/MobileFooter.vue';
  import mGameCatNav from './components/mGameCatNav.vue';
  import mGameResultCatNav from './components/mGameResultCatNav.vue';
  import mGameTable from './components/GameTable/mGameTable.vue';
  import mGameResultTable from './components/GameResultTable/mGameResultTable.vue';
  import mGamesBetInfoAll from './components/mGamesBetInfoAll.vue';
  import mGamesBetInfoSingle from './components/mGamesBetInfoSingle.vue';
  import mBetRecordView from './components/mBetRecordView.vue';
  import mWagerTypePopup from './components/mWagerTypePopup.vue';
  import mMenuPanel from './components/MenuPanel/mMenuPanel.vue';
  import mLeaguesPanel from './components/mLeaguesPanel.vue';
  import MoreGame from '@/components/MoreGame.vue';
  import ServiceChat from '@/components/ServiceChat.vue';
  import mStrayCounter from './components/mStrayCounter';

  import PersonalPanel from '@/components/PersonalPanel';
  import mAnnouncement from './components/mAnnouncement';
  import mLiveScorePage from './components/mLiveScorePage.vue';
  import mFloatingBetCart from './components/mFloatingBetCart.vue';

  import ChatSocket from '@/components/ChatSocket';
  import { PageEnum } from './enum';

  export default {
    name: 'MobileGames',
    components: {
      MobileHeader,
      MobileFooter,
      mGameCatNav,
      mGameResultCatNav,
      mGameTable,
      mGameResultTable,
      mGamesBetInfoAll,
      mGamesBetInfoSingle,
      mBetRecordView,
      mWagerTypePopup,
      mMenuPanel,
      mLeaguesPanel,
      MoreGame,
      ServiceChat,
      PersonalPanel,
      mLiveScorePage,
      mFloatingBetCart,
      mAnnouncement,
      mStrayCounter,
      ChatSocket,
    },
    created() {
      this.$store.dispatch('User/UserInfoAbout');
    },
    mounted() {
      if (this.gameStore.MenuList.length !== 0) {
        // 一進入頁面預設選取第一個彩種
        this.menuItemClickHandler(this.gameStore.MenuList[0], null, 0);
      } else {
        this.$store.commit('SetLoading', false);
      }

      // 賽果預設選取第一個彩種
      if (this.CatList[0]) {
        this.gameResultCatId = this.CatList[0].CatID;
      }

      // 更新 賠率: 每10秒
      this.intervalEvent = setInterval(() => {
        if (this.isFavoriteMode) {
          this.$store.dispatch('Game/GetFavoriteGameDetailSmall');
        } else {
          this.$store.dispatch('Game/GetGameDetailSmall');
        }
        this.$store.dispatch('User/GetUserInfoCash');
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
        // 當前頁面
        PageEnum,
        page: PageEnum.game,

        // 組件顯示開關
        isShowBetInfo: false,
        isShowBetInfoSingle: true,
        isShowBetRecordView: false,
        isShowWagerTypePopup: false,
        isOpenMenuPanel: false,
        isOpenLeaguesPanel: false,
        isOpenServiceChat: false,
        isOpenPersonalPanel: false,
        latestSelectCatId: null,
        latestSelectWagerTypeKey: null,
        hasLeagueFiltered: false,
        gameResultCatId: null,
        gameResultDate: null,

        // QA未讀數量
        unreadQACount: 0,

        // interval IDs
        intervalEvent: null,
        intervalEvent2: null,
      };
    },
    computed: {
      GameList() {
        return this.gameStore.GameList;
      },
      CatList() {
        return this.$store.state.Game.CatList.filter((cat) => cat.CatID !== '-999');
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
      isShowBetInfoSingleReal() {
        return this.betCartList.length === 1 && this.isShowBetInfoSingle;
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
      isShowFloatingBall() {
        return (
          this.isShowMoreGame &&
          this.betCartList.length > 0 &&
          !this.isShowBetInfoSingleReal &&
          !this.isShowBetInfo
        );
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

      .main-header {
        flex: 0 0;
      }

      .main-body {
        flex: 1 0;
        display: flex;
        flex-flow: column;
        overflow: hidden;
        background-color: #eee;
      }

      .main-footer {
        flex: 0 0;
        z-index: 10;
      }

      .noData {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
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

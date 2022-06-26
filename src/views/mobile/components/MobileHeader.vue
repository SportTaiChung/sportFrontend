<template>
  <div id="mobileHeader">
    <div class="header-container">
      <div class="leftContainer">
        <img
          alt=""
          class="goBackIcon"
          src="@/assets/img/mobile/btn_arrow_w.svg"
          @click="routerGoBack()"
        />
        <div class="navList">
          <div
            class="navItem"
            v-for="(item, i) in showGameTypeList"
            :key="i"
            :class="gameTypeID === item.key ? 'navItemActive' : ''"
            @click="gameTypeClickHandler(item.key)"
          >
            <div class="text">{{ item.value }} </div>
          </div>
        </div>
      </div>
      <div class="rightContainer">
        <div class="userCreditBlock">
          <div v-if="userCredit" class="creditText">$ {{ userCredit }}</div>
        </div>

        <div class="service">
          <img
            src="@/assets/img/common/icon_header_service.svg"
            class="icon-service"
            @click="openService()"
          />
          <div class="unreadMark" v-show="unreadQACount > 0">{{ unreadQACount }}</div>
        </div>
        <img src="@/assets/img/common/logout.svg" class="icon-logout" @click="logout" />
      </div>
    </div>

    <!-- 遊戲類型 -->
    <ul class="gameTypeNav">
      <li
        v-if="hasFavorite || gameStore.selectCatID == -999"
        class="gameTypeItem fav"
        :class="gameStore.selectCatID == -999 ? 'active' : ''"
        @click="goFav"
      >
        <img :src="getMenuIconByCatID(-999)" class="menu-icon" @click="goFav()" />
        {{ $t('Common.Collect') }}
      </li>
      <li
        v-for="(catData, index) in gameStore.MenuList"
        :key="index"
        class="gameTypeItem"
        :class="gameStore.selectCatID == catData.catid ? 'active' : ''"
        @click.stop="menuItemClickHandler(catData, null, index)"
      >
        <img :src="getMenuIconByCatID(catData.catid)" class="menu-icon" />
        {{ catData.catName }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'mobileHeader',
    props: {
      unreadQACount: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        intervalEvent: null,
        intervalEvent2: null,
      };
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
    },
    beforeDestroy() {
      clearInterval(this.intervalEvent);
      clearInterval(this.intervalEvent2);
    },
    watch: {
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
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      GameList() {
        return this.gameStore.GameList;
      },
      CatMapData() {
        return this.$store.state.Game.CatMapData;
      },
      showGameTypeList() {
        return this.gameStore.GameTypeList.filter((it, index) => index <= 2);
      },
      gameTypeID() {
        return this.$store.state.Game.selectGameType;
      },
      userCredit() {
        return this.$lib.thousandSpr(this.$store.state.User.UserCredit);
      },
      isFavoriteMode() {
        return this.gameStore.selectCatID === -999;
      },
      hasFavorite() {
        return this.$store.state.Setting.UserSetting.favorites.length > 0;
      },
      isCallGameDetailAPI() {
        return this.$store.state.Game.isCallGameDetailAPI;
      },
    },
    methods: {
      routerGoBack() {
        this.$router.push(-1);
      },
      menuItemClickHandler(catData, WagerTypeKey) {
        // 清除聯盟篩選
        this.$emit('ChangeCat');

        const clickCatID = catData.catid;

        if (WagerTypeKey === null) {
          if (catData.Items.length === 0) {
            WagerTypeKey = 1;
          } else {
            WagerTypeKey = catData.Items[0].WagerTypeKey;
          }
        }

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
        this.callGetGameDetail(this.gameStore.selectCatID, this.gameStore.selectWagerTypeKey);
      },
      gameTypeClickHandler(gameType) {
        this.$store.commit('Game/setGameType', gameType);
        const menuData = this.gameStore.FullMenuList.find((menu) => menu.GameType === gameType);
        const catid = menuData.LeftMenu.item.length !== 0 ? menuData.LeftMenu.item[0].catid : 1;
        this.callGetGameDetail(catid, null);
        this.$store.dispatch('Game/GetMenuGameCatList', true);
      },
      onToggleAllCollapseClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('toggleAllCollapse');
      },
      openWagerTypePopup() {
        this.$emit('openWagerTypePopup');
      },
      getMenuIconByCatID(catId) {
        const icon = this.CatMapData[catId].icon;
        return require('@/assets/img/common/menuIcon/' + icon);
      },
      goFav() {
        this.$store.commit('Game/setCatIDAndGameTypeAndWagerType', {
          selectGameType: this.gameTypeID,
          selectCatID: -999,
          selectWagerTypeKey: null,
        });

        this.callGetFavoriteGameDetail();
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
      openService() {
        this.$emit('openService');
      },
      logout() {
        this.$store.commit('SetLoading', true);
        this.$store.dispatch('User/Logout').finally(() => {
          this.$store.commit('SetLoading', false);
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #mobileHeader {
    .header-container {
      height: 3.5rem;
      width: 100%;
      padding: 0 10px;
      @include base-background();
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #fff;

      .leftContainer {
        display: flex;

        .goBackIcon {
          width: 1.5rem;
          height: auto;
          transform: rotate(90deg);
          opacity: 0.7;
        }
        .navList {
          display: flex;
          align-items: center;
          margin-left: 1.2rem;
          .navItem {
            display: flex;
            align-items: center;
            height: 1.6rem;
            padding: 0px 0.8rem;
            color: white;
            margin-right: 0.6rem;
            border-radius: 2px;
            .text {
              text-align: center;
              margin-top: 2px;
              font-size: 1.2rem;
              white-space: nowrap;
            }
            &:last-child {
              margin-right: 0px;
            }
          }
          .navItemActive {
            background-color: #fff;
            color: #6da9e5;
          }
        }
      }
      .rightContainer {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .userCreditBlock {
          .creditText {
            color: #ffdf1a;
            font-size: 1.2rem;
            white-space: nowrap;
          }
        }

        img.icon-logout,
        img.icon-service {
          width: 2rem;
          height: 2rem;
          cursor: pointer;
          margin-left: 1.25rem;
          opacity: 0.8;
          &:active {
            opacity: 1;
          }
        }

        div.service {
          position: relative;
          .unreadMark {
            position: absolute;
            top: -6px;
            left: calc(100% - 10px);
            min-width: 20px;
            min-height: 20px;
            padding: 3px 6px;
            background-color: hsla(0, 55%, 52%, 0.9);
            border-radius: 50rem;
            color: #fff;
            white-space: nowrap;
            display: flex;
            align-items: center;
            overflow: hidden;
            line-height: normal;
            z-index: 5;
          }
        }
      }
    }

    ul.gameTypeNav {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: stretch;
      min-height: 50px;
      padding: 0;
      width: 100%;
      background-color: #3fa381;
      overflow-x: auto;
      overflow-y: hidden;

      &::-webkit-scrollbar {
        display: none; // Safari and Chrome
      }

      li.gameTypeItem {
        display: flex;
        flex: none;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        gap: 6px;
        padding: 0.4rem 0;
        min-width: 5.35rem;
        width: fit-content;
        text-align: center;
        font-size: 1.2rem;
        white-space: nowrap;
        color: rgba(255, 255, 255, 0.6);

        &.active {
          color: #fff;
          img.menu-icon {
            filter: brightness(1.1);
          }
        }

        img.menu-icon {
          max-width: 20px;
          height: auto;
          padding-top: 4px;
          filter: grayscale(1) brightness(3);
          opacity: 0.7;
        }

        &.fav {
          position: sticky;
          left: 0;
          z-index: 1;
          background-color: #6da9e5;
          box-shadow: 1px 0px 6px rgb(0 0 0 / 10%);
        }
      }
    }
  }
</style>

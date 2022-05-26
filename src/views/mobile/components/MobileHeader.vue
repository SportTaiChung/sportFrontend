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
      </div>
    </div>

    <!-- 遊戲類型 -->
    <ul class="gameTypeNav">
      <li
        v-for="(catData, index) in gameStore.MenuList"
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
    <div class="playTypeBar" @click="onToggleAllCollapseClick">
      <div class="playTypeBtn" @click="openWagerTypePopup">
        {{ currentWagerType ? currentWagerType.WagerTypeName : ' - ' }}
      </div>
      <i
        class="el-collapse-item__arrow el-icon-arrow-right"
        :class="activeCollapse.length > 0 ? 'is-active' : ''"
      ></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mobileHeader',
    props: {
      activeCollapse: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        intervalEvent: null,
      };
    },
    mounted() {
      if (this.gameStore.MenuList.length !== 0) {
        // 一進入頁面預設選取第一個
        this.menuItemClickHandler(this.gameStore.MenuList[0], null, 0);
      } else {
        this.$store.commit('SetLoading', false);
      }

      // 10秒打一次
      this.intervalEvent = setInterval(() => {
        this.$store.dispatch('Game/GetGameDetailSmall');
      }, 10000);
    },
    beforeDestroy() {
      clearInterval(this.intervalEvent);
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
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
      currentCatData() {
        const { selectCatID, MenuList } = this.gameStore;
        const currentCatData = MenuList.find((it) => it.catid === selectCatID);
        return currentCatData;
      },
      currentWagerType() {
        if (this.currentCatData) {
          const { selectWagerTypeKey } = this.gameStore;
          const currentWagerType = this.currentCatData.Items.find(
            (it) => it.WagerTypeKey === selectWagerTypeKey
          );
          return currentWagerType;
        }
        return null;
      },
    },
    methods: {
      routerGoBack() {
        this.$router.push(-1);
      },
      menuItemClickHandler(catData, WagerTypeKey, catIndex, isDefaultSystemSelect = false) {
        const clickCatID = catData.catid;
        let clickWagerTypeKey = null;

        if (WagerTypeKey === null) {
          if (catData.Items.length === 0) {
            clickWagerTypeKey = 1;
          } else {
            clickWagerTypeKey = catData.Items[0].WagerTypeKey;
          }
        } else {
          clickWagerTypeKey = WagerTypeKey;
        }

        // 獲取遊戲detail
        this.callGetGameDetail(clickCatID, clickWagerTypeKey);
      },
      callGetMenuGameCatList() {
        this.$store.commit('SetLoading', true);
        this.$store.dispatch('Game/GetMenuGameCatList').then(() => {
          if (this.gameStore.MenuList.length !== 0) {
            // 手動切換gameType時,系統預設選擇第一個球種
            this.menuItemClickHandler(this.gameStore.MenuList[0], null, 0, true);
          }
        });
      },
      callGetGameDetail(CatID, WagerTypeKey) {
        this.$store.commit('SetLoading', true);
        this.clearActiveCollapse();
        let postData = null;
        postData = {
          GameType: this.gameTypeID,
          CatID,
          WagerTypeKey,
        };

        this.$store.dispatch('Game/GetGameDetail', postData).then((res) => {
          console.log(
            'getGameDetail done GameType CatID WagerTypeKey',
            this.gameTypeID,
            CatID,
            WagerTypeKey
          );
          this.$store.commit('SetLoading', false);
        });
      },
      gameTypeClickHandler(key) {
        this.$store.commit('Game/setGameType', key);
        this.callGetMenuGameCatList();
      },
      onToggleAllCollapseClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('toggleAllCollapse');
      },
      openWagerTypePopup() {
        this.$emit('openWagerTypePopup');
      },
      clearActiveCollapse() {
        this.activeCollapse.length = 0;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #mobileHeader {
    .header-container {
      height: 45px;
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
          margin-left: 20px;
          .navItem {
            display: flex;
            align-items: center;
            height: 24px;
            padding: 0px 10px;
            color: white;
            margin-right: 1.1rem;
            border-radius: 2px;
            .text {
              margin-top: 2px;
              font-size: 1.2rem;
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
        .userCreditBlock {
          .creditText {
            color: #ffdf1a;
            font-size: 1.2rem;
          }
        }
      }
    }

    ul.gameTypeNav {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      min-height: 50px;
      padding: 0.4rem;
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
        justify-content: center;
        align-items: center;
        gap: 4px;
        min-width: 5.35rem;
        width: fit-content;
        height: 100%;
        text-align: center;
        font-size: 1.11rem;
        white-space: nowrap;
        color: rgba(255, 255, 255, 0.6);

        &.active {
          color: #fff;
        }

        i {
          font-size: 160%;
        }
      }
    }

    .playTypeBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8em;
      line-height: 1em;
      min-height: 30px;
      color: #fff;
      padding: 3px 6px;
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      z-index: 5;
      background-color: #7d9364;

      .playTypeBtn {
        align-self: stretch;
        border: 1px solid #fff;
        border-radius: 45px;
        padding: 4px 22px;
        line-height: 1;
        background-color: rgba(255, 255, 255, 0.15);
        font-size: 1.1rem;

        &:active {
          background-color: rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
</style>

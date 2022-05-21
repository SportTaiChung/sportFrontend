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
      <div class="playTypeBtn">美足 - 全場 / 上半</div>
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
    },
    mounted() {
      if (this.gameStore.MenuList.length !== 0) {
        // 一進入頁面預設選取第一個
        this.menuItemClickHandler(this.gameStore.MenuList[0], null, 0);
      }

      // 10秒打一次
      this.intervalEvent = setInterval(() => {
        this.$store.dispatch('Game/GetGameDetailSmall');
      }, 10000);
    },
    methods: {
      routerGoBack() {
        this.$router.push(-1);
      },
      gameTypeClickHandler(key) {
        this.$store.commit('Game/setGameType', key);
        this.callGetMenuGameCatList();
      },
      callGetMenuGameCatList() {
        this.$store.commit('SetLoading', true);
        this.$store.dispatch('Game/GetMenuGameCatList').finally(() => {
          // 手動切換gameType時,預設要選取第一個
          this.menuItemClickHandler(this.gameStore.MenuList[0], null, 0);
          this.$store.commit('SetLoading', false);
        });
      },
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
      onToggleAllCollapseClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('toggleAllCollapse');
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
      color: #fff;
      padding: 3px 6px;
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      z-index: 5;
      background-color: #7d9364;

      .playTypeBtn {
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

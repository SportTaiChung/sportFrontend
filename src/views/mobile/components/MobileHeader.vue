<template>
  <div id="mobileHeader">
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
</template>

<script>
  export default {
    name: 'mobileHeader',
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      showGameTypeList() {
        return this.gameStore.GameTypeList.filter((it, index) => index <= 2);
      },
      gameTypeID() {
        return parseInt(this.$route.query.gameType);
      },
      userCredit() {
        return this.$lib.thousandSpr(this.$store.state.User.UserCredit);
      },
    },
    methods: {
      routerGoBack() {
        this.$router.push(-1);
      },
      gameTypeClickHandler(key) {
        this.$router.replace({
          name: this.$route.name,
          query: { ...this.$route.query, gameType: key },
        });
        this.callGetMenuGameCatList();
      },
      callGetMenuGameCatList() {
        this.$store.commit('SetLoading', true);
        this.$store.dispatch('Game/GetMenuGameCatList', { gtype: this.gameTypeID }).finally(() => {
          // 手動切換gameType時,預設要選取第一個
          // this.menuItemClickHandler(this.gameStore.BallTypeList[0], null, 0);
          this.$store.commit('SetLoading', false);
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #mobileHeader {
    height: 40px;
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
        width: 24px;
        height: 24px;
        transform: rotate(90deg);
        margin-right: 10px;
      }
      .navList {
        display: flex;
        align-items: center;
        .navItem {
          display: flex;
          align-items: center;
          height: 24px;
          padding: 0px 10px;
          color: white;
          margin-right: 8px;
          .text {
            margin-top: 2px;
            font-size: 1.3rem;
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
        }
      }
    }
  }
</style>

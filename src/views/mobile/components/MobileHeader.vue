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
            v-for="(item, i) in gameTypeList"
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
      return {};
    },
    mounted() {},

    watch: {},
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      gameTypeID() {
        return this.$store.state.Game.selectGameType;
      },
      GameList() {
        return this.gameStore.GameList;
      },
      gameTypeList() {
        return this.gameStore.GameTypeList.filter((it, index) => index <= 2);
      },
      userCredit() {
        return this.$lib.thousandSpr(this.$store.state.User.UserCredit);
      },
    },
    methods: {
      routerGoBack() {
        this.$router.push(-1);
      },
      gameTypeClickHandler(gameType) {
        this.$emit('gameTypeClickHandler', gameType);
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
  }
</style>

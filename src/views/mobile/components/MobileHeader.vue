<template>
  <div id="mobileHeader">
    <!-- 左半邊 -->
    <div class="left">
      <!-- 返回按鈕 -->
      <img
        v-if="page !== PageEnum.game"
        class="goBackBtn"
        src="@/assets/img/mobile/btn_arrow_w.svg"
        @click="$emit('goPage', PageEnum.game)"
      />

      <!-- 頁面名稱 -->
      <h5 class="pageName" v-if="pageName"> {{ pageName }} </h5>

      <!-- gameType 切換鈕 (今日 / 滾球 / 早盤) -->
      <template v-if="page === PageEnum.game">
        <ul class="gameTypeNav">
          <li
            class="navItem"
            v-for="(item, i) in gameTypeList"
            :key="i"
            :class="gameTypeID === item.key ? 'active' : ''"
            @click="gameTypeClickHandler(item.key)"
          >
            <div class="text">{{ item.value }} </div>
          </li>
        </ul>
      </template>
    </div>
    <!-- 右半邊 -->
    <div class="right">
      <!-- 錢包 -->
      <div class="userCreditBlock">
        <div v-if="userCredit" class="creditText">$ {{ userCredit }}</div>
      </div>

      <!-- 客服 -->
      <div class="service">
        <img
          src="@/assets/img/common/icon_header_service.svg"
          class="icon-service"
          @click="openService()"
        />
        <div class="unreadMark" v-show="unreadQACount > 0">{{ unreadQACount }}</div>
      </div>

      <!-- 登出 -->
      <img src="@/assets/img/common/logout.svg" class="icon-logout" @click="logout" />
    </div>
  </div>
</template>

<script>
  import { PageEnum } from '../enum';

  export default {
    name: 'mobileHeader',
    props: {
      page: {
        type: Number,
        default: PageEnum.game,
      },
      unreadQACount: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        PageEnum,
      };
    },
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
      pageName() {
        switch (this.page) {
          case PageEnum.game: {
            return '';
          }
          case PageEnum.gameResult: {
            return this.$t('GamesHeader.GameResult');
          }
          case PageEnum.announcement: {
            return this.$t('Ann.Title');
          }
          case PageEnum.liveScore: {
            return this.$t('GamesHeader.LiveScore');
          }
          case PageEnum.strayCounter: {
            return this.$t('GamesBetInfo.StrayCount');
          }
          default:
            return '';
        }
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
    height: 3.5rem;
    width: 100%;
    padding: 0 10px;
    @include base-background();
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    border-bottom: 1px solid #8fd1bb;
    .left {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      .goBackBtn {
        width: 2rem;
        height: auto;
        transform: rotate(90deg);
        opacity: 0.7;
        margin-right: 1rem;
        cursor: pointer;
        &:active {
          opacity: 1;
        }
      }

      .pageName {
        font-size: 1.6rem;
        font-weight: normal;
        line-height: normal;
        color: #fff;
        margin: 0;
      }

      ul.gameTypeNav {
        display: flex;
        align-items: center;
        // margin-left: 1.2rem;
        li.navItem {
          display: flex;
          align-items: center;
          height: 2rem;
          padding: 0px 0.8rem;
          color: white;
          margin-right: 1.4rem;
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
          &.active {
            background-color: #fff;
            color: #6da9e5;
          }
        }
      }
    }
    .right {
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
</style>

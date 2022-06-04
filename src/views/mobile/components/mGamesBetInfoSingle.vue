<template>
  <div id="mGamesBetInfoSingle">
    <div class="popup">
      <div class="header">
        <ul class="tab-list">
          <li class="tab-item" :class="tabIndex === 0 ? 'active' : ''" @click="tabIndex = 0"
            >單項<span class="number">{{ betCartList.length }}</span></li
          >
          <!-- <li class="tab-item" :class="tabIndex === 1 ? 'active' : ''" @click="tabIndex = 1"
            >過關<span class="number">{{ betCartList.length }}</span></li
          > -->
        </ul>

        <div class="userCredit">{{ userCredit }}</div>

        <img
          src="@/assets/img/mobile/btn_arrow_w.svg"
          class="btn-close"
          @click.stop="onHideClick"
        />
      </div>
      <div class="body">
        <BetViewList></BetViewList>
      </div>
    </div>
  </div>
</template>

<script>
  import BetViewList from '@/components/BetViewList';
  export default {
    name: 'mGamesBetInfoSingle',
    components: {
      BetViewList,
    },
    data() {
      return {
        selectGroupIndex: 0,
        selectChildIndex: 0,
        tabIndex: 0, // 0: 單項投注 1: 過關投注
      };
    },
    computed: {
      userCredit() {
        return this.$lib.thousandSpr(this.$store.state.User.UserCredit);
      },
      betCartList() {
        return this.$store.state.BetCart.betCartList;
      },
    },
    methods: {
      onHideClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('onHide');
      },
    },
  };
</script>

<style lang="scss" scoped>
  #mGamesBetInfoSingle {
    position: fixed;
    top: unset !important;
    bottom: 4.8rem;
    width: 100%;
    height: auto !important;
    padding: 5px;
    background: #eaeaea;
    box-shadow: rgb(0 0 0 / 25%) 0px -3px 8px;

    .popup {
      width: calc(100%);

      .header {
        display: flex;
        background-color: #6da9e5;
        color: #fff;
        border-radius: 4px 4px 0 0;
        font-size: 0.95em;
        min-height: 30px;

        ul.tab-list {
          display: flex;
          max-width: 60%;
          overflow: auto;
          li.tab-item {
            min-height: 26px;
            padding: 0 8px;
            min-width: 60px;
            text-align: center;
            line-height: 26px;
            border-radius: 3px;
            margin: 7px 5px;
            cursor: pointer;
            background-color: transparent;
            font-size: 1.25rem;

            &.active,
            &:active {
              background-color: #fff;
              color: #6da9e5;
            }

            span.number {
              margin-left: 5px;
              color: #ffbc00;
            }
          }
        }

        .userCredit {
          font-size: 1rem;
          font-weight: bold;
          margin-left: auto;
          align-self: center;
          margin-right: 15px;
        }

        .btn-close {
          opacity: 0.7;
          width: 16px;
          margin-right: 15px;
        }
      }
      .body {
        max-height: 70vh;
        background-color: #d4d4d4;
        padding: 5px;
        padding-bottom: 10px;
        border-radius: 0 0 4px 4px;
        overflow: auto;
      }
    }
  }
</style>

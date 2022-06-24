<template>
  <div id="mGamesBetInfoAll" @click.stop="onMaskClick">
    <div class="popup">
      <div class="header">
        <ul class="tab-list">
          <li class="tab-item" :class="tabIndex === 0 ? 'active' : ''" @click="tabIndex = 0"
            >單項<span class="number">{{ betCartList.length }}</span></li
          >
          <li class="tab-item" :class="tabIndex === 1 ? 'active' : ''" @click="tabIndex = 1"
            >過關<span class="number">{{ betCartList.length }}</span></li
          >
        </ul>

        <div class="userCredit">{{ userCredit }}</div>

        <img
          src="@/assets/img/mobile/btn_arrow_w.svg"
          class="btn-close"
          @click.stop="onMaskClick"
        />
      </div>
      <div class="body">
        <BetViewList :groupIndex="0" :childIndex="tabIndex"></BetViewList>
      </div>
    </div>
  </div>
</template>

<script>
  import BetViewList from '@/components/BetViewList';
  export default {
    name: 'mGamesBetInfoAll',
    components: {
      BetViewList,
    },
    data() {
      return {
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
      onMaskClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('onCloseBetInfo');
      },
    },
    watch: {
      betCartList(list) {
        list.length === 0 && this.$emit('onCloseBetInfo');
      },
    },
  };
</script>

<style lang="scss" scoped>
  #mGamesBetInfoAll {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

    width: 100%;
    height: 100%;

    .popup {
      display: flex;
      flex-flow: column nowrap;
      width: calc(100vw - 50px);
      max-width: 560px;
      max-height: 70%;

      .header {
        flex-shrink: 0;
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
        flex-grow: 1;
        background-color: #d4d4d4;
        padding: 5px;
        padding-bottom: 10px;
        border-radius: 0 0 4px 4px;
        overflow: auto;
      }
    }
  }
</style>

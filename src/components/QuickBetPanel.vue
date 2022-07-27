<template>
  <div id="QuickBetPanel" @click.stop="onMaskClick">
    <div class="QuickBetPopup" :style="quickBetPopupStyle" v-if="displayData !== null">
      <div class="playMethodName"> {{ displayData.showBetTitle }}</div>
      <div class="QuickBetCutLineRow">
        <div class="playMethodNameSupport">
          {{ displayData.showCutLine }}
        </div>
        <div class="at"> @ </div>
        <div
          class="playBetOdd"
          :class="playBetOddClassJudge(cartData.OriginShowOdd, displayData.showOdd)"
        >
          {{ showOddValue(displayData.showOdd) }}
        </div>
      </div>
      <div class="lineSplit"> </div>
      <div class="optionRow">
        <div class="betAmount">
          <div> {{ $t('Common.Money') }}: </div>
          <div class="betAmountColor"> {{ cartData.betAmount }}</div>
        </div>
        <div class="betBtn" @click="betBtnClickHandler()" v-if="lastFirstBetState === 'init'">
          {{ $t('Common.Bet') }}
        </div>
        <div class="betBtn InfoBtn" v-else-if="lastFirstBetState === 'wait'">
          {{ $t('Common.PlzWait') }}
        </div>
        <div class="betBtn InfoBtn" @click="closeSelf" v-else>
          {{ lastFirstBetMessage }}
        </div>
      </div>
      <div class="optionRow">
        <div v-if="showMinLimit" class="limitTipText"> {{ $t('Common.BetMinTip') }}</div>
        <div v-if="showMaxLimit" class="limitTipText"> {{ $t('Common.BetMaxTip') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'QuickBetPanel',
    data() {
      return {
        showMinLimit: false,
        showMaxLimit: false,
      };
    },
    created() {
      if (this.currentSelectBetInfo) {
        const betAmount = this.cartData.betAmount;
        if (betAmount < this.currentSelectBetInfo.BetMin) {
          this.showMinLimit = true;
          this.cartData.betAmount = this.currentSelectBetInfo.BetMin;
        }
        if (betAmount > this.currentSelectBetInfo.BetMax) {
          this.showMaxLimit = true;
          this.cartData.betAmount = this.currentSelectBetInfo.BetMax;
        }
      }

      if (this.lastFirstBetState === 'lock') {
        this.$MSG.warn(this.$t('Common.BetWait'));
        this.closeSelf();
      }

      if (this.lastFirstBetState === 'done') {
        this.$store.commit('BetCart/clearLastFirstBetData');
      }
    },
    computed: {
      quickBetData() {
        return this.$store.state.BetCart.quickBetData;
      },
      quickBetPopupStyle() {
        return `left:${this.quickBetData.x}px;top:${this.quickBetData.y + 35}px`;
      },
      showBetCartList() {
        return this.$store.getters['BetCart/showBetCartList'];
      },
      cartData() {
        if (this.showBetCartList.length !== 0) {
          return this.showBetCartList[0];
        } else {
          return null;
        }
      },
      displayData() {
        if (this.cartData === null) {
          return null;
        }
        return this.cartDataToDisplayData(this.cartData);
      },
      includePrincipal() {
        return this.$store.state.Setting.UserSetting.includePrincipal;
      },
      betInfo() {
        return this.$store.state.Game.betInfo;
      },
      selectCatID() {
        return this.$store.state.Game.selectCatID;
      },
      selectWagerTypeKey() {
        return this.$store.state.Game.selectWagerTypeKey;
      },
      currentSelectBetInfo() {
        if (this.cartData === null) {
          return undefined;
        }
        const findData = this.betInfo.find((it) => {
          if (it.CatID === this.selectCatID && it.WagerTypeID === this.cartData.WagerTypeID) {
            return true;
          } else {
            return false;
          }
        });
        return findData;
      },
      lastFirstBetMessage() {
        return this.$store.state.BetCart.lastFirstBetData.message;
      },
      lastFirstBetState() {
        return this.$store.state.BetCart.lastFirstBetData.state;
      },
    },
    watch: {
      cartData: {
        handler() {
          if (this.cartData.EvtStatus !== 1 || this.cartData.Status !== 1) {
            this.closeSelf();
          }
        },
        immediate: true,
      },
    },
    methods: {
      cartDataToDisplayData(cartData) {
        return this.$SportLib.cartDataToDisplayData(cartData);
      },
      // 離開
      onMaskClick(e) {
        if (e.target !== e.currentTarget) return;
        this.closeSelf();
      },
      closeSelf() {
        // 如果state是wait 才能給lock
        if (this.lastFirstBetState === 'wait') {
          this.$store.commit('BetCart/setLastFirstBetDataState', 'lock');
        }
        this.$store.commit('BetCart/clearCart');
        this.$store.commit('BetCart/showQuickBetData', {
          isShow: false,
          x: 0,
          y: 0,
        });
      },
      playBetOddClassJudge(OriginShowOdd, NowShowOdd) {
        if (parseFloat(OriginShowOdd) !== parseFloat(NowShowOdd)) {
          return 'oddChangeStyle';
        } else {
          return '';
        }
      },
      showOddValue(oddValue) {
        if (this.includePrincipal) {
          return this.$lib.trunc(parseFloat(oddValue) + 1);
        } else {
          return oddValue;
        }
      },
      betBtnClickHandler() {
        this.$store.commit('BetCart/setLastFirstBetDataState', 'wait');
        this.$store.commit('BetCart/setIsSubmitHandler');
        this.showMinLimit = false;
        this.showMaxLimit = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  #QuickBetPanel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.374);
    .QuickBetPopup {
      position: absolute;
      background-color: #fff;
      width: 270px;
      padding: 10px;
      font-size: 16px;
      @mixin common {
        margin-right: 5px;
        font-weight: bold;
      }
      .QuickBetCutLineRow {
        display: flex;
        margin-bottom: 5px;
        .playMethodNameSupport {
          color: red;
          @include common();
        }
        .at {
          @include common();
        }
        .playBetOdd {
          color: red;
          @include common();
        }
        .oddChangeStyle {
          background-color: #41b590;
          padding: 2px 4px;
          color: white !important;
        }
        .oddChangeStyle {
          background-color: #41b590;
          padding: 2px 4px;
          color: white !important;
        }
      }

      .playMethodName {
        color: #005aff;
        @include common();
        margin-bottom: 5px;
      }

      .lineSplit {
        width: 100%;
        height: 1px;
        background-color: rgba(128, 128, 128, 0.489);
        margin-bottom: 10px;
      }

      .optionRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .limitTipText {
          color: red;
          font-size: 14px;
          margin-top: 12px;
          margin-bottom: 5px;
        }
        .betAmount {
          display: flex;
          .betAmountColor {
            color: red;
            font-weight: bold;
          }
        }
        .betBtn {
          background-color: #ffdf1b;
          color: black;
          width: 100px;
          padding: 0 7px;
          line-height: 35px;
          font-weight: bold;
          text-align: center;
          cursor: pointer;
          &:hover {
            background-color: #f9e875f2;
          }
        }
        .InfoBtn {
          color: white;
          background-color: #3fa381;
          &:hover {
            background-color: #3fa381;
          }
        }
      }
    }
  }
</style>

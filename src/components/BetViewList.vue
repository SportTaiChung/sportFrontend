<template>
  <div id="BetViewList" :set="(displayData = [])" ref="BetViewList">
    <div
      class="listCardItem"
      v-for="(cart, cartIndex) in showBetCartList"
      :key="cartIndex"
      :set="(displayData[cartIndex] = cartDataToDisplayData(cart))"
    >
      <div class="cardHeaderRow">
        <div class="playMethodName"> {{ displayData[cartIndex].showBetTitle }}</div>
        <div class="playMethodNameSupport">
          {{ displayData[cartIndex].showCutLine }}
        </div>
        <div class="at"> @ </div>
        <div
          class="playBetOdd"
          :class="playBetOddClassJudge(cart.OriginShowOdd, displayData[cartIndex].showOdd)"
        >
          {{ displayData[cartIndex].showOdd }}
        </div>

        <i
          class="el-icon-close"
          @click="$store.commit('BetCart/removeCartByGameID', cart.GameID)"
        ></i>
      </div>

      <div class="cardContentBlock">
        <div class="cardContentBlockRow">
          {{ displayData[cartIndex].showGameTypeLabel }}
        </div>
        <div class="cardContentBlockRow"> {{ cart.LeagueNameStr }} </div>
        <div class="cardContentBlockRow">
          <div class="cardContentBlockRowText">{{ cart.HomeTeamStr }}</div>
          <div
            class="cardContentBlockRowText HomeTeamSign"
            v-if="!$SportLib.isHomeAwayReverse(cart.CatID)"
            >(主)</div
          >
          <div class="cardContentBlockRowText"> v {{ cart.AwayTeamStr }}</div>
          <div
            class="cardContentBlockRowText HomeTeamSign"
            v-if="$SportLib.isHomeAwayReverse(cart.CatID)"
            >(主)</div
          >
        </div>
        <div class="cardContentBlockRow">
          <div class="inputRow">
            <input
              class="input"
              v-model="cart.betAmount"
              :max="cart.BetMax"
              :min="cart.BetMin"
              :placeholder="
                cart.BetMin !== null && cart.BetMax !== null ? cart.BetMin + '-' + cart.BetMax : ''
              "
              type="Number"
              @blur="BetAmountBlurEvent"
            />
            <input
              class="input"
              v-model="cart.winAmount"
              placeholder="可赢金額"
              @input="wink_amount($event)"
            />
          </div>
        </div>
        <div class="cardContentBlockRow limitText"> 本場上限 10000 </div>
      </div>
    </div>

    <div class="cardOptionBlock">
      <div class="buttonRow"> </div>
      <div class="buttonRow">
        <div class="clearBtn" @click="cancelHandler"> 取消</div>
        <div class="submitBtn" @click="submitHandler">確認下注</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BetViewList',
    data() {
      return {
        intervalEvent: null,
      };
    },
    mounted() {
      this.intervalEvent = setInterval(() => {
        this.$store.dispatch('BetCart/updateAllCartData');
      }, 10000);
    },
    beforeDestroy() {
      clearInterval(this.intervalEvent);
    },
    computed: {
      showBetCartList() {
        return this.$store.getters['BetCart/showBetCartList'];
      },
      isAddNewToChart() {
        return this.$store.state.BetCart.isAddNewToChart;
      },
    },
    watch: {
      isAddNewToChart() {
        this.$nextTick(() => {
          this.$refs.BetViewList.scrollTop = 999999;
        });
      },
    },
    methods: {
      playBetOddClassJudge(OriginShowOdd, NowShowOdd) {
        if (parseFloat(OriginShowOdd) !== parseFloat(NowShowOdd)) {
          console.log(OriginShowOdd, NowShowOdd);
          return 'oddChangeStyle';
        } else {
          return '';
        }
      },
      cancelHandler() {
        this.$store.commit('BetCart/clearCart');
      },
      submitHandler() {
        this.$store.dispatch('BetCart/submitBet');
      },
      BetAmountBlurEvent(cartData) {},
      cartDataToDisplayData(cartData) {
        let showBetTitle = '';
        let showCutLine = '';
        let showOdd = '';
        const playData = cartData.playData;
        if (playData.playMethodData.name === 'HandiCap') {
          if (cartData.clickPlayIndex === 0) {
            showBetTitle = cartData.HomeTeamStr;
            if (playData.topPlayMethod === '') {
              showCutLine = '+' + playData.bottomPlayMethod;
            } else {
              showCutLine = '-' + playData.topPlayMethod;
            }
            showOdd = playData.topPlayOdd;
          } else if (cartData.clickPlayIndex === 1) {
            showBetTitle = cartData.AwayTeamStr;
            if (playData.topPlayMethod === '') {
              showCutLine = '-' + playData.bottomPlayMethod;
            } else {
              showCutLine = '+' + playData.topPlayMethod;
            }
            showOdd = playData.bottomPlayOdd;
          }
          if (playData.topPlayMethod === '0' || playData.bottomPlayMethod === '0') {
            showCutLine = '0';
          }
        } else if (playData.playMethodData.name === 'BigSmall') {
          if (cartData.clickPlayIndex === 0) {
            showBetTitle = '大';
            showCutLine = playData.topPlayMethod;
            showOdd = playData.topPlayOdd;
          } else if (cartData.clickPlayIndex === 1) {
            showBetTitle = '小';
            showCutLine = playData.topPlayMethod;
            showOdd = playData.bottomPlayOdd;
          }
        } else if (playData.playMethodData.name === 'SoloWin') {
          if (cartData.clickPlayIndex === 0) {
            showBetTitle = cartData.HomeTeamStr;
            showOdd = playData.topPlayOdd;
          } else if (cartData.clickPlayIndex === 1) {
            showBetTitle = cartData.AwayTeamStr;
            showOdd = playData.bottomPlayOdd;
          } else {
            showBetTitle = '和局';
            showOdd = playData.drewPlayOdd;
          }
          showCutLine = 'PK';
        } else if (playData.playMethodData.name === 'OddEven') {
          if (cartData.clickPlayIndex === 0) {
            showBetTitle = '單';
            showOdd = playData.topPlayOdd;
          } else if (cartData.clickPlayIndex === 1) {
            showBetTitle = '雙';
            showOdd = playData.bottomPlayOdd;
          }
        } else {
          console.error('playData.playMethodData.name error:', playData.playMethodData.name);
        }

        const catIDLabel = this.$SportLib.CatIDtoShowLabel(cartData.CatID);
        let wagerGrpLabel = '';

        if (cartData.WagerGrpID === '10') {
          wagerGrpLabel = '- [全場]';
        } else if (cartData.WagerGrpID === '11') {
          wagerGrpLabel = '- [上半]';
        }
        const showGameTypeLabel = `${catIDLabel}${cartData.GameTypeLabel}${wagerGrpLabel}`;

        return {
          showBetTitle,
          showCutLine,
          showOdd,
          showGameTypeLabel,
          wagerGrpLabel,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  #BetViewList {
    height: calc(100% - 35px);
    overflow: auto;
    .listCardItem {
      background-color: #eaeaea;
      margin-bottom: 5px;
      .cardHeaderRow {
        display: flex;
        padding: 7px 10px;
        border-bottom: 1px solid #cccccc;
        position: relative;
        @mixin common {
          margin-right: 5px;
          font-weight: bold;
        }
        .playMethodName {
          color: #005aff;
          @include common();
        }
        .playMethodNameSupport {
          color: red;
          @include common();
        }
        .oddChangeStyle {
          background-color: #41b590;
          padding: 2px 4px;
          color: white !important;
        }
        .at {
          @include common();
        }
        .playBetOdd {
          color: red;
          @include common();
        }
        .el-icon-close {
          font-weight: bold;
          position: absolute;
          right: 6px;
          font-size: 18px;
          opacity: 0.5;
          margin-top: -3px;
          cursor: pointer;
        }
      }
      .cardContentBlock {
        padding: 8px 10px;
        .cardContentBlockRow {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 6px;
          &:last-child {
            margin-bottom: 0px;
          }
          .inputRow {
            display: flex;
            justify-content: space-between;
            .input {
              width: 49%;
              height: 30px;
              font-size: 15px;
              border-radius: 3px;
              padding: 5px;
              border: 1px solid transparent;
            }
          }
          .cardContentBlockRowText {
            margin-right: 5px;
            text-align: left;
          }
          .HomeTeamSign {
            color: #ff8800;
          }
        }
        .limitText {
          color: #006a8a;
        }
      }
    }
    .cardOptionBlock {
      .buttonRow {
        display: flex;
        justify-content: space-around;
        .clearBtn,
        .submitBtn {
          width: 48%;
          padding: 10px;
          font-size: 14px;
          cursor: pointer;
          font-weight: bold;
        }
        .clearBtn {
          background-color: #838383;
          &:hover {
            background-color: #9a9a9af6;
          }
          color: white;
        }
        .submitBtn {
          background-color: #ffdf1b;
          color: black;
          &:hover {
            background-color: #ffeb68f9;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="listCardItem" :class="listCardItemClassJudge">
    <div class="cardHeaderRow">
      <div class="playMethodName"> {{ displayData.showBetTitle }}</div>
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

      <i
        class="el-icon-close"
        :style="isShowBlackMask ? 'color:white;' : ''"
        @click="cancelSingleHandler(cartData.GameID)"
      ></i>
    </div>

    <div class="cardContentBlock">
      <div class="cardContentBlockRow">
        {{ displayData.showGameTypeLabel }}
      </div>
      <div class="cardContentBlockRow"> {{ cartData.LeagueNameStr }} </div>
      <div class="cardContentBlockRow">
        <div class="cardContentBlockRowText">{{ cartData.HomeTeamStr }}</div>
        <div class="cardContentBlockRowText HomeTeamSign" v-if="cartData.SetFlag">(主)</div>
        <div class="cardContentBlockRowText"> v {{ cartData.AwayTeamStr }}</div>
        <div class="cardContentBlockRowText HomeTeamSign" v-if="!cartData.SetFlag">(主)</div>
      </div>
      <!-- 一般投注每一個item的各自金額 -->
      <div class="cardContentBlockRow" v-if="childIndex === 0">
        <div class="inputRow">
          <input
            class="input"
            v-model.number="cartData.betAmount"
            :max="cartData.BetMax"
            :min="cartData.BetMin"
            :placeholder="
              cartData.BetMin !== null && cartData.BetMax !== null
                ? cartData.BetMin + '-' + cartData.BetMax
                : ''
            "
            type="Number"
            @input="$emit('inputRowItemChangeHandler')"
            @click="onCardInputClick"
          />
          <input
            class="input"
            v-model.number="cartData.winAmount"
            placeholder="可赢金額"
            type="Number"
            @input="inputRowItemWinAmountChangeHandler(cartIndex)"
            @blur="$emit('inputRowItemChangeHandler')"
            @click="onCardInputClick"
          />
          <div class="submitBtn" v-if="isMobileMode">確認下注</div>
        </div>
      </div>
      <div class="cardContentBlockRow limitText"> 本場上限 : {{ cartData.BetMax }} </div>

      <!-- 小鍵盤 -->
      <mBetKeyboard v-if="isMobileMode && isShowKeyboard"></mBetKeyboard>
    </div>

    <div class="blackMaskErrorBlock" v-if="isShowBlackMask">
      <div class="blackMaskText"> 盤口關閉中，請移除再下注 </div>
    </div>
  </div>
</template>

<script>
  import mBetKeyboard from '@/components/mBetKeyboard';

  export default {
    name: 'ListCardItem',
    components: {
      mBetKeyboard,
    },
    props: {
      cartData: {
        type: Object,
        default: null,
      },
      cartIndex: {
        type: Number,
        default: null,
      },
      childIndex: {
        type: Number,
        default: null,
      },
      currShowKeyboardIndex: {
        type: Number,
        default: -1,
      },
      listCardItemClassJudge: {
        type: String,
        default: '',
      },
    },
    methods: {
      onCardInputClick() {
        this.$emit('onCartListItemKeyboardShow', this.cartIndex);
      },
      cancelSingleHandler(gameId) {
        this.$emit('cancelSingleHandler', gameId);
      },
      cartDataToDisplayData(cartData) {
        return this.$SportLib.cartDataToDisplayData(cartData);
      },
      inputRowItemWinAmountChangeHandler(winAmountIndex) {
        this.showBetCartList.forEach((cartData, cartIndex) => {
          if (cartIndex === winAmountIndex) {
            const displayData = this.cartDataToDisplayData(cartData);
            if (cartData.winAmount !== null) {
              cartData.betAmount = this.$lib.truncCeil(
                cartData.winAmount / this.$lib.trunc(parseFloat(displayData.showOdd))
              );
            }
          }
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
    },
    computed: {
      displayData() {
        return this.cartDataToDisplayData(this.cartData);
      },
      isMobileMode() {
        return process.env.VUE_APP_UI === 'mobile';
      },
      isShowBlackMask() {
        return this.cartData.Status !== 1 || this.cartData.EvtStatus !== 1;
      },
      includePrincipal() {
        return this.$store.state.Setting.includePrincipal;
      },
      showBetCartList() {
        return this.$store.getters['BetCart/showBetCartList'];
      },
      isShowKeyboard() {
        // 單項投注 & 點擊了此item的input
        return this.childIndex === 0 && this.currShowKeyboardIndex === this.cartIndex;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .listCardItem {
    background-color: #eaeaea;
    margin-bottom: 5px;
    position: relative;
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
        z-index: 9999;
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
          gap: 10px;
          width: 100%;
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
        .cardContentBlockWithHalfRow {
          width: 50%;
          text-align: left;
        }
        .submitBtn {
          width: 48%;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
          font-weight: bold;
          background-color: #ffdf1b;
          color: black;
          &:hover {
            background-color: #ffeb68f9;
          }
        }
      }
      .limitText {
        color: #006a8a;
      }
    }
    .strayContentBlock {
      padding: 8px 10px;
      .strayContentBlockRow {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 6px;
        &:last-child {
          margin-bottom: 0px;
        }
        .strayTitleInfoText {
          color: #005aff;
          padding: 0px 5px;
        }
        .strayTitleInfoTextTip {
          color: #f00;
        }
      }
    }
    .blackMaskErrorBlock {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.55);
      width: 100%;
      height: 100%;
      z-index: 999;
      left: 0;
      top: 0;
      .blackMaskText {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        color: white;
        font-size: 15px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.8);
        white-space: nowrap;
        border-radius: 20px;
        padding: 8px 25px;
      }
    }
  }
</style>

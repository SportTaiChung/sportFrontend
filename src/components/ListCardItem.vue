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
            v-model="cartData.betAmount"
            type="number"
            :max="cartData.BetMax"
            :min="cartData.BetMin"
            :placeholder="
              cartData.BetMin !== null && cartData.BetMax !== null
                ? cartData.BetMin + '-' + cartData.BetMax
                : ''
            "
            @input="inputRowItemChangeHandler(cartData)"
            @click="onCardInputClick"
            @blur="betAmountBlur(cartData.GameID)"
          />
          <input
            class="input"
            v-model="cartData.winAmount"
            placeholder="可赢金額"
            type="number"
            @input="inputRowItemWinAmountChangeHandler(cartData, cartIndex)"
            @click="onCardInputClick"
            @blur="winAmountBlur(cartData.GameID)"
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
      betAmountBlur(GameID) {
        this.$emit('lastBlurInputEvent', {
          name: 'rowItem',
          from: 'betAmount',
          GameID,
        });
      },
      winAmountBlur(GameID) {
        this.$emit('inputRowItemChangeHandler');
        this.$emit('lastBlurInputEvent', {
          name: 'rowItem',
          from: 'winAmount',
          GameID,
        });
      },
      onCardInputClick() {
        this.$emit('onCartListItemKeyboardShow', this.cartIndex);
      },
      cancelSingleHandler(gameId) {
        this.$emit('cancelSingleHandler', gameId);
      },
      cartDataToDisplayData(cartData) {
        return this.$SportLib.cartDataToDisplayData(cartData);
      },
      inputRowItemChangeHandler(cartData) {
        cartData.betAmount = parseFloat(cartData.betAmount.replace(/[^\d]/g, ''));
        if (isNaN(cartData.betAmount)) {
          cartData.betAmount = 0;
        }
        this.$emit('inputRowItemChangeHandler');
      },
      inputRowItemWinAmountChangeHandler(cartData, winAmountIndex) {
        cartData.winAmount = parseFloat(cartData.winAmount.replace(/[^\d]/g, ''));
        if (isNaN(cartData.winAmount)) {
          cartData.winAmount = 0;
        }
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
  @import './ListCardItem.scss';
</style>

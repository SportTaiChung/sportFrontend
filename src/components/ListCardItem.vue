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
        v-if="panelMode !== PanelModeEnum.result"
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
        <!-- 只需要顯示一個隊伍 -->
        <template v-if="cartData.AwayTeamStr === '.'">
          <div class="teamRow">{{ cartData.HomeTeamStr }}</div>
        </template>
        <!-- 只需要顯示一個隊伍 -->
        <template v-else-if="cartData.HomeTeamStr === '.'">
          <div class="teamRow">{{ cartData.AwayTeamStr }}</div>
        </template>
        <template v-else>
          <div class="cardContentBlockRowText">{{ cartData.HomeTeamStr }}</div>
          <div class="cardContentBlockRowText HomeTeamSign" v-if="cartData.SetFlag">
            ({{ $t('Common.Home') }})
          </div>
          <div class="cardContentBlockRowText"> v {{ cartData.AwayTeamStr }}</div>
          <div class="cardContentBlockRowText HomeTeamSign" v-if="!cartData.SetFlag">
            ({{ $t('Common.Home') }})
          </div>
        </template>
      </div>
      <!-- 一般投注每一個item的各自金額 -->
      <div class="cardContentBlockRow" v-if="childIndex === 0">
        <div
          class="lockRowInfo"
          v-if="panelMode === PanelModeEnum.lock || panelMode === PanelModeEnum.result"
        >
          <div class="infoItem">
            <div class="infoItemTitle">{{ $t('Common.Bet') }} :</div>
            <div class="infoItemVal"> {{ cartData.betAmount }}</div>
          </div>
          <div class="infoItem">
            <div class="infoItemTitle">{{ $t('Common.CanWin') }} :</div>
            <div class="infoItemVal"> {{ cartData.winAmount }}</div>
          </div>
        </div>
        <div class="inputRow" v-else>
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
            :placeholder="$t('Common.CanWinMoney')"
            type="number"
            @input="inputRowItemWinAmountChangeHandler(cartData, cartIndex)"
            @click="onCardInputClick"
            @blur="winAmountBlur(cartData.GameID)"
          />
          <div class="submitBtn" v-if="isMobileMode" @click="$emit('MobileListItemSubmitBet')">
            {{ $t('Common.SubmitBet') }}
          </div>
        </div>
      </div>

      <div class="cardContentBlockRow limitText" v-if="panelMode === PanelModeEnum.normal">
        {{ $t('ListCardItem.BetLimit') }} : {{ cartData.BetMax }}
      </div>

      <div
        class="betResultBlock"
        v-if="panelMode === PanelModeEnum.result && cartData.betResult !== null && childIndex === 0"
      >
        <div class="success" v-if="cartData.betResult.code === 200">
          <img class="betResultImgIcon" src="@/assets/img/common/betView/ok.png" alt="" />
          {{ cartData.betResult.Message }}
        </div>
        <div
          class="info"
          v-else-if="cartData.betResult.code === 201 && state.betCartList[index].betResultCount > 2"
        >
          <img class="betResultImgIcon" src="@/assets/img/common/betView/info.png" alt="" />
          {{ cartData.betResult.Message }}
        </div>
        <div class="error" v-else>
          <img class="betResultImgIcon" src="@/assets/img/common/betView/error.png" alt="" />
          {{ cartData.betResult.Message }}
        </div>
      </div>

      <!-- 小鍵盤 -->
      <mBetKeyboard
        v-if="isMobileMode && isShowKeyboard && panelMode === PanelModeEnum.normal"
        @Add="(data) => $emit('Add', data)"
        @Assign="(data) => $emit('Assign', data)"
      ></mBetKeyboard>
    </div>

    <div class="blackMaskErrorBlock" v-if="isShowBlackMask">
      <div class="blackMaskText"> {{ $t('ListCardItem.ItemIsClosePlzRemove') }} </div>
    </div>
  </div>
</template>

<script>
  import mBetKeyboard from '@/components/mBetKeyboard';
  import { PanelModeEnum } from '@/enum/BetPanelMode';
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
    data() {
      return {
        PanelModeEnum,
      };
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
        if (cartData.betAmount > this.UserCredit) {
          cartData.betAmount = this.UserCredit;
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
              if (cartData.betAmount > this.UserCredit) {
                cartData.betAmount = this.UserCredit;
              }
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
        return this.$store.state.Setting.UserSetting.includePrincipal;
      },
      showBetCartList() {
        return this.$store.getters['BetCart/showBetCartList'];
      },
      isShowKeyboard() {
        // 單項投注 & 點擊了此item的input
        return this.childIndex === 0 && this.currShowKeyboardIndex === this.cartIndex;
      },
      panelMode() {
        return this.$store.state.BetCart.panelMode;
      },
      UserCredit() {
        return this.$store.state.User.UserCredit;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './ListCardItem.scss';
</style>

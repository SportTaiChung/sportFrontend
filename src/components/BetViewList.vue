<template>
  <div id="BetViewList" :set="(displayData = [])" ref="BetViewList" v-loading="isLoading">
    <!-- 購物車 -->
    <template v-if="groupIndex === 0">
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

          <i class="el-icon-close" @click="cancelSingleHandler(cart.GameID)"></i>
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
                v-model.number="cart.betAmount"
                :max="cart.BetMax"
                :min="cart.BetMin"
                :placeholder="
                  cart.BetMin !== null && cart.BetMax !== null
                    ? cart.BetMin + '-' + cart.BetMax
                    : ''
                "
                type="Number"
                @blur="inputRowItemBlurHandler(0)"
              />
              <input
                class="input"
                v-model.number="cart.winAmount"
                placeholder="可赢金額"
                type="Number"
                @blur="inputRowItemBlurHandler(1, true)"
              />
            </div>
          </div>
          <div class="cardContentBlockRow limitText"> 本場上限 尚未接 </div>
        </div>
      </div>
    </template>

    <!-- 注單紀錄 -->
    <template v-if="groupIndex === 1">
      <div
        class="listCardItem"
        v-for="(historyItem, historyIndex) in showBetHistoryList"
        :key="historyIndex"
      >
        <!-- 一般投注 -->
        <template v-if="historyItem.BetType === 1">
          <div class="cardHeaderRow">
            <div class="playMethodName"> {{ historyItem.dataBet[0].WagerPosName }}</div>
            <div class="playMethodNameSupport">
              {{ historyItem.dataBet[0].CutLine }}
            </div>
            <div class="at"> @ </div>
            <div class="playBetOdd">
              {{ historyItem.dataBet[0].PayoutOddsStr }}
            </div>
          </div>
          <div class="cardContentBlock">
            <div class="cardContentBlockRow">
              {{
                `${historyItem.catName} ${historyItem.dataBet[0].WagerTypeName} ${historyItem.dataBet[0].WagerGrpName}`
              }}
            </div>
            <div class="cardContentBlockRow"> {{ historyItem.dataBet[0].LeagueName }} </div>
            <div class="cardContentBlockRow">
              <div class="cardContentBlockRowText">{{ historyItem.dataBet[0].HomeTeam }}</div>
              <div class="cardContentBlockRowText HomeTeamSign">(主)</div>
              <div class="cardContentBlockRowText"> v {{ historyItem.dataBet[0].AwayTeam }}</div>
            </div>
            <div class="cardContentBlockRow"> 帳務日期: {{ historyItem.AccDateStr }} </div>
            <div class="cardContentBlockRow">
              <div class="cardContentBlockWithHalfRow">投注: {{ historyItem.Amount }}</div>
              <div class="cardContentBlockWithHalfRow">
                最高返還:
                {{
                  $lib.truncFloor(
                    historyItem.Amount * (parseFloat(historyItem.dataBet[0].PayoutOddsStr) + 1)
                  )
                }}
              </div>
            </div>
            <div class="cardContentBlockRow">
              <div class="cardContentBlockRowText">StatusType: {{ historyItem.StatusType }}</div>
            </div>
            <div class="cardContentBlockRow">
              <div class="cardContentBlockRowText">RetAmt: {{ historyItem.RetAmt }}</div>
            </div>

            <div class="cardContentBlockRow">
              <div class="cardContentBlockRowText">
                WinLoseStatus: {{ historyItem.WinLoseStatus }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <div class="cardOptionBlock" v-if="groupIndex === 0 && showBetCartList.length !== 0">
      <div class="betInputRow">
        <div class="betInputTitle"> 單注 </div>
        <div class="betInputSymbol">:</div>
        <input v-model.number="fillEachBetAmount" type="Number" @blur="fillEachBetAmountHandler" />
      </div>
      <div class="betInputRow">
        <div class="betInputTitle"> 可贏金額 </div>
        <div class="betInputSymbol">:</div>
        <input v-model.number="fillEachWinAmount" type="Number" @blur="fillEachWinAmountHandler" />
      </div>
      <div class="totalRow">
        <div class="halfItem">所有投注 : {{ totalBetAmount }}</div>
        <div class="halfItem">可贏金額 : {{ totalWinAmount }}</div>
      </div>
      <div class="buttonRow">
        <div class="clearBtn" @click="cancelHandler"> 取消</div>
        <div class="submitBtn" @click="submitHandler">確認下注</div>
      </div>
    </div>

    <div class="noData" v-if="groupIndex === 0 && showBetCartList.length === 0">
      <div class="noDataItem">
        <div class="noDataItemImgContainer">
          <img src="@/assets/img/pc/icon_onInfo.svg" alt="" />
        </div>
        <div> 點擊賠率以添加選項 </div>
      </div>
    </div>

    <div
      class="noData"
      v-if="groupIndex === 1 && showBetHistoryList.length === 0 && isLoading === false"
    >
      <div class="noDataItem">
        <div class="noDataItemImgContainer">
          <img src="@/assets/img/pc/icon_noReceipt.svg" alt="" />
        </div>
        <div>暫無最新注單</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BetViewList',
    props: {
      // 0: 投注資訊
      // 1: 最新注單
      groupIndex: {
        type: Number,
        default: 0,
      },
      // 0: 投注資訊 => 單向投注
      //    投注資訊 => 過關投注
      // 1: 最新注單 => 未結算注單
      //    最新注單 => 可兌現注單
      childIndex: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        intervalEvent: null,
        totalBetAmount: 0,
        totalWinAmount: 0,
        fillEachBetAmount: null,
        fillEachWinAmount: null,
        isLoading: false,
      };
    },
    mounted() {
      this.intervalEvent = setInterval(() => {
        if (this.groupIndex === 0) {
          this.$store.dispatch('BetCart/updateAllCartData').then(() => {
            this.$nextTick(() => {
              console.log('updateAllCartData done');
              this.reCalcBetChart();
            });
          });
        }
      }, 10000);
    },
    watch: {
      isAddNewToChart() {
        this.$nextTick(() => {
          this.$refs.BetViewList.scrollTop = 999999;
        });
      },
      groupIndex: {
        handler() {
          this.callBetHistoryAPI();
        },
      },
      childIndex: {
        handler() {
          this.callBetHistoryAPI();
        },
      },
    },
    beforeDestroy() {
      clearInterval(this.intervalEvent);
    },
    computed: {
      showBetCartList() {
        return this.$store.getters['BetCart/showBetCartList'];
      },
      showBetHistoryList() {
        return this.$store.getters['BetCart/showBetHistoryList'];
      },
      isAddNewToChart() {
        return this.$store.state.BetCart.isAddNewToChart;
      },
    },
    methods: {
      clearMemberData() {
        this.totalBetAmount = 0;
        this.totalWinAmount = 0;
        this.fillEachBetAmount = null;
        this.fillEachWinAmount = null;
      },
      callBetHistoryAPI() {
        if (this.groupIndex === 1) {
          this.isLoading = true;
          this.$store
            .dispatch('BetCart/getBetHistory', {
              isset: this.childIndex === 1,
            })
            .then(() => {
              this.isLoading = false;
            });
        }
      },
      fillEachBetAmountHandler() {
        this.showBetCartList.forEach((cartData) => {
          cartData.betAmount = this.fillEachBetAmount;
        });
        this.reCalcBetChart();
      },
      fillEachWinAmountHandler() {
        this.showBetCartList.forEach((cartData) => {
          cartData.winAmount = this.fillEachWinAmount;
        });
        this.reCalcBetChart(true);
      },
      inputRowItemBlurHandler(inputType, isDriveFromWinAmount = false) {
        // 如果是每個item的下注金額 被輸入,則清除全局的下注金額輸入框
        if (inputType === 0) {
          this.fillEachBetAmount = null;
        }
        // 如果是每個item的可贏金額 被輸入,則清除全局的可贏金額輸入框
        if (inputType === 1) {
          this.fillEachWinAmount = null;
        }
        this.reCalcBetChart(isDriveFromWinAmount);
      },
      reCalcBetChart(isDriveFromWinAmount = false) {
        // 如果是透過可贏金額輸入框驅動事件,則要先透過winAmount換算betAmount
        if (isDriveFromWinAmount) {
          this.showBetCartList.forEach((cartData) => {
            const displayData = this.cartDataToDisplayData(cartData);
            if (cartData.winAmount !== null) {
              cartData.betAmount = this.$lib.truncFloor(
                cartData.winAmount / (1 + parseFloat(displayData.showOdd))
              );
            }
          });
        }

        let newTotalBetAmount = 0;
        let newTotalWinAmount = 0;
        this.showBetCartList.forEach((cartData) => {
          console.log('reCalcBetChart cartData', cartData);
          const displayData = this.cartDataToDisplayData(cartData);
          if (cartData.betAmount !== null) {
            cartData.betAmount = this.$lib.truncFloor(cartData.betAmount);
            cartData.winAmount = this.$lib.truncFloor(
              cartData.betAmount * (1 + parseFloat(displayData.showOdd))
            );
            newTotalBetAmount += cartData.betAmount;
            newTotalWinAmount += cartData.winAmount;
          }
        });

        this.totalBetAmount = newTotalBetAmount;
        this.totalWinAmount = newTotalWinAmount;
      },
      playBetOddClassJudge(OriginShowOdd, NowShowOdd) {
        if (parseFloat(OriginShowOdd) !== parseFloat(NowShowOdd)) {
          console.log(OriginShowOdd, NowShowOdd);
          return 'oddChangeStyle';
        } else {
          return '';
        }
      },
      cancelHandler() {
        this.clearMemberData();
        this.$store.commit('BetCart/clearCart');
        this.reCalcBetChart();
      },
      cancelSingleHandler(gameID) {
        this.fillEachBetAmount = null;
        this.fillEachWinAmount = null;
        this.$store.commit('BetCart/removeCartByGameID', gameID);
        this.reCalcBetChart();
      },
      submitHandler() {
        this.$store.dispatch('BetCart/submitBet').then((res) => {
          this.clearMemberData();
        });
      },
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
          .cardContentBlockWithHalfRow {
            width: 50%;
            text-align: left;
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
      .betInputRow {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 40px;
        .betInputTitle {
          width: 20%;
          text-align-last: justify;
          text-align: justify;
          text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
        }
        .betInputSymbol {
          width: 5%;
          text-align: center;
        }
        input {
          width: 75%;
          height: 30px;
          border: 0px;
          padding: 0 5px;
        }
      }
      .totalRow {
        padding: 12px 5px;
        display: flex;
        justify-content: space-around;
        .halfItem {
          width: 50%;
          text-align: left;
        }
      }
    }
    .noData {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      height: 100%;
      .noDataItem {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .noDataItemImgContainer {
          width: 100%;
        }
      }
    }
  }
</style>

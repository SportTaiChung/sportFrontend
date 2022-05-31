<template>
  <div id="BetViewList" :set="(displayData = [])" ref="BetViewList" v-loading="isLoading">
    <!-- 購物車 -->
    <template v-if="groupIndex === 0">
      <template v-if="isShowChartList || isShowCharStrayList">
        <div
          class="listCardItem"
          v-for="(cart, cartIndex) in showBetCartList"
          :class="listCardItemClassJudge(cart)"
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
              :style="isShowBlackMask(cart) ? 'color:white;' : ''"
              @click="cancelSingleHandler(cart.GameID)"
            ></i>
          </div>

          <div class="cardContentBlock">
            <div class="cardContentBlockRow">
              {{ displayData[cartIndex].showGameTypeLabel }}
            </div>
            <div class="cardContentBlockRow"> {{ cart.LeagueNameStr }} </div>
            <div class="cardContentBlockRow">
              <div class="cardContentBlockRowText">{{ cart.HomeTeamStr }}</div>
              <div class="cardContentBlockRowText HomeTeamSign" v-if="cart.SetFlag">(主)</div>
              <div class="cardContentBlockRowText"> v {{ cart.AwayTeamStr }}</div>
              <div class="cardContentBlockRowText HomeTeamSign" v-if="!cart.SetFlag">(主)</div>
            </div>
            <!-- 一般投注每一個item的各自金額 -->
            <div class="cardContentBlockRow" v-if="childIndex === 0">
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
                  @input="inputRowItemChangeHandler()"
                />
                <input
                  class="input"
                  v-model.number="cart.winAmount"
                  placeholder="可赢金額"
                  type="Number"
                  @input="inputRowItemWinAmountChangeHandler(cartIndex)"
                  @blur="reCalcBetChart()"
                />
              </div>
            </div>
            <div class="cardContentBlockRow limitText"> 本場上限 : {{ cart.BetMax }} </div>
          </div>

          <div class="blackMaskErrorBlock" v-if="isShowBlackMask(cart)">
            <div class="blackMaskText"> 盤口關閉中，請移除再下注 </div>
          </div>
        </div>
      </template>
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
              <div class="cardContentBlockRowText StatusTypeContent">
                {{ historyItem.StatusTypeContent }}</div
              >
            </div>
          </div>
        </template>

        <template v-if="historyItem.BetType === 99">
          <div class="strayContentBlock">
            <div class="strayContentBlockRow">
              <div>過關</div>
              <div class="strayTitleInfoText">{{ historyItem.dataBet.length }}串1 x 1</div>
              <div class="strayTitleInfoTextTip">降量</div>
            </div>
            <div class="strayContentBlockRow">
              {{ `(每組${historyItem.Amount}元 x 1組) = ${historyItem.Amount}` }}
            </div>
          </div>
        </template>
      </div>
    </template>

    <!-- 單向投注下方面板 -->
    <div class="cardOptionBlock" v-if="isShowChartList">
      <div class="betInputRow">
        <div class="betInputTitle"> 單注 </div>
        <div class="betInputSymbol">:</div>
        <input v-model.number="fillEachBetAmount" type="Number" @input="fillEachBetAmountHandler" />
        <div class="betInputRowAbsoluteBlock">x {{ showBetCartList.length }}</div>
      </div>
      <div class="betInputRow">
        <div class="betInputTitle"> 可贏金額 </div>
        <div class="betInputSymbol">:</div>
        <input
          v-model.number="fillEachWinAmount"
          type="Number"
          @input="fillEachWinAmountHandler()"
          @blur="reCalcBetChart()"
        />
        <div class="betInputRowAbsoluteBlock">x {{ showBetCartList.length }}</div>
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

    <!-- 串關投注下方面板 -->
    <div class="cardOptionBlock" v-if="isShowCharStrayList">
      <div class="StrayTipBlock" v-if="EvtIdRepeatList.length !== 0">
        <div class="topTextRow"> ※ 存在同場賽事 </div>
        <div class="bottomTextRow">
          <div>已選項目有</div>
          <div class="goldTip">{{ EvtIdRepeatList.length }}</div>
          <div>注無法串關</div>
        </div>
      </div>
      <div class="betInputRow">
        <div class="strayBlock">
          <div class="strayBlockTop">
            <div class="strayTopLeft">
              {{ `${showBetCartList.length}串1` }}
            </div>
            <div class="strayTopRight">
              <div class="num">1 </div>
              <div class="x"> x</div>
            </div>
          </div>
          <div class="strayBlockBottom">
            <div class="strayOdd"> @ {{ strayOdd }} </div>
          </div>
        </div>
        <div class="betInputSymbol">:</div>
        <input
          v-model.number="strayBetAmount"
          type="Number"
          @blur="reCalcStrayBetChart"
          read="true"
        />
      </div>
      <div class="betInputRow">
        <div class="betInputTitle"> 可贏金額 </div>
        <div class="betInputSymbol">:</div>
        <div class="betReadInput">{{ $lib.truncFloor(strayBetAmount * strayOdd) }}</div>
      </div>
      <div class="totalRow">
        <div class="halfItem">所有投注 : {{ strayBetAmount }}</div>
        <div class="halfItem">可贏金額 : {{ $lib.truncFloor(strayBetAmount * strayOdd) }}</div>
      </div>
      <div class="buttonRow">
        <div class="clearBtn" @click="cancelHandler"> 取消</div>
        <div class="submitBtn" @click="straySubmitHandler">確認下注</div>
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

    <div class="noData" v-if="isShowStrayCantPlayTip">
      <div class="noDataItem">
        <div class="noDataItemImgContainer"> 通關投注至少選擇2場賽事 </div>
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
        // 一般投注相關數據
        totalBetAmount: 0,
        totalWinAmount: 0,
        fillEachBetAmount: null,
        fillEachWinAmount: null,
        // 串關相關數據
        strayOdd: null,
        strayBetAmount: null,
        EvtIdRepeatList: [],
        // 其他
        isLoading: false,
        intervalEvent: null,
      };
    },
    mounted() {
      this.intervalEvent = setInterval(() => {
        if (this.groupIndex === 0) {
          this.$store.dispatch('BetCart/updateAllCartData').then(() => {
            this.$nextTick(() => {
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
      showBetCartList: {
        handler() {
          // 驅動過關賠率計算
          this.reCalcStrayBetChart();
          this.$emit('betCartListChanged', this.showBetCartList);
        },
      },
      strayOdd() {
        if (this.showBetCartList.length <= 1) {
          this.$store.commit('BetCart/setStrayOdd', null);
        } else {
          this.$store.commit('BetCart/setStrayOdd', this.strayOdd);
        }
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
      isShowChartList() {
        return this.groupIndex === 0 && this.childIndex === 0 && this.showBetCartList.length > 0;
      },
      isShowCharStrayList() {
        return this.groupIndex === 0 && this.childIndex === 1 && this.showBetCartList.length > 1;
      },
      isShowStrayCantPlayTip() {
        return this.groupIndex === 0 && this.childIndex === 1 && this.showBetCartList.length <= 1;
      },
    },
    methods: {
      listCardItemClassJudge(cart) {
        if (this.childIndex === 1 && this.EvtIdRepeatList.indexOf(cart.GameID) > -1) {
          return 'redErrorStyle';
        } else {
          return '';
        }
      },
      clearMemberData() {
        this.totalBetAmount = 0;
        this.totalWinAmount = 0;
        this.fillEachBetAmount = null;
        this.fillEachWinAmount = null;
        this.strayOdd = null;
        this.strayBetAmount = null;
        this.EvtIdRepeatList.length = 0;
        this.EvtIdRepeatList = [];
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
      inputRowItemChangeHandler() {
        this.reCalcBetChart();
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
      fillEachBetAmountHandler() {
        this.fillEachWinAmount = null;
        this.showBetCartList.forEach((cartData) => {
          cartData.betAmount = this.fillEachBetAmount;
        });
        this.reCalcBetChart();
      },
      fillEachWinAmountHandler() {
        this.fillEachBetAmount = null;
        this.showBetCartList.forEach((cartData) => {
          const displayData = this.cartDataToDisplayData(cartData);
          cartData.winAmount = this.fillEachWinAmount;
          cartData.betAmount = this.$lib.truncCeil(
            cartData.winAmount / this.$lib.trunc(parseFloat(displayData.showOdd))
          );
        });
      },
      reCalcBetChart() {
        let newTotalBetAmount = 0;
        let newTotalWinAmount = 0;
        this.showBetCartList.forEach((cartData) => {
          const displayData = this.cartDataToDisplayData(cartData);
          if (cartData.betAmount !== null) {
            cartData.betAmount = this.$lib.truncFloor(cartData.betAmount);
            cartData.winAmount = this.$lib.truncFloor(
              cartData.betAmount * this.$lib.trunc(parseFloat(displayData.showOdd))
            );
            newTotalBetAmount += cartData.betAmount;
            newTotalWinAmount += cartData.winAmount;
          }
        });

        this.totalBetAmount = newTotalBetAmount;
        this.totalWinAmount = newTotalWinAmount;
      },
      reCalcStrayBetChart() {
        let strayOdd = null;
        this.EvtIdRepeatList.length = 0;
        this.showBetCartList.forEach((cartData, index) => {
          const displayData = this.cartDataToDisplayData(cartData);

          const odd = this.$lib.trunc(1 + parseFloat(displayData.showOdd));
          if (strayOdd === null) {
            strayOdd = odd;
          } else {
            strayOdd = this.$lib.trunc(strayOdd * odd);
          }

          const EvtIDs = this.showBetCartList.map((value) => value.EvtID);
          EvtIDs.splice(index, 1);
          if (EvtIDs.indexOf(this.showBetCartList[index].EvtID) > -1) {
            this.EvtIdRepeatList.push(cartData.GameID);
          }
        });
        // 扣掉本金 就可以得到串關賠率
        this.strayOdd = this.$lib.trunc(strayOdd - 1);
      },
      playBetOddClassJudge(OriginShowOdd, NowShowOdd) {
        if (parseFloat(OriginShowOdd) !== parseFloat(NowShowOdd)) {
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
        this.$store.dispatch('BetCart/submitBet', { betType: 1 }).then((res) => {
          if (res) {
            this.clearMemberData();
          }
        });
      },
      straySubmitHandler() {
        if (this.EvtIdRepeatList.length === 0) {
          if (
            this.strayBetAmount === 0 ||
            this.strayBetAmount === '' ||
            this.strayBetAmount === null
          ) {
            this.$notify.error({
              message: '請先輸入串關金額',
            });
            return;
          }
          this.$store
            .dispatch('BetCart/submitBet', { betType: 99, strayBetAmount: this.strayBetAmount })
            .then((res) => {
              this.clearMemberData();
            });
        } else {
          this.$notify.error({
            message: '串關出現重複賽事',
          });
        }
      },
      cartDataToDisplayData(cartData) {
        return this.$SportLib.cartDataToDisplayData(cartData);
      },
      isShowBlackMask(cart) {
        return cart.Status !== 1 || cart.EvtStatus !== 1;
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
          .StatusTypeContent {
            margin-left: 15px;
            color: #148800;
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
    .redErrorStyle {
      background-color: #deb7b7;
      .cardHeaderRow {
        background-color: #d18d8c;
        color: white;
        .playMethodName,
        .playMethodNameSupport,
        .playBetOdd {
          color: white;
        }
      }
    }

    .cardOptionBlock {
      .StrayTipBlock {
        background-color: #d66764;
        width: 100%;
        padding: 15px 0px;
        .topTextRow {
          color: white;
          text-align: center;
          margin-bottom: 12px;
        }
        .bottomTextRow {
          color: white;
          display: flex;
          justify-content: center;
          .goldTip {
            color: #ffea01;
            padding: 0 5px;
          }
        }
      }
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
        position: relative;

        .betInputTitle {
          width: 20%;
          text-align-last: justify;
          text-align: justify;
          text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
        }
        .betInputSymbol {
          width: 5%;
          text-align: center;
          font-weight: bold;
        }
        input {
          width: 75%;
          height: 30px;
          border: 0px;
          padding: 0 5px;
        }
        .betReadInput {
          width: 75%;
          height: 30px;
          line-height: 30px;
          text-align: left;
          padding: 0 5px;
          background-color: #c0c0c0;
        }
        .strayBlock {
          width: 20%;
          display: flex;
          flex-wrap: wrap;
          padding: 3px 0px 0 3px;
          .strayBlockTop {
            width: 100%;
            display: flex;
            justify-content: space-between;
            .strayTopLeft {
            }
            .strayTopRight {
              display: flex;
              justify-content: center;
              .num {
                color: #005aff;
                padding-right: 3px;
              }
              .x {
                color: #777;
              }
            }
          }
          .strayBlockBottom {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            margin-top: 2px;
            .strayOdd {
              width: 100%;
              color: #f00;
              text-align: left;
              font-size: 12px;
            }
          }
        }
        .betInputRowAbsoluteBlock {
          position: absolute;
          width: 53px;
          height: 28px;
          border-left: 1px solid rgba(128, 128, 128, 0.653);
          right: 0px;
          color: #004eff;
          line-height: 30px;
          text-align: right;
          padding-right: 10px;
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
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>

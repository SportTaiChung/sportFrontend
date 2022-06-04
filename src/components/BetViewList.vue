<template>
  <div id="BetViewList" ref="BetViewList" v-loading="isLoading">
    <!-- 購物車 -->
    <template v-if="groupIndex === 0">
      <template v-if="isShowChartList || isShowCharStrayList">
        <!-- item -->
        <listCardItem
          v-for="(cartData, cartIndex) in showBetCartList"
          :cartData="cartData"
          :childIndex="childIndex"
          :cartIndex="cartIndex"
          :listCardItemClassJudge="listCardItemClassJudge(cartData.GameID)"
          :currShowKeyboardIndex="currShowKeyboardIndex"
          :key="cartIndex"
          @cancelSingleHandler="cancelSingleHandler"
          @inputRowItemChangeHandler="inputRowItemChangeHandler"
          @onCartListItemKeyboardShow="onCartListItemKeyboardShow"
        ></listCardItem>
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
              {{ showOddValue(historyItem.dataBet[0].PayoutOddsStr) }}
            </div>
          </div>
          <div class="cardContentBlock">
            <div class="cardContentBlockRow">
              {{ `${historyItem.catName} - [${historyItem.dataBet[0].WagerGrpName}]` }}
            </div>
            <div class="cardContentBlockRow"> {{ historyItem.dataBet[0].LeagueName }} </div>
            <div class="cardContentBlockRow">
              <div class="cardContentBlockRowText">{{ historyItem.dataBet[0].HomeTeam }}</div>
              <div class="cardContentBlockRowText HomeTeamSign">(主)</div>
              <div class="cardContentBlockRowText"> v {{ historyItem.dataBet[0].AwayTeam }}</div>
            </div>
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
    <div class="cardOptionBlock" v-if="isShowChartList && isShowCardOptionBlock">
      <div class="betInputRow" v-if="!isLockMode">
        <div class="betInputTitle"> 單注 </div>
        <div class="betInputSymbol">:</div>
        <input
          v-model.number="fillEachBetAmount"
          type="Number"
          @input="fillEachBetAmountHandler"
          @click="
            isShowBetKB = lastClickInput !== 1 || !isShowBetKB;
            lastClickInput = 1;
          "
        />
        <div class="betInputRowAbsoluteBlock">x {{ showBetCartList.length }}</div>
      </div>

      <div class="betInputRow" v-if="!isLockMode">
        <div class="betInputTitle"> 可贏金額 </div>
        <div class="betInputSymbol">:</div>
        <input
          v-model.number="fillEachWinAmount"
          type="Number"
          @input="fillEachWinAmountHandler()"
          @click="
            isShowBetKB = lastClickInput !== 2 || !isShowBetKB;
            lastClickInput = 2;
          "
          @blur="reCalcBetChart()"
        />
        <div class="betInputRowAbsoluteBlock">x {{ showBetCartList.length }}</div>
      </div>

      <!-- 小鍵盤 -->
      <mBetKeyboard v-if="isMobileMode && isShowBetKB"></mBetKeyboard>

      <!-- 小籌碼 -->
      <div class="betPlay_chip" v-if="!isMobileMode">
        <i class="el-icon-arrow-left" @click="chipPageIndex > 0 && chipPageIndex--"></i>
        <div class="chips">
          <div class="chip" :style="chipPosStyle(0)" @click="onChipClick(0)"></div>
          <div class="chip" :style="chipPosStyle(1)" @click="onChipClick(1)"></div>
          <div class="chip" :style="chipPosStyle(2)" @click="onChipClick(2)"></div>
        </div>
        <i class="el-icon-arrow-right" @click="chipPageIndex < maxChipPage && chipPageIndex++"></i>
      </div>

      <div class="totalRow">
        <div class="halfItem">所有投注 : {{ totalBetAmount }}</div>
        <div class="halfItem">可贏金額 : {{ totalWinAmount }}</div>
      </div>
      <div class="buttonRow">
        <div class="clearBtn" @click="cancelHandler">{{ isLockMode ? '取消' : '全部清除' }}</div>
        <div class="submitBtn" @click="submitHandler">確認下注</div>
      </div>
    </div>

    <!-- 串關投注下方面板 -->
    <div class="cardOptionBlock" v-if="isShowCharStrayList && isShowCardOptionBlock">
      <div class="StrayTipBlock" v-if="EvtIdRepeatList.length !== 0">
        <div class="topTextRow"> ※ 存在同場賽事 </div>
        <div class="bottomTextRow">
          <div>已選項目有</div>
          <div class="goldTip">{{ EvtIdRepeatList.length }}</div>
          <div>注無法串關</div>
        </div>
      </div>
      <div class="betInputRow" v-if="!isLockMode">
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
          @click="isShowStrayKB = !isShowStrayKB"
        />
      </div>
      <div class="betInputRow" v-if="!isLockMode">
        <div class="betInputTitle"> 可贏金額 </div>
        <div class="betInputSymbol">:</div>
        <div class="betReadInput">{{ $lib.truncFloor(strayBetAmount * strayOdd) }}</div>
      </div>

      <!-- 小鍵盤 -->
      <mBetKeyboard v-if="isMobileMode && isShowStrayKB"></mBetKeyboard>

      <!-- 小籌碼 -->
      <div class="betPlay_chip" v-if="!isMobileMode">
        <i class="el-icon-arrow-left" @click="chipPageIndex > 0 && chipPageIndex--"></i>
        <div class="chips">
          <div class="chip" :style="chipPosStyle(0)" @click="onChipClick(0)"></div>
          <div class="chip" :style="chipPosStyle(1)" @click="onChipClick(1)"></div>
          <div class="chip" :style="chipPosStyle(2)" @click="onChipClick(2)"></div>
        </div>
        <i class="el-icon-arrow-right" @click="chipPageIndex < maxChipPage && chipPageIndex++"></i>
      </div>

      <div class="totalRow">
        <div class="halfItem">所有投注 : {{ strayBetAmount }}</div>
        <div class="halfItem">可贏金額 : {{ $lib.truncFloor(strayBetAmount * strayOdd) }}</div>
      </div>
      <div class="buttonRow">
        <div class="clearBtn" @click="cancelHandler"> {{ isLockMode ? '取消' : '全部清除' }}</div>
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
  import mBetKeyboard from '@/components/mBetKeyboard';
  import listCardItem from '@/components/ListCardItem';

  export default {
    name: 'BetViewList',
    components: {
      mBetKeyboard,
      listCardItem,
    },
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
      isShowCardOptionBlock: {
        type: Boolean,
        default: true,
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
        isLockMode: false,

        // 是否顯示下方 主要小鍵盤
        isShowBetKB: false,
        isShowStrayKB: false,
        lastClickInput: null,

        // 目前打開小鍵盤的 購物車item index
        currShowKeyboardIndex: -1,

        chipsData: [1, 5, 10, 100, 500, 1000, 2000, 5000, 10000, 999999],
        chipPageIndex: 0,
        chipsNumPerPage: 3,
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
          this.isLockMode = false;
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
      isShowBetKB(isShowBetKB) {
        this.currShowKeyboardIndex = isShowBetKB ? -1 : this.currShowKeyboardIndex;
      },
      currShowKeyboardIndex(index) {
        this.isShowBetKB = index === -1;
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
      isMobileMode() {
        return process.env.VUE_APP_UI === 'mobile';
      },
      maxChipPage() {
        return Math.trunc(this.chipsData.length / this.chipsNumPerPage);
      },
      currentChips() {
        return this.chipsData.slice(
          this.chipPageIndex * this.chipsNumPerPage,
          (this.chipPageIndex + 1) * this.chipsNumPerPage
        );
      },
    },
    methods: {
      listCardItemClassJudge(GameID) {
        if (this.childIndex === 1 && this.EvtIdRepeatList.indexOf(GameID) > -1) {
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
        this.isLockMode = false;
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
      checkBetPlayData(betType, strayBetAmount) {
        // 串關檢查
        if (betType === 99) {
          let errorMessage = null;
          if (this.EvtIdRepeatList.length !== 0) {
            errorMessage = '串關出現重複賽事';
          }
          if (
            this.strayBetAmount === 0 ||
            this.strayBetAmount === '' ||
            this.strayBetAmount === null
          ) {
            errorMessage = '請先輸入串關金額';
          }

          if (errorMessage !== null) {
            this.$notify.error({
              message: errorMessage,
            });
            return null;
          }
        }

        // 蒐集投注資料
        const list = [];
        let errorMessage = null;
        this.$store.state.BetCart.betCartList.every((cartData) => {
          const CatId = cartData.CatID;
          const GameID = cartData.GameID;
          const WagerTypeID = cartData.WagerTypeID;
          const WagerGrpID = cartData.WagerGrpID;
          const WagerPos = cartData.wagerPos;
          const HdpPos = cartData.HdpPos;
          const CutLine = cartData.playData.playMethodData.betCutLineDealFunc(cartData);
          const oddKey = cartData.playData.playMethodData.showOdd[[cartData.clickPlayIndex]];
          const OddValue = cartData.playData[oddKey];
          const WagerString = `${CatId},${GameID},${WagerTypeID},${WagerGrpID},${WagerPos},${HdpPos},${CutLine},${OddValue},DE`;
          if (cartData.BetMax === null && cartData.BetMin === null) {
            errorMessage = '尚未收到注格資訊,請稍後再試';
            return false;
          }
          if (cartData.Status !== 1) {
            errorMessage = '請先移除過期賽事';
            return false;
          }
          // 一般投注
          if (betType === 1) {
            if (
              cartData.betAmount === null ||
              cartData.betAmount === '' ||
              cartData.betAmount === 0
            ) {
              errorMessage = '請先輸入下注金額';
              return false;
            }

            const listItem = {
              CatId,
              WagerString,
              Amount: cartData.betAmount,
              AcceptBetter: this.$store.state.Setting.acceptBetter,
              BetType: 1,
            };
            list.push(listItem);
          } // 串關投注
          else if (betType === 99) {
            if (list.length === 0) {
              const listItem = {
                CatId,
                WagerString,
                Amount: strayBetAmount,
                AcceptBetter: this.$store.state.Setting.acceptBetter,
                BetType: 99,
              };
              list.push(listItem);
            } else {
              list[0].WagerString += '|' + WagerString;
            }
          } else {
            errorMessage = `betType ${betType} not define`;
            return false;
          }
          return true;
        });
        // have error
        if (errorMessage !== null) {
          this.$notify.error({
            message: errorMessage,
          });
          return null;
        } else {
          return list;
        }
      },
      submitHandler() {
        const checkRes = this.checkBetPlayData(1, null);
        if (checkRes === null) {
          return;
        }
        if (this.isLockMode) {
          this.$store
            .dispatch('BetCart/submitBet', checkRes)
            .then((res) => {
              console.log('!!submitBet done!!!');
              this.clearMemberData();
            })
            .catch((err) => {
              console.error(err);
              this.isLockMode = false;
            });
        } else {
          this.isLockMode = true;
        }
      },
      straySubmitHandler() {
        const checkRes = this.checkBetPlayData(99, this.strayBetAmount);
        if (checkRes === null) {
          return;
        }
        if (this.isLockMode) {
          this.$store
            .dispatch('BetCart/submitBet', checkRes)
            .then((res) => {
              this.clearMemberData();
            })
            .catch((err) => {
              console.error(err);
              this.isLockMode = false;
            });
        } else {
          this.isLockMode = true;
        }
      },
      cartDataToDisplayData(cartData) {
        return this.$SportLib.cartDataToDisplayData(cartData);
      },
      isShowBlackMask(cart) {
        return cart.Status !== 1 || cart.EvtStatus !== 1;
      },
      onCartListItemKeyboardShow(index) {
        this.currShowKeyboardIndex = index;
      },
      chipPosStyle(chipIndex) {
        const n = this.chipsNumPerPage;
        const x = 57 * (chipIndex + this.chipPageIndex * n);
        return {
          'background-position-x': -x + 'px',
        };
      },
      onChipClick(index) {
        const value = this.currentChips[index] > 0 ? this.currentChips[index] : null;
        console.log('籌碼點擊: ', value);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #BetViewList {
    height: calc(100% - 35px);
    overflow: auto;

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
      .betPlay_chip {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid #888;
        padding-bottom: 5px;

        i {
          color: 000;
          font-size: 22px;
          font-weight: bold;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.3s ease;
          &:hover {
            opacity: 1;
          }
          &:active {
            transform: scale(1.25);
          }
        }

        .chips {
          flex: 1;
          flex-grow: 1;
          flex-shrink: 1;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          overflow: hidden;

          .chip {
            cursor: pointer;
            flex: 0 0 57px;
            background: url('~@/assets/img/pc/icon_chip.png') no-repeat;
            background-size: auto 100%;
            width: 57px;
            height: 37px;
            transition: all ease 0.1s;

            &:hover {
              transform: translateY(-4px);
            }
            &:active {
              transform: translateY(-4px) scale(1.05);
            }

            $chip-width: 57px;
            &:nth-child(2n + 1) {
              background-position-x: -57px;
            }
          }
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

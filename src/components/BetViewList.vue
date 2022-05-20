<template>
  <div id="BetViewList" :set="(displayData = [])" ref="BetViewList">
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
                  cart.BetMin !== null && cart.BetMax !== null
                    ? cart.BetMin + '-' + cart.BetMax
                    : ''
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
              <div class="cardContentBlockWithHalfRow">最高返還: {{ historyItem.item }}</div>
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
      <div class="buttonRow"> </div>
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

    <div class="noData" v-if="groupIndex === 1 && showBetHistoryList.length === 0">
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
      };
    },
    mounted() {
      this.intervalEvent = setInterval(() => {
        if (this.groupIndex === 0) {
          this.$store.dispatch('BetCart/updateAllCartData');
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
          if (this.groupIndex === 1) {
            this.$store.dispatch('BetCart/getBetHistory', {
              isset: this.childIndex === 1,
            });
          }
        },
        deep: true,
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

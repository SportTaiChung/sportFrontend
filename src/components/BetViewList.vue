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
          :listCardItemClassJudge="listCardItemClassJudge(cartData.GameID, cartData)"
          :currShowKeyboardIndex="currShowKeyboardIndex"
          :key="cartIndex"
          @cancelSingleHandler="cancelSingleHandler"
          @inputRowItemChangeHandler="inputRowItemChangeHandler"
          @onCartListItemKeyboardShow="onCartListItemKeyboardShow"
          @lastBlurInputEvent="lastBlurInputEvent"
          @Add="keyBoardAddEvent"
          @Assign="keyBoardAssignEvent"
          @MobileListItemSubmitBet="submitHandler"
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
              <template v-if="historyItem.dataBet[0].AwayTeam === '.'">
                <div class="teamRow">{{ historyItem.dataBet[0].HomeTeam }}</div>
              </template>
              <template v-else-if="historyItem.dataBet[0].HomeTeam === '.'">
                <div class="teamRow">{{ historyItem.dataBet[0].AwayTeam }}</div>
              </template>
              <template v-else>
                <div class="cardContentBlockRowText">{{ historyItem.dataBet[0].HomeTeam }}</div>
                <div class="cardContentBlockRowText HomeTeamSign">({{ $t('Common.Home') }})</div>
                <div class="cardContentBlockRowText"> v {{ historyItem.dataBet[0].AwayTeam }}</div>
              </template>
            </div>

            <div class="cardContentBlockRow">
              <div class="cardContentBlockWithHalfRow">
                {{ $t('Common.Bet') }}: {{ historyItem.Amount }}
              </div>
              <div class="cardContentBlockWithHalfRow">
                {{ $t('BetViewList.HighBack') }}:
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
          <div class="strayContentBlock" @click="historyItem.isCollapse = !historyItem.isCollapse">
            <div class="strayContentBlockRow">
              <div>{{ $t('Common.Stray') }}</div>
              <div class="strayTitleInfoText">{{ historyItem.dataBet.length }}串1 x 1</div>
            </div>
            <div class="strayContentBlockRow">
              {{
                `${$t('Common.EachZu')}${historyItem.Amount}${$t('Common.Dollar')} x 1${$t(
                  'Common.Group'
                )}) = ${historyItem.Amount}`
              }}
            </div>

            <!-- 過關詳細注單 -->

            <template v-if="historyItem.isCollapse">
              <div
                class="strayDetailBlock"
                v-for="(dataBet, dataBetIndex) in historyItem.dataBet"
                :key="dataBetIndex"
              >
                <div class="strayDetailTitle">
                  <span class="betPosName">{{ dataBet.WagerPosName }} </span>
                  <span class="cutLine"> {{ dataBet.CutLine }}</span> @
                  <span class="cutLine">{{ dataBet.PayoutOddsStr }}</span>
                </div>
                <div class="strayDetailLine"> </div>
                <div class="strayDetailContentBlock">
                  <div class="strayDetailContentBlockRow">
                    {{ `${historyItem.catName} - [${dataBet.WagerGrpName}]` }}
                  </div>
                  <div class="strayDetailContentBlockRow">
                    {{ dataBet.LeagueName }}
                  </div>

                  <div class="strayDetailContentBlockRow">
                    <template v-if="dataBet.AwayTeam === '.'">
                      <div class="">{{ dataBet.HomeTeam }}</div>
                    </template>
                    <template v-else-if="dataBet.HomeTeam === '.'">
                      <div class="">{{ dataBet.AwayTeam }}</div>
                    </template>
                    <template v-else>
                      <div class="">{{ dataBet.HomeTeam }} </div>
                      <div class="HomeTeamSign">({{ $t('Common.Home') }}) </div>
                      <div class="strayDetailContentBlockRowTeam"> v {{ dataBet.AwayTeam }}</div>
                    </template>
                  </div>
                </div>
              </div>
            </template>

            <div class="rightArrowBlock">
              <i :class="arrowIconJudge(historyItem.isCollapse)" />
            </div>
          </div>
        </template>
      </div>
    </template>

    <div
      class="cardOptionBlock"
      v-if="isMobileMode && !isShowCardOptionBlock && panelMode !== PanelModeEnum.result"
    >
      <div class="buttonRow">
        <div class="submitBtn" style="text-align: center" @click="submitHandler">
          {{ $t('Common.SubmitBet') }}
        </div>
      </div>
    </div>

    <!-- 單向投注下方面板 -->
    <div class="cardOptionBlock" v-if="isShowChartList && isShowCardOptionBlock">
      <div class="betInputRow" v-if="panelMode === PanelModeEnum.normal">
        <div class="betInputTitle"> {{ $t('Common.SingleOdd') }} </div>
        <div class="betInputSymbol">:</div>
        <input
          ref="fillEachBetAmount"
          v-model="fillEachBetAmount"
          type="number"
          @input="fillEachBetAmountHandler"
          @click="
            isShowBetKB = lastClickInput !== 1 || !isShowBetKB;
            lastClickInput = 1;
          "
          @blur="fillEachBetAmountBlurHandler"
        />
        <div class="betInputRowAbsoluteBlock">x {{ showBetCartList.length }}</div>
      </div>

      <div class="betInputRow" v-if="panelMode === PanelModeEnum.normal">
        <div class="betInputTitle"> {{ $t('Common.CanWinMoney') }} </div>
        <div class="betInputSymbol">:</div>
        <input
          v-model="fillEachWinAmount"
          type="number"
          @input="fillEachWinAmountHandler"
          @click="
            isShowBetKB = lastClickInput !== 2 || !isShowBetKB;
            lastClickInput = 2;
          "
        />
        <div class="betInputRowAbsoluteBlock">x {{ showBetCartList.length }}</div>
      </div>

      <!-- 小鍵盤 -->
      <mBetKeyboard
        v-if="isMobileMode && isShowBetKB && panelMode === PanelModeEnum.normal"
        @Add="keyBoardAddEvent"
        @Assign="keyBoardAssignEvent"
      ></mBetKeyboard>

      <!-- 小籌碼 -->
      <div class="betPlay_chip" v-if="!isMobileMode && panelMode === PanelModeEnum.normal">
        <i class="el-icon-arrow-left" @click="chipPageIndex > 0 && chipPageIndex--"></i>
        <div class="chips">
          <div
            class="chip"
            v-for="(chip, index) in currentChips"
            :style="getChipImage(index)"
            @click="onChipClick(index)"
            :key="index"
          ></div>
        </div>
        <i
          class="el-icon-arrow-right"
          @click="chipPageIndex + 1 < maxChipPage && chipPageIndex++"
        ></i>
      </div>

      <div class="totalRow">
        <div class="halfItem">{{ $t('BetViewList.TotalBet') }} : {{ totalBetAmount }}</div>
        <div class="halfItem">
          {{ $t('Common.CanWinMoney') }} :
          <span :style="isWinAmountChangeColor ? 'color:blue;' : ''">
            {{ totalWinAmount }}
          </span>
        </div>
      </div>
      <div class="buttonRow">
        <div class="clearBtn" @click="resultLeftBtnClickHandler()">
          {{ OptionCancelBtnStr }}
        </div>
        <div class="submitBtn" v-if="panelMode !== PanelModeEnum.result" @click="submitHandler">
          {{ $t('Common.SubmitBet') }}
        </div>
        <div class="closeBtn" v-else @click="resultCancelBtnClick()">
          {{ $t('Common.Close') }}
        </div>
      </div>
    </div>

    <!-- 手機 mGamesBetInfoSingle 才有的保留下注功能 -->
    <div
      class="cardOptionBlock"
      v-if="isMobileMode && isShowChartList && panelMode === PanelModeEnum.result"
    >
      <div class="buttonRow">
        <div class="clearBtn" @click="resultLeftBtnClickHandler()">
          {{ OptionCancelBtnStr }}
        </div>
        <div class="submitBtn" v-if="panelMode !== PanelModeEnum.result" @click="submitHandler">
          {{ $t('Common.SubmitBet') }}
        </div>
        <div class="closeBtn" v-else @click="resultCancelBtnClick()">
          {{ $t('Common.Close') }}
        </div>
      </div>
    </div>

    <!-- 串關投注下方面板 -->
    <div class="cardOptionBlock" v-if="isShowCharStrayList && isShowCardOptionBlock">
      <div class="StrayTipBlock" v-if="EvtIdRepeatList.length !== 0">
        <div class="topTextRow"> ※ {{ $t('BetViewList.HasSameGame') }} </div>
        <div class="bottomTextRow">
          <div>{{ $t('BetViewList.HaveChoose') }}</div>
          <div class="goldTip">{{ EvtIdRepeatList.length }}</div>
          <div>{{ $t('BetViewList.CantStray') }}</div>
        </div>
      </div>
      <div class="betInputRow" v-if="panelMode === PanelModeEnum.normal">
        <div class="strayBlock">
          <div class="strayBlockTop">
            <div class="strayTopLeft">
              {{ `${showBetCartList.length}${$t('Common.string')}1` }}
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
          ref="strayBetAmount"
          v-model="strayBetAmount"
          type="number"
          read="true"
          @input="strayBetAmountInputChangeHandler"
          @click="isShowStrayKB = !isShowStrayKB"
          @blur="strayBetBlurHandler"
        />
      </div>
      <div class="betInputRow" v-if="panelMode === PanelModeEnum.normal">
        <div class="betInputTitle"> {{ $t('Common.CanWinMoney') }} </div>
        <div class="betInputSymbol">:</div>
        <div class="betReadInput">{{ $lib.truncFloor(strayBetAmount * strayOdd) }}</div>
      </div>

      <!-- 小鍵盤 -->
      <mBetKeyboard
        v-if="isMobileMode && isShowStrayKB && panelMode === PanelModeEnum.normal"
        @Add="keyBoardAddEvent"
        @Assign="keyBoardAssignEvent"
      ></mBetKeyboard>

      <!-- 小籌碼 -->
      <div class="betPlay_chip" v-if="!isMobileMode && panelMode === PanelModeEnum.normal">
        <i class="el-icon-arrow-left" @click="chipPageIndex > 0 && chipPageIndex--"></i>
        <div class="chips">
          <div
            class="chip"
            v-for="(chip, index) in currentChips"
            :style="getChipImage(index)"
            @click="onChipClick(index)"
            :key="index"
          ></div>
        </div>
        <i
          class="el-icon-arrow-right"
          @click="chipPageIndex + 1 < maxChipPage && chipPageIndex++"
        ></i>
      </div>

      <BetResultBlock
        style="margin-bottom: 7px; margin-left: 10px"
        v-if="panelMode === PanelModeEnum.result"
        :panelMode="panelMode"
        :cartData="showBetCartList[0]"
      >
      </BetResultBlock>

      <div
        class="strayRow"
        v-if="panelMode === PanelModeEnum.lock || panelMode === PanelModeEnum.result"
      >
        <div class="strayRowTitle"> {{ $t('BetViewList.StaryOnly1') }} </div>
        <div class="strayRowContent">
          {{
            `${showBetCartList.length}${$t('Common.string')}1 X 1 (${$t(
              'Common.EachZu'
            )}${strayBetAmount}${$t('Common.Dollar')} X 1 ${$t(
              'Common.Group'
            )}) = ${strayBetAmount}`
          }}
        </div>
      </div>

      <div class="totalRow">
        <div class="halfItem">{{ $t('BetViewList.TotalBet') }} : {{ strayBetAmount }}</div>
        <div class="halfItem">
          {{ $t('Common.CanWinMoney') }} :
          <span :style="isWinAmountChangeColor ? 'color:blue;' : ''">
            {{ $lib.truncFloor(strayBetAmount * strayOdd) }}
          </span>
        </div>
      </div>
      <div class="buttonRow">
        <div class="clearBtn" @click="resultLeftBtnClickHandler">
          {{ OptionCancelBtnStr }}
        </div>
        <div
          class="submitBtn"
          v-if="panelMode !== PanelModeEnum.result"
          @click="straySubmitHandler"
        >
          {{ $t('Common.SubmitBet') }}
        </div>
        <div class="closeBtn" v-else @click="resultCancelBtnClick()">
          {{ $t('Common.Close') }}
        </div>
      </div>
    </div>

    <div class="noData" v-if="groupIndex === 0 && showBetCartList.length === 0">
      <div class="noDataItem">
        <div class="noDataItemImgContainer">
          <img src="@/assets/img/pc/icon_onInfo.svg" alt="" />
        </div>
        <div> {{ $t('BetViewList.ClickToAdd') }} </div>
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
        <div>{{ $t('BetViewList.NoBet') }}</div>
      </div>
    </div>

    <div class="noData" v-if="isShowStrayCantPlayTip">
      <div class="noDataItem">
        <div class="noDataItemImgContainer"> {{ $t('BetViewList.StayNeed2Game') }} </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mBetKeyboard from '@/components/mBetKeyboard';
  import listCardItem from '@/components/ListCardItem';
  import BetResultBlock from '@/components/BetResultBlock';
  import { PanelModeEnum } from '@/enum/BetPanelMode';

  export default {
    name: 'BetViewList',
    components: {
      mBetKeyboard,
      listCardItem,
      BetResultBlock,
    },
    props: {
      // 0: 投注資訊
      // 1: 最新注單
      groupIndex: {
        type: Number,
        default: 0,
      },
      // 0: 投注資訊 => 單向投注
      // 1: 投注資訊 => 過關投注
      // 0: 最新注單 => 未結算注單
      // 1: 最新注單 => 可兌現注單
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
        PanelModeEnum,

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
        intervalEvent2: null,

        // 是否顯示下方 主要小鍵盤
        isShowBetKB: false,
        isShowStrayKB: false,
        lastClickInput: null,

        // 目前打開小鍵盤的 購物車item index
        currShowKeyboardIndex: -1,

        chipPageIndex: 0,
        chipsNumPerPage: 3,

        // 最後blur的input
        lastBlurInput: { name: 'fillEachBetAmount' },

        lastTraceCodeKey: null,

        isLockEnter: false,
        lockEvent: null,
      };
    },
    mounted() {
      this.intervalEvent = setInterval(() => {
        // result狀態也不更新注單
        if (this.groupIndex === 0 && this.panelMode !== this.PanelModeEnum.result) {
          this.$store.dispatch('BetCart/updateAllCartData').then(() => {
            this.$nextTick(() => {
              this.reCalcBetChart();
            });
          });
        }
      }, 10000);

      window.addEventListener('keydown', this.keyPress);
    },
    beforeDestroy() {
      clearInterval(this.intervalEvent);
      clearInterval(this.intervalEvent2);
      window.removeEventListener('keydown', this.keyPress);
    },
    watch: {
      // 有新增投注到購物車事件
      isAddNewToChart() {
        this.$nextTick(() => {
          this.$refs.BetViewList.scrollTop = 999999;
          this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.normal);

          this.reCalcBetChart();
          if (
            this.$store.state.Setting.UserSetting.defaultStrayAmount.type === 1 ||
            this.$store.state.Setting.UserSetting.defaultStrayAmount.type === 2
          ) {
            this.strayBetAmount = parseInt(
              this.$store.state.Setting.UserSetting.defaultStrayAmount.amount
            );
          }

          if (this.groupIndex === 0 && !this.isMobileMode) {
            if (this.childIndex === 0) {
              this.$refs.fillEachBetAmount.focus();
            } else if (this.childIndex === 1) {
              this.$refs.strayBetAmount.focus();
            }
          }
        });
      },
      groupIndex: {
        handler() {
          if (this.groupIndex === 1) {
            this.callBetHistoryAPI();
          }
        },
        immediate: true,
      },
      childIndex: {
        handler() {
          this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.normal);
          this.callBetHistoryAPI();
          if (this.groupIndex === 0) {
            if (this.childIndex === 0) {
              this.lastBlurInput = { name: 'fillEachBetAmount' };
            } else {
              this.lastBlurInput = { name: 'strayBetAmount' };
            }
          }
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
      chipsData() {
        this.chipPageIndex = 0;
      },
      isQuickBetEnable(val) {
        if (val) {
          // 如果快速投注開啟時 清空購物車
          this.cancelHandler();
        }
      },
      isClearMemberData() {
        this.clearMemberData();
      },
      isSubmitHandler() {
        this.submitHandler(true);
      },
    },
    computed: {
      OptionCancelBtnStr() {
        if (this.panelMode === this.PanelModeEnum.normal) {
          return this.$t('Common.Cancel');
        } else if (this.panelMode === this.PanelModeEnum.lock) {
          return this.$t('Common.AllClear');
        } else {
          return this.$t('BetViewList.KeepBetCart');
        }
      },
      settings() {
        return this.$store.state.Setting.UserSetting;
      },
      showBetCartList() {
        return this.$store.getters['BetCart/showBetCartList'];
      },
      showBetHistoryList() {
        return this.$store.getters['BetCart/showBetHistoryList'];
      },
      isAddNewToChart() {
        return this.$store.state.BetCart.isAddNewToChart;
      },
      panelMode() {
        return this.$store.state.BetCart.panelMode;
      },
      isClearMemberData() {
        return this.$store.state.BetCart.isClearMemberData;
      },
      isSubmitHandler() {
        return this.$store.state.BetCart.isSubmitHandler;
      },
      isShowChartList() {
        return this.groupIndex === 0 && this.childIndex === 0 && this.showBetCartList.length > 0;
      },
      isShowCharStrayList() {
        return this.groupIndex === 0 && this.childIndex === 1 && this.showBetCartList.length > 1;
      },
      isShowStrayCantPlayTip() {
        return this.groupIndex === 0 && this.childIndex === 1 && this.showBetCartList.length === 1;
      },
      isMobileMode() {
        return process.env.VUE_APP_UI === 'mobile';
      },
      chipsData() {
        const preferChips = this.settings.preferChips;
        if (preferChips.length > 0 && preferChips.length <= 6) {
          return this.$SportLib.chipsData.filter((chip) => preferChips.includes(chip.value));
        }
        return this.$SportLib.chipsData;
      },
      maxChipPage() {
        return Math.ceil(this.chipsData.length / this.chipsNumPerPage);
      },
      currentChips() {
        return this.chipsData.slice(
          this.chipPageIndex * this.chipsNumPerPage,
          this.chipPageIndex * this.chipsNumPerPage + 3
        );
      },
      isQuickBetEnable() {
        return this.$store.state.Game.isQuickBet.isEnable;
      },
      isWinAmountChangeColor() {
        return this.panelMode === PanelModeEnum.lock || this.panelMode === PanelModeEnum.result;
      },
      UserCredit() {
        return this.$store.state.User.UserCredit;
      },
      isChatInputFocus() {
        return this.$store.state.Chat.isChatInputFocus;
      },
    },
    methods: {
      keyPress(e) {
        if (e.key === 'Enter' && !this.isLockEnter && !this.isChatInputFocus) {
          this.isLockEnter = true;
          clearTimeout(this.lockEvent);
          this.lockEvent = setTimeout(() => {
            this.isLockEnter = false;
          }, 300);
          if (
            this.groupIndex === 0 &&
            this.showBetCartList.length !== 0 &&
            this.panelMode !== this.PanelModeEnum.result
          ) {
            if (this.childIndex === 0) {
              this.submitHandler();
            } else if (this.childIndex === 1) {
              this.straySubmitHandler();
            }
          }
        }
      },
      arrowIconJudge(isCollapse) {
        if (isCollapse) {
          return 'el-icon-arrow-up';
        } else {
          return 'el-icon-arrow-down';
        }
      },
      resultCancelBtnClick() {
        this.$emit('setNewGroupIndex', 1);
        this.$emit('setNewChildIndex', 0);
        this.lastBlurInput = { name: 'fillEachBetAmount' };
        this.cancelHandler();
      },
      showOddValue(oddValue) {
        if (this.includePrincipal) {
          return this.$lib.trunc(parseFloat(oddValue) + 1);
        } else {
          return oddValue;
        }
      },
      listCardItemClassJudge(GameID, cartData) {
        if (
          (this.childIndex === 1 && this.EvtIdRepeatList.indexOf(GameID) > -1) ||
          (this.panelMode === this.PanelModeEnum.result &&
            this.childIndex === 0 &&
            cartData.betResult !== null &&
            cartData.betResult?.code !== 200 &&
            cartData.betResult?.code !== 201)
        ) {
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
        this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.normal);
        this.lastTraceCodeKey = null;
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
        this.fillEachBetAmount = parseFloat(this.fillEachBetAmount.replace(/[^\d]/g, ''));
        if (isNaN(this.fillEachBetAmount)) {
          this.fillEachBetAmount = 0;
        }
        if (this.fillEachBetAmount > this.UserCredit) {
          this.fillEachBetAmount = this.UserCredit;
        }

        this.showBetCartList.forEach((cartData) => {
          cartData.betAmount = this.fillEachBetAmount;
        });
        this.reCalcBetChart();
      },
      fillEachWinAmountHandler() {
        this.fillEachBetAmount = null;
        this.fillEachWinAmount = parseFloat(this.fillEachWinAmount.replace(/[^\d]/g, ''));
        if (isNaN(this.fillEachWinAmount)) {
          this.fillEachWinAmount = 0;
        }

        this.showBetCartList.forEach((cartData) => {
          const displayData = this.cartDataToDisplayData(cartData);
          cartData.winAmount = this.fillEachWinAmount;
          cartData.betAmount = this.$lib.truncCeil(
            cartData.winAmount / this.$lib.trunc(parseFloat(displayData.showOdd))
          );
          if (cartData.betAmount > this.UserCredit) {
            cartData.betAmount = this.UserCredit;
          }
        });

        this.fillEachWinAmountBlurHandler();
      },
      strayBetAmountInputChangeHandler() {
        this.strayBetAmount = parseFloat(this.strayBetAmount.replace(/[^\d]/g, ''));
        if (isNaN(this.strayBetAmount)) {
          this.strayBetAmount = 0;
        }
        if (this.strayBetAmount > this.UserCredit) {
          this.strayBetAmount = this.UserCredit;
        }
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
      resultLeftBtnClickHandler() {
        if (this.panelMode === this.PanelModeEnum.result) {
          this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.normal);
          this.$store.commit('BetCart/clearCartBetResult');
        } else {
          this.cancelHandler();
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
      checkBetPlayData(betType, strayBetAmount) {
        // 串關檢查
        if (betType === 99) {
          let errorMessage = null;
          if (this.EvtIdRepeatList.length !== 0) {
            errorMessage = this.$t('BetViewList.StrayHaveSame');
          }
          if (
            this.strayBetAmount === 0 ||
            this.strayBetAmount === '' ||
            this.strayBetAmount === null
          ) {
            errorMessage = this.$t('BetViewList.PlzInputStrayAmountFirst');
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
          const OddValue = parseFloat(this.$SportLib.cartDataToDisplayData(cartData).showOdd);
          const WagerString = `${CatId},${GameID},${WagerTypeID},${WagerGrpID},${WagerPos},${HdpPos},${CutLine},${OddValue},DE`;
          // if (cartData.BetMax === null && cartData.BetMin === null && !this.isQuickBetEnable) {
          //   errorMessage = this.$t('BetViewList.NotGetBetInfo');
          //   return false;
          // }
          if (cartData.Status !== 1) {
            errorMessage = this.$t('BetViewList.PlzRemoveOutOfTimeBet');
            return false;
          }
          // 一般投注
          if (betType === 1) {
            if (
              cartData.betAmount === null ||
              cartData.betAmount === '' ||
              cartData.betAmount === 0
            ) {
              errorMessage = this.$t('BetViewList.PlzInputBetAmount');
              return false;
            }

            const listItem = {
              CatId,
              WagerString,
              Amount: parseFloat(cartData.betAmount),
              AcceptBetter: this.$store.state.Setting.UserSetting.acceptBetter,
              BetType: 1,
            };
            list.push(listItem);
          } // 串關投注
          else if (betType === 99) {
            if (list.length === 0) {
              const listItem = {
                CatId,
                WagerString,
                Amount: parseFloat(strayBetAmount),
                AcceptBetter: this.$store.state.Setting.UserSetting.acceptBetter,
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
      submitHandler(isShowMessage = false) {
        const checkRes = this.checkBetPlayData(1, null);
        if (checkRes === null) {
          return;
        }

        if (
          this.panelMode === this.PanelModeEnum.lock ||
          this.settings.showBetConfirm === false ||
          this.isQuickBetEnable
        ) {
          // 多個投注時取最大的
          this.$store.state.Setting.UserSetting.defaultAmount.amount = Math.max(
            ...checkRes.map((checkRes) => checkRes.Amount)
          );
          this.$store
            .dispatch('BetCart/submitBet', checkRes)
            .then((res) => {
              if (res?.data?.traceCodeKey) {
                this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.result);
                this.lastTraceCodeKey = res.data.traceCodeKey;
                setTimeout(() => {
                  this.callPlayStateAPI();
                }, 1000);
              }
            })
            .catch((err) => {
              console.error(err);
              this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.normal);
              this.$store.commit('SetLoading', false);
            });
        } else {
          this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.lock);
        }
      },
      straySubmitHandler() {
        const checkRes = this.checkBetPlayData(99, this.strayBetAmount);
        if (checkRes === null) {
          return;
        }
        if (this.panelMode === this.PanelModeEnum.lock || this.settings.showBetConfirm === false) {
          this.$store.state.Setting.UserSetting.defaultStrayAmount.amount = this.strayBetAmount;

          this.$store
            .dispatch('BetCart/submitBet', checkRes)
            .then((res) => {
              if (res?.data?.traceCodeKey) {
                this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.result);
                this.lastTraceCodeKey = res.data.traceCodeKey;
                setTimeout(() => {
                  this.callPlayStateAPI();
                }, 1000);
              }
            })
            .catch((err) => {
              console.error(err);
              this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.normal);
              this.$store.commit('SetLoading', false);
            });
        } else {
          this.$store.commit('BetCart/setPanelMode', this.PanelModeEnum.lock);
        }
      },
      callPlayStateAPI() {
        this.$store
          .dispatch('BetCart/playState', {
            traceCodeKey: this.lastTraceCodeKey,
          })
          .then((res) => {})
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
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
      getChipImage(pos) {
        const chip = this.currentChips[pos];
        const img = chip.img;
        return {
          'background-image': `url(${require('@/assets/img/pc/chips/' + img)})`,
        };
      },
      fillEachBetAmountBlurHandler() {
        this.lastBlurInput = { name: 'fillEachBetAmount' };
      },
      fillEachWinAmountBlurHandler() {
        this.lastBlurInput = { name: 'fillEachWinAmount' };
        this.reCalcBetChart();
      },
      strayBetBlurHandler() {
        this.lastBlurInput = { name: 'strayBetAmount' };
        this.reCalcStrayBetChart();
      },
      lastBlurInputEvent(lastBlurInputData) {
        this.lastBlurInput = lastBlurInputData;
      },
      onChipClick(index) {
        const chip = this.currentChips[index];
        if (!chip) return;
        const value = chip.value > 0 ? chip.value : null;
        this.processLastBlurInput(value);
      },
      keyBoardAddEvent(addNum) {
        this.processLastBlurInput(addNum);
      },
      keyBoardAssignEvent(newNum) {
        this.processLastBlurInput(newNum, true);
      },
      processLastBlurInput(value, isAssignMode = false) {
        if (this.lastBlurInput.name === 'rowItem') {
          const CartListIndex = this.showBetCartList.findIndex(
            (it) => it.GameID === this.lastBlurInput.GameID
          );
          if (CartListIndex > -1) {
            let newNum = 0;
            if (this.lastBlurInput.from === 'betAmount') {
              if (this.showBetCartList[CartListIndex].betAmount === null) {
                newNum = value;
              } else {
                if (isAssignMode) {
                  if (value === -1) {
                    newNum = this.showBetCartList[CartListIndex].betAmount.toString().slice(0, -1);
                  } else {
                    newNum =
                      this.showBetCartList[CartListIndex].betAmount.toString() + value.toString();
                  }
                } else {
                  newNum = parseInt(this.showBetCartList[CartListIndex].betAmount) + value;
                }
              }
              this.showBetCartList[CartListIndex].betAmount = newNum.toString();
              this.reCalcBetChart();
            } else {
              if (this.showBetCartList[CartListIndex].winAmount === null) {
                newNum = value;
              } else {
                if (isAssignMode) {
                  if (value === -1) {
                    newNum = this.showBetCartList[CartListIndex].winAmount.toString().slice(0, -1);
                  } else {
                    newNum =
                      this.showBetCartList[CartListIndex].winAmount.toString() + value.toString();
                  }
                } else {
                  newNum = parseInt(this.showBetCartList[CartListIndex].winAmount) + value;
                }
              }
              this.showBetCartList[CartListIndex].winAmount = newNum.toString();
              const cartData = this.showBetCartList[CartListIndex];
              const displayData = this.cartDataToDisplayData(cartData);
              if (cartData.winAmount !== null) {
                this.showBetCartList[CartListIndex].betAmount = this.$lib.truncCeil(
                  cartData.winAmount / this.$lib.trunc(parseFloat(displayData.showOdd))
                );
              }
              this.reCalcBetChart();
            }
          } else {
            this.lastBlurInput.name = 'fillEachBetAmount';
          }
        }
        if (
          this.lastBlurInput.name === 'fillEachBetAmount' ||
          this.lastBlurInput.name === 'fillEachWinAmount'
        ) {
          let newNum = 0;
          if (this.lastBlurInput.name === 'fillEachBetAmount') {
            if (this.fillEachBetAmount === null) {
              newNum = value;
            } else {
              if (isAssignMode) {
                if (value === -1) {
                  newNum = this.fillEachBetAmount.toString().slice(0, -1);
                } else {
                  newNum = this.fillEachBetAmount.toString() + value.toString();
                }
              } else {
                newNum = parseInt(this.fillEachBetAmount) + value;
              }
            }
            this.fillEachBetAmount = newNum.toString();
            this.fillEachBetAmountHandler();
          } else {
            if (this.fillEachWinAmount === null) {
              newNum = value;
            } else {
              if (isAssignMode) {
                if (value === -1) {
                  newNum = this.fillEachWinAmount.toString().slice(0, -1);
                } else {
                  newNum = this.fillEachWinAmount.toString() + value.toString();
                }
              } else {
                newNum = parseInt(this.fillEachWinAmount) + value;
              }
            }
            this.fillEachWinAmount = newNum.toString();
            this.fillEachWinAmountHandler();
            this.reCalcBetChart();
          }
        } else if (this.lastBlurInput.name === 'strayBetAmount') {
          let newNum = 0;
          if (this.strayBetAmount === null || this.strayBetAmount === '') {
            if (value === -1) {
              newNum = 0;
            } else {
              newNum = value;
            }
          } else {
            if (isAssignMode) {
              if (value === -1) {
                newNum = this.strayBetAmount.toString().slice(0, -1);
              } else {
                newNum = this.strayBetAmount.toString() + value.toString();
              }
            } else {
              newNum = parseInt(this.strayBetAmount) + value;
            }
          }
          this.strayBetAmount = newNum.toString();
          this.reCalcStrayBetChart();
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './ListCardItem.scss';
  #BetViewList {
    height: calc(100% - 35px);
    overflow: auto;
    &::-webkit-scrollbar {
      /*隱藏滾輪*/
      display: none;
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
        .submitBtn,
        .closeBtn {
          width: 48%;
          padding: 10px;
          font-size: 14px;
          cursor: pointer;
          font-weight: bold;
          text-align: center;
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
        .closeBtn {
          background-color: #3fa381;
          color: white;
          &:hover {
            background-color: #62b096;
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
      .strayRow {
        border: 1px solid gray;
        text-align: left;
        padding: 5px;
        font-size: 14px;
        line-height: 14px;
        .strayRowTitle {
          margin-bottom: 5px;
        }
        .strayRowContent {
        }
      }
      .betPlay_chip {
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid #888;
        padding-bottom: 5px;
        overflow: hidden;

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
            background-repeat: no-repeat;
            background-size: auto 100%;
            width: 57px;
            height: 37px;
            transition: transform ease 0.1s;

            &:hover {
              transform: translateY(-4px);
            }
            &:active {
              transform: translateY(-4px) scale(1.05);
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

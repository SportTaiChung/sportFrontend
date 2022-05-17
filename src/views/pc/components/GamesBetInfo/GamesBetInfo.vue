<template>
  <div id="GamesBetInfo">
    <div class="topHeader">
      <div class="topHeaderTextItemGroup">
        <div
          class="topHeaderTextItem"
          @click="
            selectGroupIndex = 0;
            selectChildIndex = 0;
          "
        >
          <div class="topHeaderTextItemChild" :class="topHeaderTextItemChildCSS(0)"> 投注資訊 </div>
          <div class="topHeaderTextItemChild SelectBorder" v-if="this.selectGroupIndex === 0"></div>
        </div>
        <div
          class="topHeaderTextItem"
          @click="
            selectGroupIndex = 1;
            selectChildIndex = 0;
          "
        >
          <div class="topHeaderTextItemChild" :class="topHeaderTextItemChildCSS(1)"> 最新注單 </div>
          <div class="topHeaderTextItemChild SelectBorder" v-if="this.selectGroupIndex === 1"></div>
        </div>
      </div>
      <div class="topHeaderIconItemGroup">
        <div class="topHeaderIconItem">
          <img src="@/assets/img/pc/btn_count.svg" alt="" />
        </div>
        <div class="topHeaderIconItem">
          <img src="@/assets/img/pc/btn_funSet.svg" alt="" />
        </div>
      </div>
    </div>
    <div class="bottomContainer">
      <template v-if="showBetCartList.length !== 0">
        <div class="bottomHeaderRow">
          <div
            class="bottomHeaderRowItem"
            :class="selectChildIndex === 0 ? 'bottomHeaderRowItemActive' : ''"
            @click="selectChildIndex = 0"
          >
            {{ bottomHeaderRowItem(0) }}
          </div>
          <div
            class="bottomHeaderRowItem"
            :class="selectChildIndex === 1 ? 'bottomHeaderRowItemActive' : ''"
            @click="selectChildIndex = 1"
          >
            {{ bottomHeaderRowItem(1) }}
          </div>
        </div>

        <div class="bottomListView">
          <div class="listCardItem" v-for="(cart, cartIndex) in showBetCartList" :key="cartIndex">
            <div class="cardHeaderRow">
              <div class="playMethodName"> 小</div>
              <div class="playMethodNameSupport"> 2/2.5 </div>
              <div class="at"> @ </div>
              <div class="playBetOdd"> 3.099 </div>

              <i class="el-icon-close"></i>
            </div>
            <div class="cardContentBlock">
              <div class="cardContentBlockRow"> 玩法 - [全場] </div>
              <div class="cardContentBlockRow"> {{ cart.LeagueNameStr }} </div>
              <div class="cardContentBlockRow">
                <div class="cardContentBlockRowText">{{ cart.HomeTeamStr }}</div>
                <div class="cardContentBlockRowText HomeTeamSign">(主)</div>
                <div class="cardContentBlockRowText"> v {{ cart.AwayTeamStr }}</div>
              </div>
              <div class="cardContentBlockRow">
                <div class="inputRow">
                  <input
                    class="input"
                    v-model="cart.betAmount"
                    :max="cart.BetMax"
                    :min="cart.BetMin"
                    :placeholder="cart.BetMin + '-' + cart.BetMax"
                    type="Number"
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
        </div>
      </template>

      <template v-else>
        <div class="noData">
          <div class="noDataItem" v-if="false">
            <div class="noDataItemImgContainer">
              <img src="@/assets/img/pc/icon_noReceipt.svg" alt="" />
            </div>
            <div>暫無最新注單</div>
          </div>

          <div class="noDataItem" v-else>
            <div class="noDataItemImgContainer">
              <img src="@/assets/img/pc/icon_onInfo.svg" alt="" />
            </div>
            <div> 點擊賠率以添加選項 </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GamesBetInfo',
    data() {
      return {
        selectGroupIndex: 0,
        selectChildIndex: 0,
      };
    },
    computed: {
      showBetCartList() {
        return this.$store.getters['BetCart/showBetCartList'];
      },
    },
    methods: {
      bottomHeaderRowItem(index) {
        if (this.selectGroupIndex === 0) {
          if (index === 0) {
            return '單向投注';
          } else {
            return '過關投注';
          }
        } else {
          if (index === 0) {
            return '未結算注單';
          } else {
            return '可兌現注單';
          }
        }
      },
      topHeaderTextItemChildCSS(groupIndex) {
        if (groupIndex === this.selectGroupIndex) {
          return 'ItemTextActive';
        } else {
          return '';
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  #GamesBetInfo {
    width: 300px;
    height: 100%;
    background-color: #d5d5d5;
    text-align: center;
    .topHeader {
      display: flex;
      background-color: #136146;
      border-bottom-color: #136146;
      height: 35px;
      .topHeaderTextItemGroup {
        width: 65%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 100%;
        .topHeaderTextItem {
          color: white;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          cursor: pointer;
          width: 50%;
          .topHeaderTextItemChild {
            width: 100%;
          }
          .ItemTextActive {
            margin-bottom: -12px;
          }
          .SelectBorder {
            width: 64px;
            background-color: #caffed;
            height: 3px;
          }
        }
      }
      .topHeaderIconItemGroup {
        display: flex;
        width: 35%;
        justify-content: space-around;
        align-items: center;
        height: 100%;
        .topHeaderIconItem {
          height: fit-content;
          display: flex;
          align-items: center;
          img {
            background-size: 22px;
            height: 22px;
            width: 22px;
            opacity: 0.5;
            cursor: pointer;
            &:hover {
              opacity: 1;
            }
          }
        }
      }
    }
    .bottomContainer {
      padding: 5px;
      width: 100%;
      height: calc(100% - 35px);
      margin-bottom: 5px;
      .bottomHeaderRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        .bottomHeaderRowItem {
          background-color: #c5c5c5;
          color: #666;
          width: 49%;
          height: 30px;
          line-height: 30px;
          cursor: pointer;
        }
        .bottomHeaderRowItemActive {
          background-color: #f3f3f3;
          color: #000;
        }
      }
      .bottomListView {
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
  }
</style>

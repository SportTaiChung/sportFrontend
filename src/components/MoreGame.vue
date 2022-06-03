<template>
  <div id="MoreGame" :class="isMobileClass">
    <div class="MoreGameHeader">
      <div class="teamName">{{ getTeamData.home }}</div>
      <div class="teamVS">vs</div>
      <div class="teamName">{{ getTeamData.away }}</div>
      <img
        class="closeBtn"
        src="@/assets/img/pc/btn_close_w.svg"
        @click="$store.commit('MoreGame/closeMoreGameList')"
      />
    </div>
    <div class="GameInfoBlock"> </div>
    <div class="MoreGameBlock">
      <div class="MoreGameFilterBlock">
        <div class="leftArrowBlock">
          <i :class="arrowIconJudge" />
        </div>
        <div class="filterTab"> 全部 </div>
      </div>
      <div class="MoreGameList">
        <template v-for="(menuData, menuKey) in mergeMenuHeadData">
          <div class="MoreGameListOutRow" :key="menuKey">
            <div class="MoreGameListRowTitle" @click="titleClickHandler(menuData.WagerGrpID)">
              <div class="leftArrowBlock">
                <i
                  :class="
                    titleArrowIconJudge(
                      $store.state.MoreGame.collapseGrpIDs.indexOf(menuData.WagerGrpID) === -1
                    )
                  "
                />
              </div>
              <div class="MoreGameListRowTitleText">
                {{ menuData.WagerGrpName }}
              </div>
            </div>
            <template v-for="(wagerTypeKey, wagerIndex) in Object.keys(menuData.WagerTypeIDs)">
              <!-- vIF   隱藏空Odd
                   vShow collapse隱藏 -->
              <div
                v-if="menuData.WagerTypeIDs[wagerTypeKey].OddList.length !== 0"
                v-show="$store.state.MoreGame.collapseGrpIDs.indexOf(menuData.WagerGrpID) === -1"
                class="MoreGameListInRow"
                :key="menuKey + wagerIndex"
              >
                <div class="wagerLabelBlock">
                  {{ wagerTypeKey }}
                </div>
                <div class="wagerPlayList">
                  <div
                    class="wagerPlayRow"
                    v-for="(oddData, oddKey) in menuData.WagerTypeIDs[wagerTypeKey].OddList"
                    :key="menuKey + wagerIndex + oddKey"
                  >
                    <div
                      class="betBlock"
                      v-for="(betData, betIndex) in $SportLib.oddDataToMorePlayData(
                        TeamData.SetFlag,
                        menuData.WagerTypeIDs[wagerTypeKey].WagerTypeIds[0],
                        oddData
                      )"
                      :class="betBlockSelectCSS(betData.clickPlayIndex, oddData)"
                      :key="menuKey + wagerIndex + betIndex"
                      @click="goBet(betIndex, betData, oddData)"
                    >
                      <div class="betBlockTop">
                        {{ betData.showMethod }}
                      </div>
                      <div class="betBlockBottom">
                        <Odd
                          :OddValue="betData.showOdd"
                          :UniqueID="`MoreBet-${oddData.GameID}-${betIndex}`"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
    <div class="GameChatBlock"> </div>
  </div>
</template>

<script>
  import Odd from '@/components/Odd';
  export default {
    name: 'MoreGame',
    components: {
      Odd,
    },
    data() {
      return {
        isCollapse: false,
      };
    },
    computed: {
      moreGameData() {
        return this.$store.state.MoreGame.moreGameData;
      },
      TeamData() {
        return this.moreGameData.TeamData;
      },
      MenuHead() {
        return this.moreGameData.MenuHead;
      },
      CatID() {
        return this.moreGameData.CatID;
      },
      getTeamData() {
        let home = '';
        let away = '';
        if (!this.TeamData.SetFlag) {
          home = this.TeamData.AwayTeamStr;
          away = this.TeamData.HomeTeamStr;
        } else {
          home = this.TeamData.HomeTeamStr;
          away = this.TeamData.AwayTeamStr;
        }
        return {
          home,
          away,
        };
      },
      arrowIconJudge() {
        if (this.isCollapse) {
          return 'el-icon-arrow-down';
        } else {
          return 'el-icon-arrow-up';
        }
      },
      dealGrpHead() {
        return this.MenuHead.reduce((sum, it, index) => {
          if (sum[it.WagerGrpName] === undefined) {
            sum[it.WagerGrpName] = {
              WagerGrpName: it.WagerGrpName,
              WagerGrpID: it.WagerGrpIDs[0],
              WagerTypeIDs: it.WagerTypeIDs,
            };
          } else {
            const mergeData = [...sum[it.WagerGrpName].WagerTypeIDs, ...it.WagerTypeIDs];
            sum[it.WagerGrpName].WagerTypeIDs = mergeData;
          }
          return sum;
        }, {});
      },
      mergeMenuHeadData() {
        const dealWagerHead = Object.keys(this.dealGrpHead)
          .map((key) => {
            return {
              ...this.dealGrpHead[key],
            };
          })
          .map((wagerGrpData) => {
            const newWagerTypeIDs = wagerGrpData.WagerTypeIDs.reduce((sum, WagerTypeId) => {
              const WagerTypeLabel = this.$SportLib.WagerTypeIDandWagerGrpIDtoString(
                [WagerTypeId],
                wagerGrpData.WagerGrpID,
                true
              );
              if (sum[WagerTypeLabel] === undefined) {
                sum[WagerTypeLabel] = {
                  WagerTypeIds: [WagerTypeId],
                  OddList: [],
                };
              } else {
                if (sum[WagerTypeLabel].WagerTypeIds.indexOf(WagerTypeId) === -1) {
                  sum[WagerTypeLabel].WagerTypeIds.push(WagerTypeId);
                }
              }
              return sum;
            }, {});
            return {
              ...wagerGrpData,
              WagerTypeIDs: newWagerTypeIDs,
            };
          });

        this.TeamData.Wager.forEach((wagerData) => {
          const headGrpIndex = dealWagerHead.findIndex(
            (headData) => headData.WagerGrpID === wagerData.WagerGrpID
          );
          if (headGrpIndex > -1) {
            const wagerTypeLabel = this.$SportLib.WagerTypeIDandWagerGrpIDtoString(
              [wagerData.WagerTypeID],
              wagerData.WagerGrpID,
              true
            );
            dealWagerHead[headGrpIndex].WagerTypeIDs[wagerTypeLabel].OddList.push(
              ...wagerData.Odds.filter((it) => {
                return it.Status === 1;
              }).map((it) => {
                it.WagerGrpID = wagerData.WagerGrpID;
                it.WagerTypeID = wagerData.WagerTypeID;
                return it;
              })
            );
          } else {
            if (!wagerData?.isNoData) {
              console.error(`More Game 錯誤 ${wagerData.WagerGrpID} 無法對應head grp`);
            }
          }
        });

        const finallyData = dealWagerHead.reduce((sum, grpData) => {
          let isValid = false;
          Object.keys(grpData.WagerTypeIDs).every((wagerDataKey) => {
            if (grpData.WagerTypeIDs[wagerDataKey].OddList.length !== 0) {
              isValid = true;
              return false;
            } else {
              return true;
            }
          });
          if (isValid) {
            sum.push(grpData);
          }
          return sum;
        }, []);
        console.log('dealWagerHead:', finallyData);

        return finallyData;
      },
      betCartList() {
        return this.$store.state.BetCart.betCartList;
      },
      isMobileClass() {
        if (process.env.VUE_APP_UI === 'mobile') {
          return 'mobile';
        }
        return '';
      },
    },
    methods: {
      titleArrowIconJudge(isCollapse) {
        if (!isCollapse) {
          return 'el-icon-arrow-down';
        } else {
          return 'el-icon-arrow-up';
        }
      },
      titleClickHandler(WagerGrpID) {
        const collapseIndex = this.$store.state.MoreGame.collapseGrpIDs.indexOf(WagerGrpID);
        if (collapseIndex > -1) {
          this.$store.state.MoreGame.collapseGrpIDs.splice(collapseIndex, 1);
        } else {
          this.$store.state.MoreGame.collapseGrpIDs.push(WagerGrpID);
        }
      },
      betBlockSelectCSS(clickPlayIndex, { GameID }) {
        const compareData = this.betCartList.find((cartData) => {
          return cartData.GameID === GameID;
        });

        if (compareData && compareData.clickPlayIndex === clickPlayIndex) {
          return 'betBlockSelect';
        } else {
          return '';
        }
      },
      goBet(clickPlayIndex, betData, oddData) {
        console.log(betData.wagerPos);
        const selectGameTypeID = this.$store.state.Game.selectGameType;
        const GameTypeLabel = this.$store.state.Game.GameTypeList.find(
          (it) => it.key === selectGameTypeID
        )?.value;

        const betInfoData = {
          OriginShowOdd: parseFloat(betData.showOdd),
          clickPlayIndex,
          wagerPos: betData.wagerPos,
          GameTypeID: selectGameTypeID,
          GameTypeLabel: GameTypeLabel,
          GameID: oddData.GameID,
          CatID: this.CatID,
          LeagueNameStr: this.moreGameData.LeagueNameStr,
          HomeTeamStr: this.getTeamData.home,
          AwayTeamStr: this.getTeamData.away,
          WagerTypeID: oddData.WagerTypeID,
          WagerGrpID: oddData.WagerGrpID,
          EvtID: this.TeamData.EvtID,
          EvtStatus: this.TeamData.EvtStatus,
          ...oddData,
        };
        console.log('betInfoData:', betInfoData);
        this.$store.dispatch('BetCart/addToCart', betInfoData);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #MoreGame {
    height: 100%;
    width: 370px;
    border-right: 2px solid #bbb;
    background-color: #eeeeee;
    $gameHeaderHeight: 35px;
    $gameInfoHeight: 185px;
    $gameChatHeight: 60px;

    &.mobile {
      width: 100%;
      border: 0;
    }
    .MoreGameHeader {
      background-color: #136146;
      border-bottom-color: #136146;
      display: flex;
      justify-content: center;
      align-items: center;
      height: $gameHeaderHeight;
      width: 100%;
      position: relative;
      .teamName {
        color: #fff;
      }
      .teamVS {
        color: #ffdf1b;
        font-size: 15px;
        padding: 0 8px;
      }
      .closeBtn {
        width: 13px;
        height: 13px;
        position: absolute;
        right: 10px;
        opacity: 0.5;
        top: 10px;

        cursor: pointer;
      }
    }
    .GameInfoBlock {
      height: $gameInfoHeight;
    }
    .leftArrowBlock {
      width: 50px;
      margin-right: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: pointer;
      i {
        font-size: 15px;
        margin-top: -2px;
      }
    }
    .MoreGameBlock {
      height: calc(100% - $gameHeaderHeight - $gameInfoHeight - $gameChatHeight);
      $MoreGameFilterBlockHeight: 35px;
      .MoreGameFilterBlock {
        height: $MoreGameFilterBlockHeight;
        background-color: #666;
        color: white;
        display: flex;
        align-items: center;
      }
      .MoreGameList {
        overflow-y: auto;
        height: calc(100% - $MoreGameFilterBlockHeight);
        .MoreGameListOutRow {
          width: 100%;
          height: fit-content;
          .MoreGameListRowTitle {
            width: 100%;
            background-color: #eee;
            color: #000;
            height: 35px;
            cursor: pointer;
            border-bottom: 1px solid #d6d6d6;
            display: flex;
            align-items: center;
          }
          .MoreGameListInRow {
            height: fit-content;
            display: flex;
            align-items: center;
            width: 100%;
            min-height: 50px;
            background-color: white;
            border-bottom: 1px solid #eeeeee;
            .wagerLabelBlock {
              width: 78px;
              height: 100%;
              display: flex;
              justify-content: center;
            }
            .wagerPlayList {
              width: calc(100% - 78px);
              .wagerPlayRow {
                display: flex;
                width: 100%;
                border-bottom: 1px solid #eeeeee;
                &:last-child {
                  border-bottom: 0px;
                }
                .betBlock {
                  width: 100%;
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: center;
                  &:hover {
                    background-color: #ffe1ae;
                  }
                  .betBlockTop {
                    width: 100%;
                    height: 25px;
                    padding-bottom: 2px;
                    border-left: 1px solid #eeeeee;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    cursor: pointer;
                  }
                  .betBlockBottom {
                    padding-top: 2px;
                    width: 100%;
                    height: 25px;
                    text-align: center;
                    color: #3fa381;
                    border-left: 1px solid #eeeeee;
                    cursor: pointer;
                  }
                }
                .betBlockSelect {
                  background-color: #ffd5d5;
                }
              }
            }
          }
        }
      }
    }
    .GameChatBlock {
      height: $gameChatHeight;
      background-color: #333;
    }
  }
</style>

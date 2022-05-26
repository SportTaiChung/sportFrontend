<template>
  <div id="MoreGame">
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
        <div
          class="MoreGameListOutRow"
          v-for="(menuData, menuKey) in mergeMenuHeadData"
          :key="menuKey"
        >
          <div class="MoreGameListRowTitle">
            <div class="leftArrowBlock">
              <i :class="arrowIconJudge" />
            </div>
            <div class="MoreGameListRowTitleText">
              {{ menuData.WagerGrpName }}
            </div>
          </div>
          <template v-for="(wagerData, wagerKey) in Object.keys(menuData.WagerTypeIDs)">
            <div
              v-if="menuData.WagerTypeIDs[wagerData].OddList.length !== 0"
              class="MoreGameListInRow"
              :key="menuKey + wagerKey"
            >
              <div class="wagerLabelBlock">
                {{ wagerData }}
              </div>
              <div class="wagerPlayList">
                <div
                  class="wagerPlayRow"
                  v-for="(oddData, oddKey) in menuData.WagerTypeIDs[wagerData].OddList"
                  :key="menuKey + wagerKey + oddKey"
                >
                  <div
                    class="betBlock"
                    v-for="(betData, betKey) in $SportLib.oddDataToMorePlayData(
                      CatID,
                      menuData.WagerTypeIDs[wagerData].WagerTypeIds[0],
                      oddData
                    )"
                    :key="menuKey + wagerKey + betKey"
                  >
                    <div class="betBlockTop">
                      {{ betData.showMethod }}
                    </div>
                    <div class="betBlockBottom">
                      {{ betData.showOdd }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="GameChatBlock"> </div>
  </div>
</template>

<script>
  export default {
    name: 'MoreGame',
    data() {
      return {
        isCollapse: false,
      };
    },
    created() {
      // console.log(this.moreGameData);
      // console.log(this.mergeMenuHeadData);
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
        if (this.$SportLib.isHomeAwayReverse(this.CatID)) {
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
      mergeMenuHeadData() {
        const dealGrpHead = this.MenuHead.reduce((sum, it, index) => {
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

        const dealWagerHead = Object.keys(dealGrpHead)
          .map((key) => {
            return {
              ...dealGrpHead[key],
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
              ...wagerData.Odds
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
        console.log('dealWagerHead:', dealWagerHead, finallyData);

        return finallyData;
      },
    },
    methods: {
      wagerToPlayData(wagerData = null, oddData = null) {
        console.log(wagerData, oddData);
        const playData = this.$SportLib.oddDataToPlayData(
          this.CatID,
          wagerData.WagerTypeIds[0],
          oddData
        );
        if (playData.playMethodData !== null) {
          return playData;
        } else {
          console.error('More Game 無法解析', wagerData, oddData);
        }
        console.log('playData:', playData);
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
            border-top: 1px solid #d6d6d6;
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

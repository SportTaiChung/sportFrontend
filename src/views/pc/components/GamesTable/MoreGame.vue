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
              {{ menuData.groupName }}
            </div>
          </div>
          <div
            class="MoreGameListInRow"
            v-for="(wagerData, wagerKey) in Object.keys(menuData.WagerTypeIDs)"
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
                {{ oddData }}
              </div>
            </div>
          </div>
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
      console.log(this.moreGameData);

      console.log(this.mergeMenuHeadData);
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
              WagerGrpName: it.WagerGrpName[0],
              WagerGrpID: it.WagerGrpIDs[0],
              WagerTypeIDs: it.WagerTypeIDs,
            };
          } else {
            const mergeData = [...sum[it.WagerGrpName].WagerTypeIDs, ...it.WagerTypeIDs];
            sum[it.WagerGrpName].WagerTypeIDs = mergeData;
          }
          return sum;
        }, {});

        console.log('dealWagerHead:', dealGrpHead);
        const dealWagerHead = Object.keys(dealGrpHead)
          .map((key) => {
            return {
              groupName: key,
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
        // console.log('dealWagerHead:', dealWagerHead);

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

        console.log('dealWagerHead:', dealWagerHead);

        return dealWagerHead;
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
          .MoreGameListRowTitle {
            width: 100%;
            background-color: #eee;
            color: #000;
            height: 35px;
            cursor: pointer;
            border-top: 1px solid #404040;
            display: flex;
            align-items: center;
          }
          .MoreGameListInRow {
            height: fit-content;
            min-height: 45px;
            display: flex;
            align-items: center;
            width: 100%;
            background-color: white;
            border-bottom: 1px solid #eeeeee;
            .wagerLabelBlock {
              width: 78px;
              display: flex;
              justify-content: center;
            }
            .wagerPlayList {
              width: calc(100% - 78px);
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

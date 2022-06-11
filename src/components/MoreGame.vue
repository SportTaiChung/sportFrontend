<template>
  <div id="MoreGame" :class="isMobileClass">
    <div class="MoreGameHeader">
      <div class="teamName">{{ getteamData.home }}</div>
      <div class="teamVS">vs</div>
      <div class="teamName">{{ getteamData.away }}</div>
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
        <div class="menuTab" v-for="(menuData, menuIndex) in menuTabs" :key="menuIndex">
          <div @click="selectItemKey = menuData.ItemKey">{{ menuData.ItemName }}</div>
          <div class="active" v-if="menuData.ItemKey === selectItemKey"></div>
        </div>
      </div>
      <div class="MoreGameList">
        <template v-for="(gameData, gameIndex) in FinalGameList">
          <div class="MoreGameListOutRow" :key="gameIndex">
            <div class="MoreGameListRowTitle" @click="titleClickHandler(gameData.ItemName)">
              <div class="leftArrowBlock">
                <i
                  :class="titleArrowIconJudge(collapseItemNames.indexOf(gameData.ItemName) === -1)"
                />
              </div>
              <div class="MoreGameListRowTitleText">
                {{ gameData.ItemName }}
              </div>
            </div>

            <template v-for="(leagueData, leagueIndex) in gameData.List">
              <template v-if="collapseItemNames.indexOf(gameData.ItemName) === -1">
                <template v-for="(renderHeadData, renderHeadIndex) in leagueData.RenderHead">
                  <div class="MoreGameListInRow" :key="gameIndex + leagueIndex + renderHeadIndex">
                    <div class="wagerLabelBlock">
                      {{ renderHeadData.HeadShowName }}
                    </div>
                    <div class="wagerPlayList">
                      <div
                        class="wagerPlayRow"
                        v-for="(oddData, oddIndex) in renderHeadData.Odds"
                        :key="gameIndex + leagueIndex + renderHeadIndex + oddIndex"
                      >
                        <div
                          class="betBlock"
                          v-for="(betData, betIndex) in $SportLib.oddDataToMorePlayData(
                            teamData.SetFlag,
                            oddData.WagerTypeID,
                            oddData
                          )"
                          :class="betBlockSelectCSS(betData.wagerPos, oddData)"
                          :key="gameIndex + leagueIndex + renderHeadIndex + oddIndex + betIndex"
                          @click="goBet(betData, oddData, leagueData)"
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
              </template>
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
        collapseItemNames: [],
        selectItemKey: null,
      };
    },
    created() {},
    computed: {
      moreGameData() {
        if (Object.keys(this.$store.state.MoreGame.moreGameData).length === 0) {
          return null;
        } else {
          return this.$store.state.MoreGame.moreGameData;
        }
      },
      GameList() {
        if (this.moreGameData === null) {
          return [];
        }
        return this.moreGameData.List;
      },
      FinalGameList() {
        if (this.GameList.length === 0) {
          return [];
        }
        return this.GameList.map((gameData) => {
          const newList = gameData.List.map((LeagueData) => {
            // 排列出Wager底下所有Odd
            const Odds = LeagueData.Team[0].Wager.reduce((sum, WagerData) => {
              const wagerOdds = WagerData.Odds.map((oddData) => {
                const WagerTypeID = WagerData.WagerTypeID;
                const headWagerData = gameData.BestHead.find((headData) => {
                  const findIndex = headData.WagerTypeIDs.findIndex(
                    (typeID) => typeID === WagerTypeID
                  );
                  if (findIndex > -1) {
                    return true;
                  } else {
                    return false;
                  }
                });
                if (headWagerData) {
                  return {
                    ...oddData,
                    WagerGrpID: WagerData.WagerGrpID,
                    WagerTypeID,
                    ShowName: gameData.ItemName + headWagerData.WagerTypeName,
                  };
                } else {
                  // TODO List出現的數據 head卻沒有
                  return {
                    empty: true,
                  };
                }
              });
              return [...sum, ...wagerOdds];
            }, []).filter((it) => it?.empty === undefined);

            // 組成渲染head
            const RenderHead = JSON.parse(JSON.stringify(gameData.BestHead)).map((it) => {
              return {
                ...it,
                Odds: [],
                HeadShowName: gameData.ItemName + it.WagerTypeName,
              };
            });

            // 將Odd資料組進渲染head
            Odds.forEach((OddData) => {
              const oddWagerTypeID = OddData.WagerTypeID;
              RenderHead.every((renderHeadData) => {
                const isFind = renderHeadData.WagerTypeIDs.find((ID) => ID === oddWagerTypeID);
                if (isFind && OddData.Status !== -1) {
                  renderHeadData.Odds.push(OddData);
                  return false;
                }
                return true;
              });
            });

            return {
              ...LeagueData,
              Team: LeagueData.Team[0],
              RenderHead,
            };
          });
          return {
            ...gameData,
            List: newList,
          };
        });
      },
      teamData() {
        return this.$store.state.MoreGame.teamData;
      },
      menuTabs() {
        if (this.moreGameData === null) {
          return [];
        }
        return this.moreGameData.Menu;
      },
      MoreGameStoreUpdateFlag() {
        return this.$store.state.MoreGame.MoreGameStoreUpdateFlag;
      },
      getteamData() {
        let home = '';
        let away = '';
        if (!this.teamData.SetFlag) {
          home = this.teamData.AwayTeamStr;
          away = this.teamData.HomeTeamStr;
        } else {
          home = this.teamData.HomeTeamStr;
          away = this.teamData.AwayTeamStr;
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
    watch: {
      MoreGameStoreUpdateFlag() {
        this.resetData();
      },
      menuTabs() {
        if (this.menuTabs.length !== 0) {
          this.selectItemKey = this.menuTabs[0].ItemKey;
        }
      },
    },
    methods: {
      resetData() {
        this.collapseItemNames.length = 0;
        this.collapseItemNames = [];
        this.selectItemKey = null;
      },
      titleArrowIconJudge(isCollapse) {
        if (!isCollapse) {
          return 'el-icon-arrow-down';
        } else {
          return 'el-icon-arrow-up';
        }
      },
      titleClickHandler(WagerGrpID) {
        const collapseIndex = this.collapseItemNames.indexOf(WagerGrpID);
        if (collapseIndex > -1) {
          this.collapseItemNames.splice(collapseIndex, 1);
        } else {
          this.collapseItemNames.push(WagerGrpID);
        }
      },
      betBlockSelectCSS(wagerPos, { GameID }) {
        const compareData = this.betCartList.find((cartData) => {
          return cartData.GameID === GameID;
        });

        if (compareData && compareData.wagerPos === wagerPos) {
          return 'betBlockSelect';
        } else {
          return '';
        }
      },
      goBet(betData, oddData, leagueData) {
        const selectGameTypeID = this.$store.state.Game.selectGameType;
        const GameTypeLabel = this.$store.state.Game.GameTypeList.find(
          (it) => it.key === selectGameTypeID
        )?.value;

        console.log('more betData:', betData);
        const betInfoData = {
          OriginShowOdd: parseFloat(betData.showOdd),
          wagerPos: betData.wagerPos,
          GameTypeID: selectGameTypeID,
          GameTypeLabel: GameTypeLabel,
          GameID: oddData.GameID,
          CatID: leagueData.CatID,
          CatNameStr: leagueData.CatNameStr,
          LeagueNameStr: this.moreGameData.LeagueNameStr,
          HomeTeamStr: this.getteamData.home,
          AwayTeamStr: this.getteamData.away,
          WagerTypeID: oddData.WagerTypeID,
          WagerGrpID: oddData.WagerGrpID,
          EvtID: this.teamData.EvtID,
          EvtStatus: this.teamData.EvtStatus,
          SetFlag: this.teamData.SetFlag,
          ...oddData,
        };
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
        .menuTab {
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-right: 20px;
          width: fit-content;
          flex-wrap: wrap;

          .active {
            width: 100%;
            height: 3px;
            background-color: #fff;
            margin-top: 2px;
          }
        }
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

<template>
  <div id="MoreGame" :class="isMobileClass" v-loading="loading">
    <div class="MoreGameHeader">
      <div
        class="btn-mobile-back"
        v-if="isMobileMode"
        @click="$store.commit('MoreGame/closeMoreGameList')"
      >
        <img src="@/assets/img/mobile/btn_arrow_w.svg" />
      </div>
      <div class="teamName home" :title="getteamData.home">{{ getteamData.home }}</div>
      <!-- 非滾球 -->
      <template v-if="selectGameType !== 2">
        <div class="teamVS">vs</div>
      </template>

      <!-- 滾球 -->
      <template v-else>
        <div class="teamVSLive">
          <div class="topBlock"> {{ teamData.TimeAct }} </div>
          <div class="bottomBlock" v-if="!teamData.SetFlag">
            {{ `${teamData.AwayScore} : ${teamData.HomeScore}` }}
          </div>
          <div class="bottomBlock" v-else>
            {{ `${teamData.HomeScore} : ${teamData.AwayScore}` }}
          </div>
        </div>
      </template>

      <div class="teamName away" :title="getteamData.away">{{ getteamData.away }}</div>
      <img
        class="closeBtn"
        src="@/assets/img/pc/btn_close_w.svg"
        @click="$store.commit('MoreGame/closeMoreGameList')"
      />
    </div>

    <!-- 滾球 -->
    <div class="GameInfoBlock" v-if="selectGameType === 2">
      <!-- 滾球 上半部資訊 -->
      <ul class="navList">
        <div
          v-if="isMobileMode"
          class="star"
          :class="starCSSJudge(teamData.EvtID)"
          @click="$store.commit('Setting/addFavorites', teamData.EvtID)"
        ></div>

        <li
          class="item"
          :title="$t('Common.LiveBoard')"
          :class="gameType2Page == 0 ? 'active' : ''"
          @click="gameType2Page = 0"
        >
          <img src="@/assets/img/common/btn_VM_scoreBoard.svg" />
        </li>
        <!-- <li
          class="item"
          title="滾球數據"
          :class="gameType2Page == 1 ? 'active' : ''"
          @click="gameType2Page = 1"
        >
          <img src="@/assets/img/common/btn_VM_runData.svg" />
        </li> -->
        <li
          class="item"
          :title="$t('Common.Live')"
          :class="gameType2Page == 2 ? 'active' : ''"
          @click="gameType2Page = 2"
        >
          <img src="@/assets/img/common/btn_GDV_live.svg" />
        </li>
        <!-- <li
          class="item"
          title="賽事數據"
          :class="gameType2Page == 3 ? 'active' : ''"
          @click="gameType2Page = 3"
        >
          <img src="@/assets/img/common/btn_VM_gameData.svg" />
        </li> -->
      </ul>

      <!-- 即將推出 -->
      <div
        v-show="gameType2Page == 2"
        class="coming-soon interactive"
        src="@/assets/img/common/coming_soon.jpg"
        @click="onComingSoonClick()"
      >
      </div>

      <!-- 比分板區塊 -->
      <div v-if="gameType2Page === 0 && isShowLiveScore">
        <components
          :is="LiveBoardComponentName"
          :gameScoreData="gameScoreData"
          :teamData="teamData"
        >
        </components>
      </div>
    </div>

    <!-- 早盤、今日 -->
    <div class="GameInfoBlock" v-if="selectGameType === 0 || selectGameType === 1">
      <!-- 今日 上半部資訊 -->
      <ul class="navList">
        <!-- 收藏按鈕 -->
        <div
          v-if="isMobileMode"
          class="star"
          :class="starCSSJudge(teamData.EvtID)"
          @click="$store.commit('Setting/addFavorites', teamData.EvtID)"
        ></div>

        <!-- <li
          class="item"
          title="比分板"
          :class="gameType1Page == 0 ? 'active' : ''"
          @click="gameType1Page = 0"
        >
          <img src="@/assets/img/common/btn_VM_scoreBoard.svg" />
        </li> -->
        <li
          class="item"
          :title="$t('Common.RollBalData')"
          :class="gameType1Page == 1 ? 'active' : ''"
          @click="gameType1Page = 1"
        >
          <img src="@/assets/img/common/btn_VM_runData.svg" />
        </li>
        <!-- <li
          class="item"
          title="直播"
          :class="gameType1Page == 2 ? 'active' : ''"
          @click="gameType1Page = 2"
        >
          <img src="@/assets/img/common/btn_GDV_live.svg" />
        </li> -->
        <li
          class="item"
          :title="$t('Common.GameData')"
          :class="gameType1Page == 3 ? 'active' : ''"
          @click="gameType1Page = 3"
        >
          <img src="@/assets/img/common/btn_VM_gameData.svg" />
        </li>
      </ul>

      <!-- 即將推出 -->
      <div
        v-show="true"
        class="coming-soon"
        src="@/assets/img/common/coming_soon.jpg"
        @click="onComingSoonClick()"
      >
      </div>
    </div>

    <div class="MoreGameBlock" :class="selectGameType !== 2 ? 'MoreGameBlockWithOutGameInfo' : ''">
      <div class="MoreGameFilterBlock">
        <div class="leftArrowBlock">
          <i :class="collapseAllArrowIconJudge" @click="collapseAllIconClick" />
        </div>
        <div class="menuTab" v-for="(menuData, menuIndex) in menuTabs" :key="menuIndex">
          <div @click="selectItemKey = menuData.ItemKey">{{ menuData.ItemName }}</div>
          <div class="active" v-if="menuData.ItemKey === selectItemKey"></div>
        </div>

        <img
          v-if="isMobileMode"
          class="btn-record"
          src="@/assets/img/common/btn_record.svg"
          @click="$emit('openBetRecordView')"
        />
      </div>
      <div class="MoreGameList" :class="MoreGameListClassJudge">
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
                  <div
                    class="MoreGameListInRow"
                    :key="'MoreGameListInRow' + gameIndex + leagueIndex + renderHeadIndex"
                  >
                    <div class="wagerLabelBlock">
                      {{ renderHeadData.HeadShowName }}
                    </div>
                    <div class="wagerPlayList">
                      <!-- 波膽 -->
                      <div
                        class="wagerPlayRow"
                        v-if="renderHeadData.WagerTypeIDs.indexOf(112) !== -1"
                      >
                        <template
                          v-for="(boldTemplate, boldKey) in [
                            boldTemplate1,
                            boldTemplate2,
                            boldTemplate3,
                          ]"
                        >
                          <div class="columnContainer" :key="boldKey">
                            <div class="boldBetBlockTitle" v-if="boldKey === 0">
                              {{ $t('Common.Home') }}
                            </div>
                            <div class="boldBetBlockTitle" v-if="boldKey === 1">
                              {{ $t('Common.Drew') }}
                            </div>
                            <div class="boldBetBlockTitle" v-if="boldKey === 2">
                              {{ $t('Common.Away') }}
                            </div>

                            <div
                              class="boldBetBlock"
                              v-for="(OULine, index) in boldTemplate"
                              :class="
                                boldTableBetBlockIsSelect(
                                  boldOddToMapData(renderHeadData.Odds)[OULine],
                                  OULine
                                )
                              "
                              :key="`${boldKey}-${index}`"
                              @click="
                                goBoldBet(
                                  boldOddToMapData(renderHeadData.Odds)[OULine],
                                  teamData,
                                  leagueData,
                                  $event
                                )
                              "
                            >
                              <div class="boldLeft">{{ OULine }}</div>
                              <div class="boldRight">
                                {{ showDrewOdd(boldOddToMapData(renderHeadData.Odds)[OULine]) }}
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>

                      <div
                        v-else
                        class="wagerPlayRow"
                        v-for="(oddData, oddIndex) in renderHeadData.Odds"
                        :key="'wagerPlayRow' + gameIndex + leagueIndex + renderHeadIndex + oddIndex"
                      >
                        <div
                          class="betBlock"
                          v-for="(betData, betIndex) in $SportLib.oddDataToMorePlayData(
                            teamData.SetFlag,
                            oddData.WagerTypeID,
                            oddData
                          )"
                          :class="betBlockSelectCSS(betData.wagerPos, oddData)"
                          :key="
                            'betBlock' +
                            gameIndex +
                            leagueIndex +
                            renderHeadIndex +
                            oddIndex +
                            betIndex
                          "
                          @click="goBet(gameData, betData, oddData, leagueData, $event)"
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

      <div class="GameChatBlock" v-if="selectGameType === 2">
        <GameChat> </GameChat>
      </div>
    </div>
  </div>
</template>

<script>
  import Odd from '@/components/Odd';
  import LiveBoards from '@/components/LiveBoard/LiveBoardIndex';
  import { NotCheckWagerGrpIDs } from '@/Config/index.js';
  import GameChat from '@/components/GameChat';
  export default {
    name: 'MoreGame',
    components: {
      GameChat,
      Odd,
      ...LiveBoards,
    },
    data() {
      return {
        collapseItemNames: [],
        selectItemKey: null,
        intervalEvent: null,
        intervalEvent2: null,

        gameType1Page: 1,
        gameType2Page: 0,

        ComponentMapList: {
          1: 'Soccer',
          21: 'PingPong',
          22: 'Badminton',
          23: 'Volleyball',
          55: 'Tennis',
          85: 'PCGame',
          101: 'BaseBall',
          102: 'BasketBall',
        },

        boldTemplate1: ['1-0', '2-0', '2-1', '3-0', '3-1', '3-2', '4-0', '4-1', '4-2', '4-3'],
        boldTemplate2: ['0-0', '1-1', '2-2', '3-3', '4-4', 'other'],
        boldTemplate3: ['0-1', '0-2', '1-2', '0-3', '1-3', '2-3', '0-4', '1-4', '2-4', '3-4'],
      };
    },
    created() {
      // 定時更新遊戲賠率
      this.intervalEvent = setInterval(() => {
        this.$store.dispatch('MoreGame/GetMoreGameDetailSmall', this.teamData.EvtID);
      }, 6000);

      // 某些滾球數據,需要輪詢,像是棒球
      if (this.isGameScoreRefresh) {
        this.intervalEvent2 = setInterval(() => {
          this.$store.dispatch('MoreGame/GetGameLiveResult', this.teamData.EvtID);
        }, 5000);
      }
    },
    beforeDestroy() {
      clearInterval(this.intervalEvent);
      clearInterval(this.intervalEvent2);
    },
    computed: {
      MoreGameListClassJudge() {
        if (this.selectGameType === 2) {
          return 'MoreGameListWithLive';
        } else {
          return '';
        }
      },
      isQuickBetEnable() {
        return this.$store.state.Game.isQuickBet.isEnable;
      },
      moreGameData() {
        if (Object.keys(this.$store.state.MoreGame.moreGameData).length === 0) {
          return null;
        } else {
          return this.$store.state.MoreGame.moreGameData;
        }
      },
      loading() {
        return this.$store.state.MoreGame.loading;
      },
      GameList() {
        if (this.moreGameData === null) {
          return [];
        }
        return this.moreGameData.List;
      },
      selectGameType() {
        return this.$store.state.Game.selectGameType;
      },
      selectCatID() {
        return this.$store.state.Game.selectCatID;
      },
      teamData() {
        return this.$store.state.MoreGame.teamData;
      },
      CatMapData() {
        return this.$store.state.Game.CatMapData;
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
      collapseAllArrowIconJudge() {
        if (this.FinalGameList.length === this.collapseItemNames.length) {
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
      isMobileMode() {
        return process.env.VUE_APP_UI === 'mobile';
      },
      CatList() {
        return this.$store.state.Game.CatList;
      },
      isShowLiveScore() {
        return this.moreGameData?.GameScore !== undefined;
      },
      FinalGameList() {
        if (this.GameList.length === 0) {
          return [];
        }
        return this.GameList.filter((gameData) => {
          return gameData.ItemKeys.indexOf(this.selectItemKey) > -1;
        }).map((gameData) => {
          const newList = gameData.List.map((LeagueData) => {
            // 排列出Wager底下所有Odd
            const Odds = LeagueData.Team[0].Wager.reduce((sum, WagerData) => {
              const wagerOdds = WagerData.Odds.map((oddData) => {
                const WagerGrpID = WagerData.WagerGrpID;
                const WagerTypeID = WagerData.WagerTypeID;

                const headWagerData = gameData.BestHead.find((headData) => {
                  // 如果 WagerGrpID 不是128,需要同時檢查WagerGrpIDs和WagerTypeIDs
                  if (NotCheckWagerGrpIDs.indexOf(headData.WagerGrpIDs[0]) === -1) {
                    const WagerGrpIDIndex = headData.WagerGrpIDs.indexOf(WagerGrpID);
                    const WagerTypeIDIndex = headData.WagerTypeIDs.indexOf(WagerTypeID);

                    if (WagerTypeIDIndex !== -1 && WagerGrpIDIndex !== -1) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    // 如果 WagerGrpID 是128, 只要檢查 WagerTypeIDs 就好
                    const findIndex = headData.WagerTypeIDs.findIndex(
                      (typeID) => typeID === WagerTypeID
                    );
                    if (findIndex > -1) {
                      return true;
                    } else {
                      return false;
                    }
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
            let RenderHead = JSON.parse(JSON.stringify(gameData.BestHead)).map((it) => {
              return {
                ...it,
                Odds: [],
                HeadShowName: it.WagerTypeName,
              };
            });

            // 將Odd資料組進渲染head
            Odds.forEach((OddData) => {
              const oddWagerTypeID = OddData.WagerTypeID;
              RenderHead.every((renderHeadData) => {
                if (renderHeadData.HdpPos === 128) {
                  const isFind = renderHeadData.WagerTypeIDs.find((ID) => ID === oddWagerTypeID);
                  if (isFind && OddData.Status !== -1) {
                    renderHeadData.Odds.push(OddData);
                    return false;
                  }
                } else {
                  if (OddData.HdpPos === renderHeadData.HdpPos) {
                    renderHeadData.Odds.push(OddData);
                    return false;
                  }
                }
                return true;
              });
            });

            RenderHead = RenderHead.filter((renderHeadData) => renderHeadData.Odds.length !== 0);

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
      LiveBoardComponentName() {
        const findCatData = this.CatList.find((catData) => {
          return catData.CatID === this.selectCatID;
        });
        if (findCatData) {
          const componentName = this.ComponentMapList[this.selectCatID];
          if (componentName) {
            return componentName;
          } else {
            console.error(`${this.selectCatID} 的球種 還沒製作`);
            return null;
          }
        } else {
          console.error(`${this.selectCatID} 的球種 不在彩種列表內`);
          return null;
        }
      },
      isGameScoreRefresh() {
        const catData = this.CatMapData[this.selectCatID];
        return catData && catData.GameScoreRefresh && this.selectGameType === 2;
      },
      gameScoreData() {
        if (this.isGameScoreRefresh) {
          return this.moreGameData.GameScore;
        } else {
          return this.moreGameData.GameScoreHead;
        }
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
      selectItemKey() {
        this.collapseItemNames.length = 0;
        this.collapseItemNames = [];
      },
      'teamData.EvtID': {
        handler() {
          if (this.selectGameType === 2) {
            window.chat.initWebsocket(this.teamData.EvtID);
          }
        },
        immediate: true,
      },
    },
    methods: {
      boldOddToMapData(boldOdd) {
        const res = boldOdd.reduce((sum, it, index) => {
          return {
            ...sum,
            ...{
              [it.OULine]: it,
            },
          };
        }, {});
        return res;
      },
      showDrewOdd(mapData) {
        return mapData?.DrewOdds;
      },
      judgeGameLiveScore(templateCatID, selectCatID) {
        const findCatData = this.CatList.find((catData) => {
          return catData.CatID === templateCatID;
        });
        return findCatData.GroupCatIDs.findIndex((it) => it === selectCatID) !== -1;
      },
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
      collapseAllIconClick() {
        if (this.FinalGameList.length === this.collapseItemNames.length) {
          this.collapseItemNames.length = 0;
          this.collapseItemNames = [];
        } else {
          this.collapseItemNames.length = 0;
          this.collapseItemNames = this.FinalGameList.map((it) => it.ItemName);
        }
      },
      goBet(gameData, betData, oddData, leagueData, event) {
        this.$emit('AddToCart');
        const selectGameTypeID = this.$store.state.Game.selectGameType;
        const GameTypeLabel = this.$store.state.Game.GameTypeList.find(
          (it) => it.key === selectGameTypeID
        )?.value;

        const betInfoData = {
          OriginShowOdd: parseFloat(betData.showOdd),
          wagerPos: betData.wagerPos,
          GameTypeID: selectGameTypeID,
          GameTypeLabel: GameTypeLabel,
          GameID: oddData.GameID,
          CatID: leagueData.CatID,
          CatNameStr: this.$store.state.Game.CatMapData[leagueData.CatID]?.Name,
          LeagueNameStr: this.moreGameData.LeagueNameStr,
          HomeTeamStr: this.getteamData.home,
          AwayTeamStr: this.getteamData.away,
          WagerTypeID: oddData.WagerTypeID,
          WagerGrpID: oddData.WagerGrpID,
          EvtID: this.teamData.EvtID,
          EvtStatus: this.teamData.EvtStatus,
          SetFlag: this.teamData.SetFlag,
          ItemName: gameData.ItemName,
          ...oddData,
        };
        this.$store.dispatch('BetCart/addToCart', betInfoData);

        if (this.isQuickBetEnable) {
          const clickTarget = event.target.getBoundingClientRect();
          this.$store.commit('BetCart/showQuickBetData', {
            isShow: true,
            x: clickTarget.left,
            y: clickTarget.top + 5,
          });
        }
      },
      starCSSJudge(EvtID) {
        if (this.$store.state.Setting.UserSetting.favorites.indexOf(EvtID) > -1) {
          return 'active';
        } else {
          return '';
        }
      },
      openLive() {
        const safariWindow = window.open();
        safariWindow.opener = null;
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('Game/GetLiveURL')
          .then((res) => {
            safariWindow.location.href = res.data;
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
      onComingSoonClick() {
        if (this.selectGameType === 2) {
          // 滾球
          if (this.gameType2Page === 2) {
            // 直播
            this.openLive();
          }
        }
      },
      boldTableBetBlockIsSelect(oddData, OULine) {
        if (oddData === undefined) {
          return '';
        }
        const compareData = this.betCartList.find((cartData) => cartData.GameID === oddData.GameID);
        if (compareData && compareData.OULine === OULine) {
          return 'boldTableBetBlockSelect';
        } else {
          return '';
        }
      },
      checkQuickBet(event) {
        if (this.isQuickBetEnable) {
          const clickTarget = event.target.getBoundingClientRect();
          this.$store.commit('BetCart/showQuickBetData', {
            isShow: true,
            x: clickTarget.left,
            y: clickTarget.top,
          });
        }
      },
      goBoldBet(boldData, teamData, leagueData, event) {
        if (boldData === undefined) {
          return;
        }

        this.$emit('AddToCart');

        const selectGameTypeID = this.$store.state.Game.selectGameType;
        const GameTypeLabel = this.$store.state.Game.GameTypeList.find(
          (it) => it.key === selectGameTypeID
        )?.value;

        const betInfoData = {
          OriginShowOdd: parseFloat(boldData.DrewOdds),
          wagerPos: 3,
          GameTypeID: selectGameTypeID,
          GameTypeLabel: GameTypeLabel,
          GameID: boldData.GameID,
          CatID: leagueData.CatID,
          CatNameStr: this.$store.state.Game.CatMapData[leagueData.CatID]?.Name,
          LeagueNameStr: leagueData.LeagueNameStr,
          HomeTeamStr: teamData.HomeTeamStr,
          AwayTeamStr: teamData.AwayTeamStr,
          WagerGrpID: 10,
          WagerTypeID: 112,
          EvtID: teamData.EvtID,
          EvtStatus: teamData.EvtStatus,
          SetFlag: teamData.SetFlag,
          ...boldData,
        };

        this.$store.dispatch('BetCart/addToCart', betInfoData);

        this.checkQuickBet(event);
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
    $gameInfoHeight: 150px;
    $gameChatHeight: 60px;

    display: flex;
    flex-flow: column nowrap;
    &.mobile {
      min-width: 370px;
      border: 0;
    }
    .MoreGameHeader {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: 1fr 70px 1fr;
      background-color: #136146;
      border-bottom-color: #136146;
      height: $gameHeaderHeight;
      width: 100%;
      position: relative;
      .teamName {
        line-height: 35px;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 1rem;
        &.home {
          text-align: right;
        }
        &.away {
          text-align: left;
          padding-right: 2rem;
        }
      }
      .teamVS {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0 8px;
        overflow: hidden;
        color: #ffdf1b;
        font-size: 15px;
      }
      .teamVSLive {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 8px;
        overflow: hidden;
        .topBlock {
          color: #c5f0c5;
          text-align: center;
        }
        .bottomBlock {
          color: white;
          text-align: center;
        }
      }
      .closeBtn {
        width: 13px;
        height: 13px;
        position: absolute;
        right: 10px;
        opacity: 0.5;
        top: 10px;
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
      }

      .btn-mobile-back {
        position: absolute;
        left: 10px;
        top: 10px;
        img {
          width: 15px;
          height: auto;
          transform: rotate(90deg);
          opacity: 0.7;
          margin-right: 1rem;
          cursor: pointer;
          &:active {
            opacity: 1;
          }
        }
      }
    }
    .GameInfoBlock {
      height: fit-content;
      min-height: $gameInfoHeight;
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
      position: relative;
      flex: 1;
      overflow: auto;
      height: calc(100% - $gameHeaderHeight - $gameInfoHeight - $gameChatHeight);
      $MoreGameFilterBlockHeight: 35px;
      .MoreGameFilterBlock {
        height: $MoreGameFilterBlockHeight;
        width: 100%;
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
            background-color: #caffed;
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
                border-left: 1px solid #eeeeee;
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

                .columnContainer {
                  width: 33.33%;
                  %boldBetBLock {
                    width: 100%;
                    height: 45px;
                    line-height: 45px;
                  }
                  .boldTableBetBlockSelect {
                    background-color: #ffd5d5;
                  }
                  .boldBetBlockTitle {
                    @extend %boldBetBLock;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid #eeeeee;
                    border-right: 1px solid #eeeeee;
                  }
                  .boldBetBlock {
                    @extend %boldBetBLock;
                    padding: 0 5px;
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #eeeeee;
                    border-right: 1px solid #eeeeee;
                    cursor: pointer;
                    .boldLeft {
                      width: 40%;
                      text-align: right;
                      padding: 0 2.5px;
                    }
                    .boldRight {
                      width: 60%;
                      padding: 0 2.5px;
                      text-align: center;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .MoreGameListWithLive {
        height: calc(100% - $MoreGameFilterBlockHeight - 60px);
      }
    }
    .MoreGameBlockWithOutGameInfo {
      height: calc(100% - $gameHeaderHeight - $gameChatHeight);
    }
    .GameChatBlock {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    ul.navList {
      position: relative;
      background: #666;
      display: flex;
      justify-content: center;
      align-items: stretch;
      height: 35px;
      li.item {
        text-align: center;
        padding: 4px 8px;
        display: flex;
        align-items: center;

        cursor: pointer;
        img {
          opacity: 0.4;
          height: 100%;
          max-height: 30px;
        }
        &:hover,
        &.active {
          img {
            opacity: 1;
          }
        }
      }
    }

    div.coming-soon {
      height: 150px;
      text-align: center;
      background: #333;
      background-image: url('~@/assets/img/common/coming_soon.jpg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      &.interactive {
        cursor: pointer;
      }
    }

    .star {
      position: absolute;
      top: 50%;
      left: 8px;
      transform: translateY(-56%);
      width: 25px;
      height: 25px;
      background: url('~@/assets/img/common/icon_star.svg') no-repeat center bottom;
      background-size: 100% auto;
      background-position: center bottom;
      margin: auto 15px auto auto;
      display: block;
      cursor: pointer;

      &:active,
      &.active {
        background-position: center top;
      }
    }
    .btn-record {
      width: 25px;
      height: 25px;
      margin-left: auto;
      margin-right: 15px;
      cursor: pointer;
    }
  }
</style>

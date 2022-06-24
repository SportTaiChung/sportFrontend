<template>
  <div class="GameCollapse">
    <div class="collapseTitleBlock" @click="clickArrow">
      <div class="leftArrowBlock">
        <i :class="arrowIconJudge" />
      </div>
      <div class="rightLeagueNameBlock">
        {{ source.LeagueNameStr }}
      </div>
    </div>

    <template v-if="!isCollapse">
      <!-- 波膽 -->
      <template v-if="selectCatID === 1 && selectWagerTypeKey === 2">
        <div
          class="boldTablePanel"
          v-for="(teamData, teamIndex) in source.Team"
          :key="`${teamIndex}`"
        >
          <div class="boldTableTitleBlock">
            <div class="timeBlock">
              <div class="timeText">{{ $lib.timeFormatMMDD(teamData.ScheduleTimeStr) }} </div>
              <div class="timeText">{{ $lib.timeFormatHHmm(teamData.ScheduleTimeStr) }} </div>
            </div>
            <div class="teamBlock">
              <div class="teamText">{{ teamData.HomeTeamStr }}</div>
              <div class="teamText">vs</div>
              <div class="teamText"> {{ teamData.AwayTeamStr }}</div>
            </div>
            <div
              class="star"
              :class="starCSSJudge(teamData.EvtID)"
              @click="addFavoriteHandler(teamData.EvtID)"
            ></div>
          </div>
          <div class="boldTableBetList">
            <div class="boldTableBetListLeftContainer">
              <div
                class="boldTableBetBlock"
                :class="
                  boldTableBetBlockIsSelect(
                    boldOddToMapData(teamData.Wager[0].Odds)[OULine],
                    OULine
                  )
                "
                v-for="(OULine, OULineIndex) in boldRenderLeftTemplate"
                :key="OULineIndex"
                @click="
                  goBoldBet(
                    boldOddToMapData(teamData.Wager[0].Odds)[OULine].DrewOdds,
                    boldOddToMapData(teamData.Wager[0].Odds)[OULine],
                    teamData
                  )
                "
              >
                <div class="betBlockTop">{{ OULine }} </div>
                <div class="betBlockBottom">
                  {{ boldOddToMapData(teamData.Wager[0].Odds)[OULine].DrewOdds }}
                </div>
              </div>
            </div>

            <div class="boldTableBetListRightContainer">
              <div
                class="boldTableBetBlock"
                :class="
                  boldTableBetBlockIsSelect(
                    boldOddToMapData(teamData.Wager[0].Odds)[OULine],
                    OULine
                  )
                "
                v-for="(OULine, OULineIndex) in boldRenderRightTemplate"
                :key="OULineIndex"
                @click="
                  goBoldBet(
                    boldOddToMapData(teamData.Wager[0].Odds)[OULine].DrewOdds,
                    boldOddToMapData(teamData.Wager[0].Odds)[OULine],
                    teamData
                  )
                "
              >
                <div class="betBlockTop">{{ OULine }} </div>
                <div class="betBlockBottom">
                  {{ boldOddToMapData(teamData.Wager[0].Odds)[OULine].DrewOdds }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 非波膽 -->
      <template v-else>
        <table class="normalTablePanel">
          <tbody>
            <template v-for="(teamData, teamIndex) in source.Team">
              <template v-if="teamData.EvtStatus === 1">
                <tr
                  v-for="(teamDataRowNum, rowIndex) in teamData.Row"
                  :key="`${teamIndex}-${rowIndex}`"
                >
                  <td class="FirstCatNameBlock">
                    <div class="leftTimeBlock">
                      <template v-if="rowIndex === 0 && selectGameType !== 2">
                        <div class="timeRow">
                          {{ $lib.timeFormatMMDD(teamData.ScheduleTimeStr) }}
                        </div>
                        <div class="timeRow">
                          {{ $lib.timeFormatHHmm(teamData.ScheduleTimeStr) }}
                        </div>
                      </template>
                      <template v-else>
                        <div class="timeRow" v-if="rowIndex === 0">
                          {{ teamData.TimeAct }}
                        </div>
                      </template>
                    </div>
                    <div class="centerTeamBlock">
                      <!-- 只需要顯示一個隊伍 -->
                      <template v-if="teamData.AwayTeamStr === '.'">
                        <div class="teamRow" :title="teamData.HomeTeamStr">
                          {{ teamData.HomeTeamStr }}
                          <span class="teamPt">{{ teamData.HomePtNameStr }}</span>
                        </div>
                      </template>
                      <!-- 只需要顯示一個隊伍 -->
                      <template v-else-if="teamData.HomeTeamStr === '.'">
                        <div class="teamRow" :title="teamData.AwayTeamStr">
                          {{ teamData.AwayTeamStr }}
                          <span class="teamPt">{{ teamData.AwayPtNameStr }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <!-- 主客場對調 -->
                        <template v-if="!teamData.SetFlag">
                          <div class="teamRow" :title="teamData.AwayTeamStr">
                            {{ teamData.AwayTeamStr }}
                            <span class="teamPt" v-if="teamData.AwayPtNameStr !== ''">
                              -{{ teamData.AwayPtNameStr }}
                            </span>
                          </div>
                          <div class="teamRow" :title="teamData.HomeTeamStr">
                            {{ teamData.HomeTeamStr }}
                            <span class="teamPt" v-if="teamData.HomePtNameStr !== ''">
                              -{{ teamData.HomePtNameStr }}
                            </span>
                          </div>
                        </template>
                        <template v-else>
                          <div class="teamRow" :title="teamData.HomeTeamStr">
                            {{ teamData.HomeTeamStr }}
                            <span class="teamPt" v-if="teamData.HomePtNameStr !== ''">
                              -{{ teamData.HomePtNameStr }}
                            </span>
                          </div>
                          <div class="teamRow" :title="teamData.AwayTeamStr">
                            {{ teamData.AwayTeamStr }}
                            <span class="teamPt" v-if="teamData.AwayPtNameStr !== ''">
                              -{{ teamData.AwayPtNameStr }}
                            </span>
                          </div>
                        </template>
                      </template>

                      <div class="teamRow" v-if="teamData.hasDrewOdds && rowIndex === 0">
                        和局
                      </div>
                    </div>
                    <div class="scoreBlock" v-if="rowIndex === 0 && selectGameType === 2">
                      <div
                        class="homeScore"
                        :class="teamData.HomeScore > teamData.AwayScore ? 'light' : ''"
                        >{{ teamData.HomeScore }}</div
                      >
                      <div
                        class="awayScore"
                        :class="teamData.AwayScore > teamData.HomeScore ? 'light' : ''"
                        >{{ teamData.AwayScore }}</div
                      >
                    </div>
                    <div class="rightFavoriteBlock" v-if="rowIndex === 0">
                      <div
                        class="star"
                        :class="starCSSJudge(teamData.EvtID)"
                        @click="addFavoriteHandler(teamData.EvtID)"
                      ></div>
                    </div>
                  </td>

                  <td
                    class="GameTableHeaderOtherTD"
                    v-for="(wagerData, wagerIndex) in teamData.Wager"
                    :key="wagerIndex"
                    :set="
                      ((sportData = $SportLib.WagerDataToShowData(
                        teamData.SetFlag,
                        wagerData,
                        rowIndex
                      )),
                      (isShowDrewOdd = teamData.hasDrewOdds && rowIndex === 0),
                      (GameID = wagerRoIndexToGameID(wagerData, rowIndex)))
                    "
                  >
                    <div class="WagerList">
                      <template v-if="wagerData.isNoData">
                        <!-- 如果有和 -->
                        <template v-if="isShowDrewOdd">
                          <div class="WagerRow"> </div>
                          <div class="WagerRow"> </div>
                          <div class="WagerRow"> </div>
                        </template>
                        <template v-else>
                          <div class="WagerRow"> </div>
                          <div class="WagerRow"> </div>
                        </template>
                      </template>

                      <template v-else>
                        <!-- 只有單一個Odd Layout -->
                        <template v-if="sportData.layoutType === 'single'">
                          <div
                            class="WagerRow"
                            :class="
                              WagerRowIsSelectInCartCSS(
                                GameID,
                                sportData.topPlayOdd,
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .topWagerPos
                              )
                            "
                            @click="
                              goBet(
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .topPlayOdd,
                                teamData,
                                wagerData,
                                rowIndex,
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .topWagerPos
                              )
                            "
                          >
                            <div class="WagerCenterItem">
                              <Odd :OddValue="sportData.topPlayOdd" :UniqueID="`${GameID}-0`" />
                            </div>
                          </div>
                          <div
                            class="WagerRow"
                            :class="
                              WagerRowIsSelectInCartCSS(
                                GameID,
                                sportData.bottomPlayOdd,
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .bottomWagerPos
                              )
                            "
                            @click="
                              goBet(
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .bottomPlayOdd,
                                teamData,
                                wagerData,
                                rowIndex,
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .bottomWagerPos
                              )
                            "
                          >
                            <div class="WagerCenterItem">
                              <Odd :OddValue="sportData.bottomPlayOdd" :UniqueID="`${GameID}-1`" />
                            </div>
                          </div>
                        </template>
                        <!-- 其他正常Layout -->
                        <template v-else>
                          <div
                            class="WagerRow"
                            :class="
                              WagerRowIsSelectInCartCSS(
                                GameID,
                                sportData.topPlayOdd,
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .topWagerPos
                              )
                            "
                            @click="
                              goBet(
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .topPlayOdd,
                                teamData,
                                wagerData,
                                rowIndex,
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .topWagerPos
                              )
                            "
                          >
                            <div class="WagerItem"> {{ sportData.topPlayMethod }} </div>
                            <div class="WagerItem">
                              <Odd :OddValue="sportData.topPlayOdd" :UniqueID="`${GameID}-0`" />
                            </div>
                          </div>
                          <div
                            class="WagerRow"
                            :class="
                              WagerRowIsSelectInCartCSS(
                                GameID,
                                sportData.bottomPlayOdd,
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .bottomWagerPos
                              )
                            "
                            @click="
                              goBet(
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .bottomPlayOdd,
                                teamData,
                                wagerData,
                                rowIndex,
                                $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                  .bottomWagerPos
                              )
                            "
                          >
                            <div class="WagerItem">
                              {{ sportData.bottomPlayMethod }}
                            </div>
                            <div class="WagerItem">
                              <Odd :OddValue="sportData.bottomPlayOdd" :UniqueID="`${GameID}-1`"
                            /></div>
                          </div>
                        </template>

                        <!-- '和' 玩法顯示 -->
                        <template v-if="isShowDrewOdd">
                          <template
                            v-if="
                              wagerData.Odds[0].DrewOdds === '0' ||
                              wagerData.Odds[0].DrewOdds === '0.00' ||
                              wagerData.Odds[0].Status !== 1
                            "
                          >
                            <div class="WagerRow"> </div>
                          </template>
                          <template v-else>
                            <div
                              class="WagerRow"
                              :class="
                                WagerRowIsSelectInCartCSS(
                                  GameID,
                                  wagerData.Odds[0].DrewOdds,
                                  $SportLib.WagerDataToShowData(
                                    teamData.SetFlag,
                                    wagerData,
                                    rowIndex
                                  ).drewWagerPos
                                )
                              "
                              @click="
                                goBet(
                                  wagerData.Odds[0].DrewOdds,
                                  teamData,
                                  wagerData,
                                  rowIndex,
                                  $SportLib.WagerDataToShowData(
                                    teamData.SetFlag,
                                    wagerData,
                                    rowIndex
                                  ).drewWagerPos
                                )
                              "
                            >
                              <div class="WagerCenterItem">
                                <Odd
                                  :OddValue="wagerData.Odds[0].DrewOdds"
                                  :UniqueID="`${GameID}-2`"
                                />
                              </div>
                            </div>
                          </template>
                        </template>
                      </template>
                    </div>
                  </td>
                  <td
                    v-if="teamData.MoreCount !== 0"
                    class="GameTableHeaderMoreTD"
                    :class="isGameTableHeaderMoreSelect(teamData, rowIndex)"
                  >
                    <div
                      class="moreGame"
                      @click="moreGameClickHandler(teamData)"
                      v-if="rowIndex === 0"
                    >
                      {{ teamData.MoreCount }}
                      <img src="@/assets/img/common/moreGameIcon.svg" alt="" />
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </template>
    </template>
  </div>
</template>

<script>
  import mixin from './GamesTableMixin';
  import Odd from '@/components/Odd';
  export default {
    mixins: [mixin],
    name: 'GameCollapse',
    components: {
      Odd,
    },
    props: {
      index: {
        type: Number,
      },
      source: {
        type: Object,
        default() {
          return {};
        },
      },
      isCollapse: {
        type: Boolean,
      },
    },
    data() {
      return {
        boldRenderLeftTemplate: [
          '1-0',
          '2-0',
          '2-1',
          '3-0',
          '3-1',
          '3-2',
          '4-0',
          '4-1',
          '4-2',
          '4-3',
          '0-1',
          '0-2',
          '1-2',
          '0-3',
          '1-3',
          '2-3',
          '0-4',
          '1-4',
          '2-4',
          '3-4',
        ],
        boldRenderRightTemplate: ['0-0', '1-1', '2-2', '3-3', '4-4', 'other'],
      };
    },
    computed: {
      GameList() {
        return this.gameStore.GameList;
      },
      betCartList() {
        return this.$store.state.BetCart.betCartList;
      },
      arrowIconJudge() {
        if (this.isCollapse) {
          return 'el-icon-arrow-down';
        } else {
          return 'el-icon-arrow-up';
        }
      },
      moreGameEvtID() {
        if (
          this.$store.state.MoreGame.isShowMoreGame &&
          Object.keys(this.$store.state.MoreGame.teamData).length !== 0
        ) {
          return this.$store.state.MoreGame.teamData.EvtID;
        } else {
          return null;
        }
      },
      selectCatID() {
        return this.gameStore.selectCatID;
      },
      selectGameType() {
        return this.gameStore.selectGameType;
      },
    },
    methods: {
      isGameTableHeaderMoreSelect(teamData, rowIndex) {
        if (teamData.EvtID === this.moreGameEvtID && rowIndex === 0) {
          return 'GameTableHeaderMoreSelect';
        } else {
          return '';
        }
      },
      starCSSJudge(EvtID) {
        if (this.$store.state.Setting.UserSetting.favorites.indexOf(EvtID) > -1) {
          return 'starActive';
        } else {
          return '';
        }
      },
      addFavoriteHandler(EvtID) {
        this.$store.commit('Setting/addFavorites', EvtID);
      },
      clickArrow() {
        this.$emit('collapseChange', this.source.LeagueID);
      },
      WagerRowIsSelectInCartCSS(GameID, showOdd, wagerPos) {
        let appendCSS = '';
        if (showOdd !== '') {
          appendCSS = ' WagerRowInteractive';
        }
        const compareData = this.betCartList.find((cartData) => cartData.GameID === GameID);
        if (compareData && compareData.wagerPos === wagerPos) {
          appendCSS += ' WagerRowIsSelect';
        }
        return appendCSS;
      },
      wagerRoIndexToGameID(wagerData, rowIndex) {
        if (
          wagerData?.isNoData ||
          wagerData.Odds[rowIndex] === undefined ||
          wagerData.Odds[rowIndex].Status !== 1
        ) {
          return null;
        } else {
          return wagerData.Odds[rowIndex].GameID;
        }
      },
      moreGameClickHandler(teamData) {
        this.$store.dispatch('MoreGame/openMoreGameList', {
          teamData,
        });
      },
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
      boldTableBetBlockIsSelect(oddData, OULine) {
        const compareData = this.betCartList.find((cartData) => cartData.GameID === oddData.GameID);
        if (compareData && compareData.OULine === OULine) {
          return 'boldTableBetBlockSelect';
        } else {
          return '';
        }
      },
      goBoldBet(showOdd, oddData, teamData) {
        this.$emit('AddToCart');

        const selectGameTypeID = this.$store.state.Game.selectGameType;
        const GameTypeLabel = this.$store.state.Game.GameTypeList.find(
          (it) => it.key === selectGameTypeID
        )?.value;

        const betInfoData = {
          OriginShowOdd: parseFloat(showOdd),
          wagerPos: 3,
          GameTypeID: selectGameTypeID,
          GameTypeLabel: GameTypeLabel,
          GameID: oddData.GameID,
          CatID: this.source.CatID,
          CatNameStr: this.source.CatNameStr,
          LeagueNameStr: this.source.LeagueNameStr,
          HomeTeamStr: teamData.HomeTeamStr,
          AwayTeamStr: teamData.AwayTeamStr,
          WagerGrpID: 10,
          WagerTypeID: 112,
          EvtID: teamData.EvtID,
          EvtStatus: teamData.EvtStatus,
          SetFlag: teamData.SetFlag,
          ...oddData,
        };

        this.$store.dispatch('BetCart/addToCart', betInfoData);
      },
      goBet(showOdd, teamData, wagerData, rowIndex, wagerPos) {
        if (showOdd === '') {
          return;
        }

        this.$emit('AddToCart');

        let HomeTeamStr = teamData.HomeTeamStr;
        let AwayTeamStr = teamData.AwayTeamStr;
        if (!teamData.SetFlag) {
          HomeTeamStr = teamData.AwayTeamStr;
          AwayTeamStr = teamData.HomeTeamStr;
        }

        const selectGameTypeID = this.$store.state.Game.selectGameType;
        const GameTypeLabel = this.$store.state.Game.GameTypeList.find(
          (it) => it.key === selectGameTypeID
        )?.value;

        const betInfoData = {
          OriginShowOdd: parseFloat(showOdd),
          wagerPos,
          GameTypeID: selectGameTypeID,
          GameTypeLabel: GameTypeLabel,
          GameID: wagerData.Odds[rowIndex].GameID,
          CatID: this.source.CatID,
          CatNameStr: this.source.CatNameStr,
          LeagueNameStr: this.source.LeagueNameStr,
          HomeTeamStr,
          AwayTeamStr,
          WagerTypeID: wagerData.WagerTypeID,
          WagerGrpID: wagerData.WagerGrpID,
          EvtID: teamData.EvtID,
          EvtStatus: teamData.EvtStatus,
          SetFlag: teamData.SetFlag,
          ...wagerData.Odds[rowIndex],
        };

        this.$store.dispatch('BetCart/addToCart', betInfoData);
      },
    },
  };
</script>

<style lang="scss">
  @import '@/assets/sass/theme/mixin.scss';
  @import './GameTable.scss';
  #app[data-theme='light'] {
    .GameCollapse {
      border-bottom: 1px solid #d0d0d0;
      table {
        background-color: white;
        color: black;
        tbody {
          .FirstCatNameBlock {
            border-bottom: 1px solid #f3f3f3;
            .leftTimeBlock {
              .timeRow {
                color: #888;
              }
            }
          }
        }
      }
    }
  }
  #app[data-theme='dark'] {
    .GameCollapse {
      border-bottom: 1px solid #4f4f4f;
      table {
        background-color: #585858;
        color: white;
        tbody {
          .FirstCatNameBlock {
            .leftTimeBlock {
              .timeRow {
                color: #bbb;
              }
            }
          }
        }
      }
    }
  }
  @mixin paddingTopAndBottom() {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  @mixin rowBorderBottom() {
    border-bottom: 1px solid #f3f3f3;
  }
  .GameCollapse {
    &:last-child {
      margin-bottom: 0px;
    }
    $starSize: 19px;
    .star {
      width: $starSize;
      height: $starSize;
      background-size: 100% auto;
      background: url(~@/assets/img/pc/icon_star.svg) no-repeat center bottom;
      cursor: pointer;
    }
    .starActive {
      width: $starSize;
      height: $starSize;
      background-size: 100% auto;
      background: url(~@/assets/img/pc/icon_star.svg) no-repeat center top;
    }
    .collapseTitleBlock {
      width: 100%;
      height: 35px;
      background-color: #e8e8e8;
      color: #000;
      display: flex;
      cursor: pointer;
      .leftArrowBlock {
        width: 50px;
        margin-right: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        i {
          font-size: 15px;
          margin-top: -2px;
        }
      }
      .rightLeagueNameBlock {
        display: flex;
        align-items: center;
      }
    }
    .boldTablePanel {
      width: 100%;
      .boldTableTitleBlock {
        background-color: #ddd;
        height: 30px;
        display: flex;
        align-items: center;
        .timeBlock {
          display: flex;
          .timeText {
            margin-left: 10px;
            color: #777;
          }
        }
        .teamBlock {
          display: flex;
          margin-left: 10px;
          .teamText {
            margin-left: 8px;
          }
        }
        .star {
          margin-left: 10px;
        }
      }
      .boldTableBetList {
        display: flex;
        width: 100%;
        .boldTableBetBlock {
          display: flex;
          flex-wrap: wrap;
          text-align: center;
          background-color: white;
          cursor: pointer;
          &:hover {
            background-color: #ffe1ae;
          }
          .betBlockTop {
            width: 100%;
            height: 30px;
            line-height: 30px;
          }
          .betBlockBottom {
            width: 100%;
            height: 30px;
            line-height: 30px;
            color: #30679e;
            font-weight: bold;
          }
        }
        .boldTableBetBlockSelect {
          background-color: #ffd5d5;
        }
        .boldTableBetListLeftContainer {
          display: flex;
          width: 62.5%;
          flex-wrap: wrap;
          .boldTableBetBlock {
            width: 10%;
          }
        }
        .boldTableBetListRightContainer {
          display: flex;
          width: 37.5%;
          flex-wrap: wrap;
          .boldTableBetBlock {
            width: 16.6666%;
            display: flex;
            align-items: center;
            .betBlockTop {
              line-height: 55px;
            }
            .betBlockBottom {
              line-height: 0;
            }
          }
        }
      }
    }
    .normalTablePanel {
      width: 100%;
      border-collapse: collapse;
      tbody {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        tr {
          width: 100%;
          display: flex;
        }
        .FirstCatNameBlock {
          display: flex;
          @include paddingTopAndBottom();
          .leftTimeBlock {
            width: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            .timeRow {
              width: 100%;
              text-align: center;
            }
          }
          .centerTeamBlock {
            width: calc(100% - 50px - 30px);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            padding-left: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .teamRow {
              width: 100%;
              height: fit-content;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 13px;
              line-height: 18px;
              .teamPt {
                color: gray;
              }
            }
          }
          .scoreBlock {
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            gap: 1rem;
            padding: 5px;
            .homeScore,
            .awayScore {
              &.light {
                color: #ff8500;
              }
            }
          }
          .rightFavoriteBlock {
            width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .GameTableHeaderOtherTD,
        .GameTableHeaderMoreTD {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          white-space: nowrap;
          .borderWhiteBlock {
            background-color: rgba(255, 255, 255, 0.25);
            height: 15px;
            width: 1px;
          }
        }
        .GameTableHeaderMoreSelect {
          background-color: #cce6ff;
        }
        .GameTableHeaderOtherTD {
          height: 100%;
          .WagerList {
            width: 100%;
            height: 100%;
            border-left: 1px solid #f3f3f3;
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .WagerRow {
              display: flex;
              width: 100%;
              height: 30px;
              border-bottom: 1px solid #f3f3f3;

              .WagerItem {
                width: 50%;
                text-align: left;
                line-height: 30px;
                padding-left: 5px;
                &:first-child {
                  padding-right: 5px;
                  text-align: right;
                }
              }
              .WagerCenterItem {
                width: 100%;
                text-align: center;
                line-height: 30px;
              }
            }
            .WagerRowInteractive {
              cursor: pointer;
              &:hover {
                background-color: #ffe1ae;
              }
            }
            .WagerRowIsSelect {
              background-color: #ffd5d5;
            }
          }
        }
        .GameTableHeaderMoreTD {
          border-left: 1px solid #f3f3f3;
          width: 60px;
          min-width: 60px;
          white-space: nowrap;
          @include rowBorderBottom();
        }
        .moreGame {
          cursor: pointer;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: row;
          align-items: center;
          &:hover {
            background-color: #e8e8e8;
          }

          img {
            max-width: 0.9rem;
            margin-left: 0.5rem;
          }
        }
      }
    }
  }
</style>

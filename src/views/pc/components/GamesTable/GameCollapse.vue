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
    <table v-if="!isCollapse">
      <tbody>
        <template v-for="(teamData, teamIndex) in source.Team">
          <template v-if="teamData.EvtStatus === 1">
            <tr
              v-for="(teamDataRowNum, rowIndex) in teamData.Row"
              :key="`${teamIndex}-${rowIndex}`"
            >
              <td class="FirstCatNameBlock">
                <div class="leftTimeBlock">
                  <div class="timeRow" v-if="rowIndex === 0">
                    {{ $lib.timeFormatMMDD(teamData.ScheduleTimeStr) }}
                  </div>
                  <div class="timeRow" v-if="rowIndex === 0">
                    {{ $lib.timeFormatHHmm(teamData.ScheduleTimeStr) }}
                  </div>
                </div>
                <div class="centerTeamBlock">
                  <!-- 只需要顯示一個隊伍 -->
                  <template v-if="teamData.AwayTeamStr === '.'">
                    <div class="teamRow">
                      {{ teamData.HomeTeamStr }}
                      <span class="teamPt">{{ teamData.HomePtNameStr }}</span>
                    </div>
                  </template>
                  <!-- 只需要顯示一個隊伍 -->
                  <template v-else-if="teamData.HomeTeamStr === '.'">
                    <div class="teamRow">
                      {{ teamData.AwayTeamStr }}
                      <span class="teamPt">{{ teamData.AwayPtNameStr }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <!-- 主客場對調 -->
                    <template v-if="!teamData.SetFlag">
                      <div class="teamRow"
                        >{{ teamData.AwayTeamStr }}
                        <span class="teamPt" v-if="teamData.AwayPtNameStr !== ''">
                          -{{ teamData.AwayPtNameStr }}
                        </span>
                      </div>
                      <div class="teamRow"
                        >{{ teamData.HomeTeamStr }}
                        <span class="teamPt" v-if="teamData.HomePtNameStr !== ''">
                          -{{ teamData.HomePtNameStr }}
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      <div class="teamRow"
                        >{{ teamData.HomeTeamStr }}
                        <span class="teamPt" v-if="teamData.HomePtNameStr !== ''">
                          -{{ teamData.HomePtNameStr }}
                        </span>
                      </div>
                      <div class="teamRow"
                        >{{ teamData.AwayTeamStr }}
                        <span class="teamPt" v-if="teamData.AwayPtNameStr !== ''">
                          -{{ teamData.AwayPtNameStr }}
                        </span>
                      </div>
                    </template>
                  </template>

                  <div class="teamRow" v-if="teamData.hasDrewOdds && rowIndex === 0"> 和局 </div>
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
                              $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                .drewWagerPos
                            )
                          "
                          @click="
                            goBet(
                              wagerData.Odds[0].DrewOdds,
                              teamData,
                              wagerData,
                              rowIndex,
                              $SportLib.WagerDataToShowData(teamData.SetFlag, wagerData, rowIndex)
                                .drewWagerPos
                            )
                          "
                        >
                          <div class="WagerCenterItem">
                            <Odd :OddValue="wagerData.Odds[0].DrewOdds" :UniqueID="`${GameID}-2`" />
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
                <div class="moreGame" @click="moreGameClickHandler(teamData)" v-if="rowIndex === 0">
                  更多
                  {{ teamData.MoreCount }}
                </div>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
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
      return {};
    },
    computed: {
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
        console.log(EvtID);
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
    table {
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
          .rightFavoriteBlock {
            width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
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
        }
      }
    }
  }
</style>

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
                  <!-- 主客場對調 -->
                  <template v-if="$SportLib.isHomeAwayReverse(source.CatID)">
                    <div>
                      <div class="teamRow">{{ teamData.AwayTeamStr }}</div>
                      <div class="teamRow">{{ teamData.HomeTeamStr }}</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="teamRow">{{ teamData.HomeTeamStr }}</div>
                    <div class="teamRow">{{ teamData.AwayTeamStr }}</div>
                  </template>

                  <div class="teamRow" v-if="teamData.hasDrewOdds && rowIndex === 0"> 和局 </div>
                </div>
                <div class="rightFavoriteBlock">
                  <div class="star"></div>
                </div>
              </td>

              <td
                class="GameTableHeaderOtherTD"
                v-for="(wagerData, wagerIndex) in teamData.Wager"
                :key="wagerIndex"
                :set="
                  ((sportData = $SportLib.WagerDataToShowData(source.CatID, wagerData, rowIndex)),
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
                        :class="WagerRowIsSelectInCartCSS(GameID, 0, sportData)"
                        @click="goBet(0, teamData, wagerData, rowIndex)"
                      >
                        <div class="WagerCenterItem">
                          <Odd :OddValue="sportData.topPlayOdd" :UniqueID="`${GameID}-0`" />
                        </div>
                      </div>
                      <div
                        class="WagerRow"
                        :class="WagerRowIsSelectInCartCSS(GameID, 1, sportData)"
                        @click="goBet(1, teamData, wagerData, rowIndex)"
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
                        :class="WagerRowIsSelectInCartCSS(GameID, 0, sportData)"
                        @click="goBet(0, teamData, wagerData, rowIndex)"
                      >
                        <div class="WagerItem"> {{ sportData.topPlayMethod }} </div>
                        <div class="WagerItem">
                          <Odd :OddValue="sportData.topPlayOdd" :UniqueID="`${GameID}-0`" />
                        </div>
                      </div>
                      <div
                        class="WagerRow"
                        :class="WagerRowIsSelectInCartCSS(GameID, 1, sportData)"
                        @click="goBet(1, teamData, wagerData, rowIndex)"
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
                          wagerData.Odds[0].DrewOdds === '0.00'
                        "
                      >
                        <div class="WagerRow"> </div>
                      </template>
                      <template v-else>
                        <div
                          class="WagerRow"
                          :class="WagerRowIsSelectInCartCSS(GameID, 2, sportData)"
                          @click="goBet(2, teamData, wagerData, rowIndex)"
                        >
                          <div class="WagerCenterItem">
                            <Odd :OddValue="wagerData.Odds[0].DrewOdds" :UniqueID="`${GameID}-2`"
                          /></div>
                        </div>
                      </template>
                    </template>
                  </template>
                </div>
              </td>
              <td v-if="selectWagerTypeKey === 1" class="GameTableHeaderMoreTD">
                <div class="borderWhiteBlock"></div>
                更多
                <div></div>
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
    },
    methods: {
      clickArrow() {
        // this.isCollapse = !this.isCollapse;
        console.log(this.source);
        this.$emit('collapseChange', this.source.LeagueID);
      },
      WagerRowIsSelectInCartCSS(GameID, playIndex, sportData) {
        let appendCSS = '';
        if (sportData.playMethodData !== null) {
          const showOddKeyName = sportData.playMethodData.showOdd[playIndex];
          if (sportData[showOddKeyName] !== '') {
            appendCSS = ' WagerRowInteractive';
          }
        }
        const compareData = this.betCartList.find((cartData) => cartData.GameID === GameID);
        if (compareData && compareData.clickPlayIndex === playIndex) {
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
      goBet(clickPlayIndex, teamData, wagerData, rowIndex) {
        const sportData = this.$SportLib.WagerDataToShowData(
          this.source.CatID,
          wagerData,
          rowIndex
        );

        // 如果核心lib解析出來是null 也不能下注
        if (sportData.playMethodData === null) {
          return;
        }

        // 如果點擊的選項顯示賠率是空的 代表這一格無法下注
        const showOddKeyName = sportData.playMethodData.showOdd[clickPlayIndex];
        const showOdd = sportData[showOddKeyName];
        if (showOdd === '') {
          return;
        }

        let HomeTeamStr = teamData.HomeTeamStr;
        let AwayTeamStr = teamData.AwayTeamStr;
        if (this.$SportLib.isHomeAwayReverse(this.source.CatID)) {
          HomeTeamStr = teamData.AwayTeamStr;
          AwayTeamStr = teamData.HomeTeamStr;
        }

        const selectGameTypeID = this.$store.state.Game.selectGameType;
        const GameTypeLabel = this.$store.state.Game.GameTypeList.find(
          (it) => it.key === selectGameTypeID
        )?.value;

        const betInfoData = {
          OriginShowOdd: parseFloat(showOdd),
          clickPlayIndex,
          GameTypeID: selectGameTypeID,
          GameTypeLabel: GameTypeLabel,
          GameID: wagerData.Odds[rowIndex].GameID,
          CatID: this.source.CatID,
          LeagueNameStr: this.source.LeagueNameStr,
          HomeTeamStr,
          AwayTeamStr,
          WagerTypeID: wagerData.WagerTypeID,
          WagerGrpID: wagerData.WagerGrpID,
          EvtID: teamData.EvtID,
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
      border-bottom-color: #d0d0d0;
      table {
        background-color: white;
        color: black;
        tbody {
          .FirstCatNameBlock {
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
            .teamRow {
              width: 100%;
              height: fit-content;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .rightFavoriteBlock {
            width: 30px;
            display: flex;
            align-items: center;
            $starSize: 19px;
            .star {
              width: $starSize;
              height: $starSize;
              background-size: 100% auto;
              background: url(~@/assets/img/pc/icon_star.svg) no-repeat center bottom;
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
          .borderWhiteBlock {
            background-color: rgba(255, 255, 255, 0.25);
            height: 15px;
            width: 1px;
          }
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
      }
    }
  }
</style>

<template>
  <div
    ref="mGameBetting"
    class="mGameBetting"
    :class="isExpanded ? '' : 'closed'"
    @scroll="scrollEvent"
  >
    <table :class="hasMoreGameStyle">
      <thead @click="$emit('toggleCollapse')">
        <tr>
          <th v-for="(it, i) in bestHead" :key="i"> {{ it.showName }}</th>
          <th v-if="hasMoreGame" class="moreGame-holder"></th>
        </tr>
      </thead>

      <tbody v-show="isExpanded">
        <template v-for="(teamData, teamIndex) in source.Team">
          <template v-if="teamData.EvtStatus === 1">
            <tr
              v-for="(teamDataRowNum, rowIndex) in teamData.Row"
              :key="`${teamIndex}-${rowIndex}`"
            >
              <td
                class="wager-container"
                v-for="(wagerData, wagerIndex) in teamData.Wager"
                :key="wagerIndex"
              >
                <ul
                  class="wager-group"
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
                  <template v-if="wagerData.isNoData">
                    <!-- 如果有和 -->
                    <template v-if="isShowDrewOdd">
                      <li class="wager-cell"> </li>
                      <li class="wager-cell"> </li>
                      <li class="wager-cell"> </li>
                    </template>
                    <template v-else>
                      <li class="wager-cell"> </li>
                      <li class="wager-cell"> </li>
                    </template>
                  </template>

                  <template v-else>
                    <!-- 只有單一個Odd Layout -->
                    <template v-if="sportData.layoutType === 'single'">
                      <li
                        class="wager-cell"
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
                        <Odd :OddValue="sportData.topPlayOdd" :UniqueID="`${GameID}-0`" />
                      </li>
                      <li
                        class="wager-cell"
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
                        <Odd :OddValue="sportData.bottomPlayOdd" :UniqueID="`${GameID}-1`" />
                      </li>
                    </template>
                    <!-- 其他正常Layout -->
                    <template v-else>
                      <li
                        class="wager-cell"
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
                        <div class="cell-left"> {{ sportData.topPlayMethod }} </div>
                        <div class="cell-right">
                          <Odd :OddValue="sportData.topPlayOdd" :UniqueID="`${GameID}-0`" />
                        </div>
                      </li>
                      <li
                        class="wager-cell"
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
                        <div class="cell-left"> {{ sportData.bottomPlayMethod }} </div>
                        <div class="cell-right">
                          <Odd :OddValue="sportData.bottomPlayOdd" :UniqueID="`${GameID}-1`"
                        /></div>
                      </li>
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
                        <li class="wager-cell"> </li>
                      </template>
                      <template v-else>
                        <li
                          class="wager-cell"
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
                          <Odd :OddValue="wagerData.Odds[0].DrewOdds" :UniqueID="`${GameID}-2`" />
                        </li>
                      </template>
                    </template>
                  </template>
                </ul>
              </td>

              <!-- 更多玩法按鈕 -->
              <template v-if="hasMoreGame">
                <td
                  v-if="rowIndex === 0"
                  class="moreGameBtn"
                  @click="moreGameClickHandler(teamData)"
                >
                  <img src="@/assets/img/common/moreGameIcon.svg" />
                  <span>
                    {{ teamData.MoreCount }}
                  </span>
                </td>
                <td v-else class="moreGameBtn"></td>
              </template>

              <template v-if="isShowScrollBall">
                <div class="circleLeft" :class="circleClassJudge(0)"> </div>
                <div class="circleRight" :class="circleClassJudge(1)"> </div>
              </template>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <img src="@/assets/img/mobile/btn_arrow_w.svg" class="arrow" />
  </div>
</template>

<script>
  import Odd from '@/components/Odd';

  export default {
    name: 'mGameBetting',
    components: {
      Odd,
    },
    props: {
      source: {
        type: Object,
        default() {
          return {};
        },
      },
      bestHead: {
        type: Array,
        default() {
          return [];
        },
      },
      isExpanded: {
        type: Boolean,
        default() {
          return false;
        },
      },
      hasMoreGame: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    data() {
      return {
        // true  : 亮左邊的球
        // false : 亮右邊的球
        scrollWay: true,
        isShowScrollBall: true,
      };
    },
    mounted() {
      this.$nextTick(() => {
        // 如果沒有卷軸,則不顯示小球
        const element = this.$refs.mGameBetting;
        if (element.scrollWidth <= element.clientWidth) {
          this.isShowScrollBall = false;
        } else {
          this.isShowScrollBall = true;
        }
      });
    },
    computed: {
      betCartList() {
        return this.$store.state.BetCart.betCartList;
      },
      hasMoreGameStyle() {
        return this.hasMoreGame ? 'hasMoreGame' : '';
      },
    },
    watch: {
      isExpanded(isExpanded) {
        if (!isExpanded) {
          this.$el.scrollTo(0, 0);
        }
      },
    },
    methods: {
      scrollEvent(event) {
        const element = event.target;
        if (Math.floor(element.scrollWidth - element.scrollLeft) <= element.clientWidth) {
          // 滑到最右邊
          this.scrollWay = false;
        } else if (element.scrollLeft === 0) {
          // 滑到最左邊
          this.scrollWay = true;
        }
      },
      circleClassJudge(index) {
        if (index === 0 && !this.scrollWay) {
          return 'white';
        } else if (index === 1 && this.scrollWay) {
          return 'white';
        }
      },
      WagerRowIsSelectInCartCSS(GameID, showOdd, wagerPos) {
        let appendCSS = '';
        if (showOdd !== '') {
          appendCSS = ' interactive';
        }
        const compareData = this.betCartList.find((cartData) => cartData.GameID === GameID);
        if (compareData && compareData.wagerPos === wagerPos) {
          appendCSS += ' isSelected';
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
      goBet(showOdd, teamData, wagerData, rowIndex, wagerPos) {
        if (showOdd === '') {
          return;
        }

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
      moreGameClickHandler(teamData) {
        this.$store.dispatch('MoreGame/openMoreGameList', {
          teamData,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  $row-height: 2.4rem;
  $font-size: 1rem;

  .mGameBetting {
    position: relative;
    overflow-x: auto;
    &::-webkit-scrollbar {
      /*隱藏滾輪*/
      display: none;
    }
    &.closed {
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: #ccc;
      }

      overflow-x: hidden;
      table thead {
        tr th {
          color: transparent !important;
        }
      }
      .arrow {
        display: block;
      }
    }

    table {
      position: relative;
      width: 100%;
      border-spacing: 0;
      font-size: $font-size;
      background-color: #fff;

      tr {
        position: relative;
        %circleBase {
          position: sticky;
          background-color: rgb(183, 183, 183);
          width: 5px;
          height: 5px;
          top: 100%;
          right: 50%;
          border: 1px solid rgb(183, 183, 183);
          border-radius: 50%;
          transform: translateY(-2px);
          &.white {
            background-color: white;
          }
        }
        .circleLeft {
          right: 52%;
          @extend %circleBase;
        }
        .circleRight {
          right: 48%;
          @extend %circleBase;
        }
      }

      th {
        min-width: 6.666rem;
        height: $row-height;
        background-color: #e8e8e8;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: normal;
        color: #444;
        cursor: pointer;
      }

      td {
        min-width: 6.666rem;
        height: $row-height;
      }

      td.wager-container {
        .wager-group {
          .wager-cell {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            height: $row-height;
            border-style: solid;
            border-color: #e8e8e8;
            border-width: 0 1px 1px 0;
            background-color: #fff;
            text-align: center;
            line-height: $row-height;

            &.interactive {
              cursor: pointer;
            }
            &.isSelected {
              background-color: #ffd5d5;
            }

            .cell-left {
              flex: 1;
              text-align: right;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .cell-right {
              flex: 1;
              text-align: left;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-weight: bold;
            }

            .Odd {
              flex: 1;
            }
          }
        }
      }

      .moreGame-holder {
        width: 35px !important;
        min-width: 35px;
        max-width: 1rem !important;
        padding: 0 0.5rem;
        text-align: center;
        border-bottom: 1px solid #e8e8e8;
      }

      td.moreGameBtn {
        position: sticky;
        right: 0;
        top: 0;
        width: 35px !important;
        min-width: 35px;
        background: #fff;
        border: 1px solid #e8e8e8;
        border-width: 0px 0 1px 1px;
        text-align: center;

        span {
          font-size: 1rem;
          line-height: 1;
        }

        img {
          display: block;
          width: 14px;
          height: 14px;
          margin: 5px auto;
          // vertical-align: text-bottom;
        }

        &:active {
          background-color: #ddd;
        }
      }

      tr td:nth-last-child(2) {
        li {
          border-right: none !important;
        }
      }
    }

    .arrow {
      display: none;
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.1rem;
      filter: invert(30%);
    }
  }
</style>

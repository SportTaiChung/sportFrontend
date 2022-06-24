<template>
  <div ref="root" class="mGameBetting" :style="maxHeight" :class="isExpanded ? '' : 'closed'">
    <table :class="hasMoreGameStyle">
      <thead ref="thead" @click="$emit('toggleCollapse')">
        <tr>
          <th v-for="(it, i) in bestHead" :key="i"> {{ it.showName }}</th>
          <th v-if="hasMoreGame" class="moreGame-holder"></th>
        </tr>
      </thead>

      <tbody ref="tbody">
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
              <td
                v-if="hasMoreGame && rowIndex === 0"
                class="moreGame-holder"
                @click="moreGameClickHandler(teamData)"
              >
                {{ teamData.MoreCount }}
                <img
                  style="width: 14px; height: 14px"
                  src="@/assets/img/common/moreGameIcon.svg"
                  alt=""
                />
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
        isMounted: false,
      };
    },
    computed: {
      betCartList() {
        return this.$store.state.BetCart.betCartList;
      },
      maxHeight() {
        if (!this.isMounted) return;
        if (!this.isExpanded) return;
        const { thead, tbody } = this.$refs;
        return {
          height: thead.offsetHeight + tbody.offsetHeight + 'px',
        };
      },
      hasMoreGameStyle() {
        return this.hasMoreGame ? 'hasMoreGame' : '';
      },
    },
    mounted() {
      this.isMounted = true;
      this.$refs.root.addEventListener(
        'transitionend',
        (e) => {
          if (!this.isExpanded && e.propertyName === 'height') {
            this.$refs.tbody.style.display = 'none';
          }
        },
        { once: true }
      );
      if (!this.isExpanded) {
        this.$refs.tbody.style.display = 'none';
      }
    },
    watch: {
      isExpanded(isExpanded) {
        if (isExpanded) {
          this.$refs.tbody.style.display = '';
        }
      },
    },
    methods: {
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
    overflow: hidden;
    width: fit-content;
    min-width: 100%;
    transition: height 300ms ease-out;

    &.closed {
      height: $row-height !important;
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

      tbody {
        transition: 350ms ease;
        opacity: 0;
      }
    }

    table {
      position: relative;
      width: 100%;
      border-spacing: 0;
      font-size: $font-size;

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

            &.interactive {
              cursor: pointer;
              // &:hover {
              //   background-color: #ffe1ae;
              // }
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

        &:active {
          background-color: #ddd;
        }
      }
    }
  }
</style>

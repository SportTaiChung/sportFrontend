<template>
  <el-collapse-item class="GameCollapse" :name="index">
    <template slot="title">
      <div>{{ source.LeagueNameStr }}</div>
    </template>
    <table>
      <tbody>
        <template v-for="(teamData, teamIndex) in source.Team">
          <tr v-for="(teamDataRowNum, rowIndex) in teamData.Row" :key="`${teamIndex}-${rowIndex}`">
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
                <div class="teamRow">{{ teamData.HomeTeamStr }}</div>
                <div class="teamRow">{{ teamData.AwayTeamStr }}</div>
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
            >
              <!-- <div
                class="WagerList"
                v-html="WagerListItemHTML(teamData, wagerData, rowIndex)"
              >
              </div> -->

              <div
                class="WagerList"
                :set="
                  ((sportData = $SportLib.WagerDataToShowData(wagerData, rowIndex)),
                  (isShowDrewOdd = teamData.hasDrewOdds && rowIndex === 0))
                "
              >
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
                    <div class="WagerRow">
                      <div class="WagerCenterItem">
                        <Odd :OddValue="sportData.topPlayOdd" />
                      </div>
                    </div>
                    <div class="WagerRow">
                      <div class="WagerCenterItem">
                        <Odd :OddValue="sportData.bottomPlayOdd" />
                      </div>
                    </div>
                  </template>
                  <!-- 其他正常Layout -->
                  <template v-else>
                    <div class="WagerRow">
                      <div class="WagerItem"> {{ sportData.topPlayMethod }} </div>
                      <div class="WagerItem"> <Odd :OddValue="sportData.topPlayOdd" /> </div>
                    </div>
                    <div class="WagerRow">
                      <div class="WagerItem"> {{ sportData.bottomPlayMethod }} </div>
                      <div class="WagerItem"> <Odd :OddValue="sportData.bottomPlayOdd" /></div>
                    </div>
                  </template>

                  <!-- '和' 玩法顯示 -->
                  <template v-if="isShowDrewOdd">
                    <template
                      v-if="
                        wagerData.Odds[0].DrewOdds === '0' || wagerData.Odds[0].DrewOdds === '0.00'
                      "
                    >
                      <div class="WagerRow"> </div>
                    </template>
                    <template v-else>
                      <div class="WagerRow">
                        <div class="WagerCenterItem">
                          <Odd :OddValue="wagerData.Odds[0].DrewOdds"
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
      </tbody>
    </table>
  </el-collapse-item>
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
        // index of current item
        type: Number,
      },
      source: {
        // here is: {uid: 'unique_1', text: 'abc'}
        type: Object,
        default() {
          return {};
        },
      },
    },
    methods: {},
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
      .el-collapse-item__header {
        background-color: #e8e8e8;
        border-bottom: 1px solid #d0d0d0;
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
      .el-collapse-item__header {
        background-color: #696969;
        border-bottom: 1px solid #4f4f4f;
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
    .el-collapse-item__wrap {
      border: none;
    }
    .el-collapse-item {
      margin: 0;
    }
    .el-collapse-item__arrow {
      font-size: 15px;
      font-weight: bold;
      margin: 0 3px 0 0;
      padding: 0 18px;
      transform: rotate(90deg);
    }
    .el-collapse-item__arrow.is-active {
      transform: rotate(-90deg);
    }
    .el-collapse-item__header {
      @include nav-TopTextcolor();
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      height: 35px;
      line-height: 35px;
      padding: 0;
    }
    .el-collapse-item__content {
      padding: 0;
    }
  }
</style>

<template>
  <el-collapse-item class="GameCollapse" :name="index">
    <template slot="title">
      <div>{{ source.LeagueNameStr }}</div>
    </template>
    <table>
      <tbody>
        <template v-for="(teamData, teamIndex) in source.Team">
          <tr
            v-for="(teamDataRowNum, teamDataRowIndex) in teamData.Row"
            :key="`${teamIndex}-${teamDataRowIndex}`"
          >
            <td class="FirstCatNameBlock">
              <div class="leftTimeBlock">
                <div class="timeRow" v-if="teamDataRowIndex === 0">
                  {{ $lib.timeFormatMMDD(teamData.ScheduleTimeStr) }}
                </div>
                <div class="timeRow" v-if="teamDataRowIndex === 0">
                  {{ $lib.timeFormatHHmm(teamData.ScheduleTimeStr) }}
                </div>
              </div>
              <div class="centerTeamBlock">
                <div class="teamRow">{{ teamData.HomeTeamStr }}</div>
                <div class="teamRow">{{ teamData.AwayTeamStr }}</div>
                <div class="teamRow" v-if="teamData.hasDrewOdds && teamDataRowIndex === 0">
                  和局
                </div>
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
              <div
                class="WagerList"
                v-html="WagerListItemHTML(teamData, wagerData, teamDataRowIndex)"
              >
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

  export default {
    mixins: [mixin],
    name: 'GameCollapse',
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
    methods: {
      WagerListItemHTML(teamData, wagerData, rowIndex) {
        // 是否顯示和
        const isShowDrewOdd = teamData.hasDrewOdds && rowIndex === 0;
        // 如果為空資料
        if (wagerData.isNoData) {
          if (isShowDrewOdd) {
            return `
            <div class="WagerRow">
            </div>
            <div class="WagerRow">
            </div>
            <div class="WagerRow">
            </div>
          `;
          } else {
            return `
            <div class="WagerRow">
            </div>
            <div class="WagerRow">
            </div>
          `;
          }
        } else {
          let topPlayMethod = '';
          let topPlayOdd = '';
          let bottomPlayMethod = '';
          let bottomPlayOdd = '';
          let isSingleOdd = false;
          // TODO 將來要抽成function
          if (wagerData.Odds[rowIndex] === undefined || wagerData.Odds[rowIndex].Status !== 1) {
            // 關閉狀態
          } else if (wagerData.WagerTypeID === 101 || wagerData.WagerTypeID === 103) {
            // 讓分
            topPlayMethod = wagerData.Odds[rowIndex].HomeHdp;
            topPlayOdd = wagerData.Odds[rowIndex].HomeHdpOdds;
            bottomPlayMethod = wagerData.Odds[rowIndex].AwayHdp;
            bottomPlayOdd = wagerData.Odds[rowIndex].AwayHdpOdds;
          } else if (
            wagerData.WagerTypeID === 102 ||
            wagerData.WagerTypeID === 104 ||
            wagerData.WagerTypeID === 109
          ) {
            // 大小
            topPlayMethod = wagerData.Odds[rowIndex].OULine;
            topPlayOdd = wagerData.Odds[rowIndex].OverOdds;
            bottomPlayMethod = '小';
            bottomPlayOdd = wagerData.Odds[rowIndex].UnderOdds;
          } else if (wagerData.WagerTypeID === 110 || wagerData.WagerTypeID === 111) {
            // 獨贏
            topPlayOdd = wagerData.Odds[rowIndex].HomeOdds;
            bottomPlayOdd = wagerData.Odds[rowIndex].AwayOdds;
            isSingleOdd = true;
          } else if (
            wagerData.WagerTypeID === 105 ||
            wagerData.WagerTypeID === 113 ||
            wagerData.WagerTypeID === 126 ||
            wagerData.WagerTypeID === 129
          ) {
            // 單雙
            topPlayMethod = '單';
            topPlayOdd = wagerData.Odds[rowIndex].OverOdds;
            bottomPlayMethod = '雙';
            bottomPlayOdd = wagerData.Odds[rowIndex].UnderOdds;
          }

          let resStr = ``;
          // 只有單一Odd(Ex.獨贏)
          if (isSingleOdd) {
            resStr = `
              <div class="WagerRow">
                <div class="WagerCenterItem"> ${topPlayOdd} </div>
              </div>
              <div class="WagerRow">
                <div class="WagerCenterItem"> ${bottomPlayOdd} </div>
              </div>
            `;
          } else {
            resStr = `
              <div class="WagerRow">
                <div class="WagerItem"> ${topPlayMethod} </div>
                <div class="WagerItem"> ${topPlayOdd} </div>
              </div>
              <div class="WagerRow">
                <div class="WagerItem"> ${bottomPlayMethod} </div>
                <div class="WagerItem"> ${bottomPlayOdd} </div>
              </div>
            `;
          }
          // 和 顯示
          if (isShowDrewOdd) {
            if (wagerData.Odds[0].DrewOdds === '0' || wagerData.Odds[0].DrewOdds === '0.00') {
              resStr += `<div class="WagerRow"> </div>`;
            } else {
              resStr += `
               <div class="WagerRow">
                <div class="WagerCenterItem"> ${wagerData.Odds[0].DrewOdds} </div>
               </div>`;
            }
          }
          return resStr;
        }
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

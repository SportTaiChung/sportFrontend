<template>
  <el-collapse-item title="效率 Efficiency" class="GameCollapse" :name="index">
    <template slot="title">
      <div>{{ source.LeagueNameStr }}</div>
    </template>
    <table>
      <tbody>
        <tr v-for="(teamData, teamIndex) in source.Team" :key="teamIndex">
          <td class="FirstCatNameBlock">
            <div class="leftTimeBlock">
              <div class="timeRow">{{ $lib.timeFormatMMDD(teamData.ScheduleTimeStr) }}</div>
              <div class="timeRow">{{ $lib.timeFormatHHmm(teamData.ScheduleTimeStr) }}</div>
            </div>
            <div class="centerTeamBlock">
              <div class="teamRow">{{ teamData.HomeTeamStr }}</div>
              <div class="teamRow">{{ teamData.AwayTeamStr }}</div>

              <!-- <div class="teamRow" v-if="item_team.isDrewOdds">和局</div> -->
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
            <!-- <div class="borderWhiteBlock"></div> -->
            <!-- {{ it.showName }} -->
            <div>123</div>
          </td>
          <td v-if="selectWagerTypeKey === 1" class="GameTableHeaderMoreTD">
            <div class="borderWhiteBlock"></div>
            更多
            <div></div>
          </td>
        </tr>
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
    data() {
      return {};
    },
  };
</script>

<style lang="scss">
  @import '@/assets/sass/theme/mixin.scss';
  @import './GameTable.scss';
  #app[data-theme='light'] {
    .GameCollapse {
      table {
        background-color: white;
        color: black;
        tbody {
          tr {
            border-bottom: 1px solid #eee;
          }
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
      table {
        background-color: #585858;
        color: white;
        tbody {
          tr {
            border-bottom: 1px solid #666;
          }
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
  .GameCollapse {
    table {
      width: 100%;
      tbody {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        tr {
          width: 100%;
          display: flex;
          padding-top: 8px;
          padding-bottom: 8px;
        }
        .FirstCatNameBlock {
          display: flex;
          min-width: $FirstCatNameBlockMinWidth;
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
            .teamRow {
              width: 100%;
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
          .borderWhiteBlock {
            background-color: rgba(255, 255, 255, 0.25);
            height: 15px;
            width: 1px;
          }
        }
        .GameTableHeaderMoreTD {
          width: 60px;
          min-width: 60px;
          white-space: nowrap;
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

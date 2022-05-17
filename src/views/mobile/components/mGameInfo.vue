<template>
  <table class="mGameInfo">
    <thead>
      <tr>
        <th>{{ source.LeagueNameStr }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(teamData, teamIndex) in source.Team">
        <template v-if="teamData.EvtStatus === 1">
          <tr
            v-for="(teamDataRowNum, rowIndex) in teamData.Row"
            :key="`${teamIndex}-${rowIndex}`"
            :set="(hasTie = teamData.hasDrewOdds && rowIndex === 0)"
          >
            <!-- 賽事 -->
            <td class="round-block" :class="hasTie ? 'height-big' : 'height-normal'">
              <div class="team-block">
                <!-- 判斷主客場對調 -->
                <template v-if="$SportLib.isHomeAwayReverse(source.CatID)">
                  <div>
                    <div class="team">{{ teamData.AwayTeamStr }}</div>
                    <div class="team">{{ teamData.HomeTeamStr }}</div>
                  </div>
                </template>
                <template v-else>
                  <div class="team">{{ teamData.HomeTeamStr }}</div>
                  <div class="team">{{ teamData.AwayTeamStr }}</div>
                </template>

                <!-- 是否顯示和局 -->
                <div class="team" v-if="teamData.hasDrewOdds && rowIndex === 0"> 和局 </div>
              </div>

              <!-- 時間 -->
              <div class="time" v-if="rowIndex === 0">
                {{ $lib.timeFormatMMDD(teamData.ScheduleTimeStr) }}
                {{ $lib.timeFormatHHmm(teamData.ScheduleTimeStr) }}
              </div>

              <!-- 收藏 -->
              <div class="rightFavoriteBlock">
                <div class="star"></div>
              </div>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script>
  import mixin from './GamesTableMixin';
  export default {
    mixins: [mixin],
    name: 'mGameInfo',
    components: {},
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
    },
    methods: {},
    mounted() {},
  };
</script>

<style lang="scss">
  table.mGameInfo {
    table-layout: fixed;
    border-spacing: 0;
    width: 100%;
    font-size: 1.15rem;

    th {
      height: 33px;
      background-color: #e8e8e8;
      text-align: left;
      padding-left: 0.5rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: normal;
      border-right: 1px solid #000;
    }
    td.round-block {
      $row-height: 35px;
      line-height: 25px;
      border-bottom: 1px solid #e8e8e8;
      border-right: 1px solid #e8e8e8;
      padding-left: 8px;
      height: 70px;

      &.height-normal {
        height: $row-height * 2;
      }

      &.height-big {
        height: $row-height * 3;
      }

      .team-block {
        .team {
          color: #000;
          font-size: 1.15rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .time {
        color: #888888;
        font-size: 0.75rem;
        line-height: 1.5;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>

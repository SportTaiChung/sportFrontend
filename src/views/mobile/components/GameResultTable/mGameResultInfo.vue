<template>
  <div class="mGameResultInfo" :class="isExpanded ? '' : 'closed'">
    <table>
      <thead @click="$emit('toggleCollapse')">
        <tr>
          <th>
            <span class="title">{{ source.LeagueName }}</span>
            <img class="arrow" src="@/assets/img/mobile/btn_arrow_w.svg" />
          </th>
        </tr>
      </thead>

      <tbody v-show="isExpanded">
        <template v-for="(teamData, teamIndex) in source.List">
          <tr :key="teamIndex">
            <td class="round-block">
              <div class="team-block">
                <div class="team">{{ teamData.HomeTeam }} </div>
                <div class="team">{{ teamData.AwayTeam }} </div>
                <div class="info-timeStarRow">
                  <!-- 時間 -->
                  <div class="time">
                    {{ parseDate(teamData.ScheduleTimeStr)[0] }}
                    {{ parseDate(teamData.ScheduleTimeStr)[1] }}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'mGameResultInfo',
    components: {},
    props: {
      source: {
        type: Object,
        default() {
          return {};
        },
      },
      isExpanded: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    methods: {
      parseDate(str) {
        const d = new Date(str);
        if (d instanceof Date && !isNaN(d)) {
          const date =
            (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
            '-' +
            (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());

          const time =
            (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
            ':' +
            (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
          return [date, time];
        }
        return ['-', '-'];
      },
    },
  };
</script>

<style lang="scss">
  $row-height: 2.8rem;
  $font-size: 1rem;

  .mGameResultInfo {
    position: relative;
    width: fit-content;
    min-width: 100%;

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
      th::after,
      th .arrow {
        transform: rotate(0deg);
      }
    }

    table {
      position: relative;
      table-layout: fixed;
      border-spacing: 0;
      width: 100%;
      font-size: $font-size;
      background-color: #fff;

      th {
        display: flex;
        align-items: center;
        height: 2.4rem;
        position: relative;
        background-color: #e8e8e8;
        text-align: left;
        padding-left: 0.8rem;
        overflow: hidden;
        font-weight: normal;
        color: #444;
        cursor: pointer;

        .title {
          width: calc(100% - 2.2rem);
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          height: 70%;
          width: 1px;
          background-color: #888;
          display: none; // 因新UI需求先隱藏
        }

        img.arrow {
          width: 1.1rem;
          float: right;
          margin-right: 1rem;
          filter: invert(30%);
          transform: rotate(-90deg);
          transition: 200ms ease;
          display: none; // 因新UI需求先隱藏
        }
      }

      td.round-block {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
        padding-left: 0.8rem;
        height: $row-height * 2;
        background-color: #fff;

        &.height-lv1 {
          height: $row-height * 2;
        }

        &.height-lv2 {
          height: $row-height * 3;
        }

        .team-block {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          flex: auto;
          .team {
            color: #000;
            font-size: $font-size;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .teamPt {
            color: gray;
          }
          .info-timeStarRow {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;

            .time {
              color: #888888;
              font-size: 0.75rem;
              line-height: normal;
            }
            .star {
              width: $font-size * 1.25;
              height: $font-size * 1.25;
              background: url('~@/assets/img/common/icon_star.svg') no-repeat center bottom;
              background-size: 100% auto;
              background-position: center bottom;
              background-repeat: no-repeat;
              margin: auto 15px auto auto;
              display: block;
              cursor: pointer;

              &:active,
              &.active {
                background-position: center top;
              }
            }
          }
        }
      }
    }
  }
</style>

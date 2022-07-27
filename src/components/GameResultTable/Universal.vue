<template>
  <table class="table-summary" :class="isOneRowMode ? 'isOneRowMode' : ''">
    <!-- 沒有主客隊的排版, 例如: 彩球 -->
    <template v-if="isOneRowMode">
      <tr>
        <td>
          <div class="time"> </div>
        </td>
        <!-- 項目 -->
        <td v-for="(title, index) in titles" :key="index">
          <div class="score" v-if="title.Key !== 'Remarks'">
            <div class="cell">{{ teamData[title.Key] }}</div>
          </div>

          <div class="cell" v-else>{{ teamData.Remarks }}</div>
        </td>
      </tr>
    </template>

    <!-- 正常有主客隊的排版 -->
    <template v-else>
      <tr>
        <!-- 時間 -->
        <td>
          <div class="time">
            <div class="cell">{{ parseDate(teamData.ScheduleTimeStr)[0] }}</div>
            <div class="cell">{{ parseDate(teamData.ScheduleTimeStr)[1] }}</div>
          </div>
        </td>
        <!-- 隊伍 -->
        <td>
          <div class="team">
            <div class="cell">{{ teamData.HomeTeam }}</div>
            <div class="cell">{{ teamData.AwayTeam }}</div>
          </div>
        </td>
        <!-- 分數 -->
        <td v-for="(title, index) in titles" :key="index">
          <div class="score" v-if="title.Key !== 'Remarks'">
            <div class="cell">{{ parseScore(title.Key)[0] }}</div>
            <div class="cell">{{ parseScore(title.Key)[1] }}</div>
          </div>

          <div class="cell" v-else>{{ teamData.Remarks }}</div>
        </td>
      </tr>
    </template>
  </table>
</template>

<script>
  export default {
    name: 'Soccer',
    props: {
      titles: {
        type: Array,
        default() {},
      },
      teamData: {
        type: Object,
        default() {
          return {};
        },
      },
      isOneRowMode: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    methods: {
      parseScore(key) {
        const str = this.teamData?.[key];
        if (str && str.indexOf(':') !== -1) {
          return str.split(':');
        }
        return ['', ''];
      },
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
        return ['', ''];
      },
    },
  };
</script>

<style lang="scss" scoped>
  table.table-summary {
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    background-color: #fff;

    &:hover {
      background-color: #f7f7f7;
    }

    td:nth-child(1) {
      width: 55px;
    }
    td:nth-child(2) {
      width: 255px;
    }

    .cell-detail {
      cursor: pointer;
      i {
        transform: scaleY(1);
      }
      &.active {
        background-color: #cce6ff;
        i {
          transform: scaleY(-1);
        }
      }
    }

    td {
      height: 55px;
      text-align: center;
      border-left: 1px solid #f3f3f3;
      border-bottom: 1px solid #eee;
      line-height: 1rem;
      overflow: hidden;
      word-break: break-word;
      .time {
        color: #888;
      }
      .team {
        text-align: left;
        padding-left: 1rem;
      }
      .score {
      }
      .cell {
        padding: 3px 0;

        .light {
          color: #ff8800;
        }
      }
    }

    &.isOneRowMode {
      td:nth-child(1) {
      }
      td:nth-child(2) {
        border-left: 0;
      }
      td:nth-child(3) {
      }
    }
  }

  table.table-details {
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    background-color: #f8f8f8;

    td.item {
      height: 30px;
      padding: 0 1rem;
      border-right: 1px solid #ececec;
      border-bottom: 1px solid #ececec;
      .name {
        float: left;
        color: #000;
      }
      .value {
        float: left;
        color: #ff8800;
        margin-left: 1rem;
      }
    }
  }
</style>

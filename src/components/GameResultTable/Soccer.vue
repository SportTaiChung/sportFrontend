<template>
  <!-- league 賽果 -->
  <div class="league-result" :class="isExpanded ? '' : 'closed'">
    <div class="league-collapse" @click="isExpanded = !isExpanded">
      <i class="el-icon-arrow-down collapse-status" :class="isExpanded ? 'expanded' : ''"></i>
      <p class="league-name"> {{ resultData.LeagueName }} </p>
    </div>

    <!-- 概要 -->
    <table class="table-summary" v-show="isExpanded" @click="isShowDetails = !isShowDetails">
      <tbody>
        <tr>
          <td>
            <div class="time">
              <div class="row">{{ parseDate(resultData.ScheduleTimeStr)[0] }}</div>
              <div class="row">{{ parseDate(resultData.ScheduleTimeStr)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="teams">
              <div class="row"> {{ resultData.HomeTeam }} </div>
              <div class="row">{{ resultData.AwayTeam }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S1)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S1)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S1)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S1)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="cell-detail" :class="isShowDetails ? 'active' : ''">
              <div class="row">完賽</div>
              <div class="row">14 <i class="el-icon-arrow-down"></i> </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 詳細 -->
    <table class="table-details" v-show="isExpanded && isShowDetails">
      <tbody>
        <tr>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
        </tr>
        <tr>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'Soccer',
    props: {
      resultData: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        isExpanded: true,
        isShowDetails: false,
      };
    },
    methods: {
      parseScore(str) {
        if (str.indexOf(':') !== -1) {
          return str.split(':');
        }
        return ['-', '-'];
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
        return ['-', '-'];
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './GameResultTable.scss';
</style>

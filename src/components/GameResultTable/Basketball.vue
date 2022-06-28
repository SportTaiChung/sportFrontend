<template>
  <table class="table-summary">
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
      <td>
        <div class="score">
          <div class="cell">{{ parseScore('S1')[0] }}</div>
          <div class="cell">{{ parseScore('S1')[1] }}</div>
        </div>
      </td>
      <td>
        <div class="score">
          <div class="cell">{{ parseScore('S2')[0] }}</div>
          <div class="cell">{{ parseScore('S2')[1] }}</div>
        </div>
      </td>
      <td>
        <div class="score">
          <div class="cell">{{ parseScore('S3')[0] }}</div>
          <div class="cell">{{ parseScore('S3')[1] }}</div>
        </div>
      </td>
      <td>
        <div class="score">
          <div class="cell">{{ parseScore('S4')[0] }}</div>
          <div class="cell">{{ parseScore('S4')[1] }}</div>
        </div>
      </td>
      <td>
        <div class="score">
          <div class="cell">{{ parseScore('OT')[0] }}</div>
          <div class="cell">{{ parseScore('OT')[1] }}</div>
        </div>
      </td>
      <td>
        <div class="score">
          <div class="cell">{{ parseScore('FH')[0] }}</div>
          <div class="cell">{{ parseScore('FH')[1] }}</div>
        </div>
      </td>
      <td>
        <div class="score">
          <div class="cell">{{ parseScore('SH')[0] }}</div>
          <div class="cell">{{ parseScore('SH')[1] }}</div>
        </div>
      </td>
      <td>
        <div class="score">
          <div class="cell">{{ parseScore('FinalScore')[0] }}</div>
          <div class="cell">{{ parseScore('FinalScore')[1] }}</div>
        </div>
      </td>
      <td></td>
    </tr>
  </table>
</template>

<script>
  import base from './TableMixin.js';
  export default {
    name: 'Basketball',
    mixins: [base],
  };
</script>

<style lang="scss" scoped>
  @import './Table.scss';
</style>

<template>
  <div class="liveBoard">
    <div class="table-wrapper" :style="background(102)">
      <table>
        <thead>
          <tr>
            <td></td>
            <td> 1 </td>
            <td> 2 </td>
            <td> 3 </td>
            <td> 4 </td>
            <td> OT </td>
            <td>總分</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ teamData.HomeTeamStr }}</td>
            <td>{{ keyNameToShow('S1', 0) }}</td>
            <td>{{ keyNameToShow('S2', 0) }}</td>
            <td>{{ keyNameToShow('S3', 0) }}</td>
            <td>{{ keyNameToShow('S4', 0) }}</td>
            <td>{{ keyNameToShow('', 0) }}</td>
            <td>{{ keyNameToShow('', 0) }}</td>
          </tr>
          <tr>
            <td>{{ teamData.AwayTeamStr }}</td>
            <td>{{ keyNameToShow('S1', 1) }}</td>
            <td>{{ keyNameToShow('S2', 1) }}</td>
            <td>{{ keyNameToShow('S3', 1) }}</td>
            <td>{{ keyNameToShow('S4', 1) }}</td>
            <td>{{ keyNameToShow('', 1) }}</td>
            <td>{{ keyNameToShow('', 1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import base from './LiveBoardMixin';
  export default {
    mixins: [base],
    name: 'BasketBall',
  };
</script>

<style lang="scss" scoped>
  @import './style.scss';
  .liveBoard {
    .table-wrapper {
      table {
        thead tr td:nth-child(1) {
          width: 40%;
        }
        tbody tr td:nth-child(7) {
          color: yellow;
        }
      }
    }
  }
</style>

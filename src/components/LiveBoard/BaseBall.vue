<template>
  <div class="liveBoard">
    <div class="table-wrapper" :style="background(101)">
      <table>
        <thead>
          <tr>
            <td>LIVE</td>
            <td> 1 </td>
            <td> 2 </td>
            <td> 3 </td>
            <td> 4 </td>
            <td> 5 </td>
            <td> 6 </td>
            <td> 7 </td>
            <td> 8 </td>
            <td> 9 </td>
            <td> OT </td>
            <td> R </td>
            <td> H </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ teamData.AwayTeamStr }}</td>
            <td>{{ keyNameToShow('S1', 1) }}</td>
            <td>{{ keyNameToShow('S2', 1) }}</td>
            <td>{{ keyNameToShow('S3', 1) }}</td>
            <td>{{ keyNameToShow('S4', 1) }}</td>
            <td>{{ keyNameToShow('S5', 1) }}</td>
            <td>{{ keyNameToShow('S6', 1) }}</td>
            <td>{{ keyNameToShow('S7', 1) }}</td>
            <td>{{ keyNameToShow('S8', 1) }}</td>
            <td>{{ keyNameToShow('S9', 1) }}</td>
            <td>{{ keyNameToShow('OT', 1) }}</td>
            <td>{{ teamData.AwayScore }}</td>
            <td>{{ '-' }}</td>
          </tr>
          <tr>
            <td>{{ teamData.HomeTeamStr }}</td>
            <td>{{ keyNameToShow('S1', 0) }}</td>
            <td>{{ keyNameToShow('S2', 0) }}</td>
            <td>{{ keyNameToShow('S3', 0) }}</td>
            <td>{{ keyNameToShow('S4', 0) }}</td>
            <td>{{ keyNameToShow('S5', 0) }}</td>
            <td>{{ keyNameToShow('S6', 0) }}</td>
            <td>{{ keyNameToShow('S7', 0) }}</td>
            <td>{{ keyNameToShow('S8', 0) }}</td>
            <td>{{ keyNameToShow('S9', 0) }}</td>
            <td>{{ keyNameToShow('OT', 0) }}</td>
            <td>{{ teamData.HomeScore }}</td>
            <td>{{ '-' }}</td>
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
    name: 'BaseBall',
  };
</script>

<style lang="scss" scoped>
  @import './style.scss';
  .liveBoard {
    .table-wrapper {
      table {
        thead tr td:nth-child(1) {
          width: 28%;
        }
        tbody tr td:nth-child(12) {
          color: yellow;
        }
      }
    }
  }
</style>

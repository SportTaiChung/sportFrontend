<template>
  <div class="liveBoard">
    <div class="table-wrapper" :style="background(1)">
      <table>
        <thead>
          <tr>
            <td>{{ gameScoreData[0].TimeAct }}</td>
            <td>
              <img
                class="icon-redCard"
                src="@/assets/img/common/liveBoard/icon_soccer_redCard.svg"
              />
            </td>
            <td>
              <img class="icon-corner" src="@/assets/img/common/liveBoard/icon_soccer_corner.svg" />
            </td>
            <td>總分</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ teamData.HomeTeamStr }}</td>
            <td>{{ gameScoreData[0].HomeRCard }}</td>
            <td>{{ gameScoreData[0].HomeCorner }}</td>
            <td>{{ gameScoreData[0].HomeScore }}</td>
          </tr>
          <tr>
            <td>{{ teamData.AwayTeamStr }}</td>
            <td>{{ gameScoreData[0].AwayRCard }}</td>
            <td>{{ gameScoreData[0].AwayCorner }}</td>
            <td>{{ gameScoreData[0].AwayScore }}</td>
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
    name: 'Soccer',
  };
</script>

<style lang="scss" scoped>
  @import './style.scss';
  .liveBoard {
    .table-wrapper {
      table {
        thead tr td:nth-child(1) {
          width: 60%;
        }
        tbody tr td:nth-child(4) {
          color: yellow;
        }
      }
    }
  }
</style>

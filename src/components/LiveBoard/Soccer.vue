<template>
  <div id="Soccer">
    <div class="table-wrapper" :style="background">
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
    methods: {},
    computed: {
      // 背景圖
      background() {
        const board = this.$SportLib.getBoardImageByCatId(1);
        const url = require('@/assets/img/common/liveBoard/boards/' + board);
        return {
          'background-image': `url(${url})`,
        };
      },
      // 隊伍1 資訊
      team1Info() {
        return {
          name: '隊伍1',
          item1: '0',
          item2: '-',
          item3: '1',
        };
      },
      // 隊伍2 資訊
      team2Info() {
        return {
          name: '隊伍2',
          item1: '0',
          item2: '-',
          item3: '0',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  #Soccer {
    height: 100%;
    background-color: #222;

    .table-wrapper {
      height: 150px;
      max-width: 370px;
      padding: 20px 15px 0 15px;
      margin: auto;
      background-position-x: center;
      background-repeat: no-repeat;
      background-size: 370px auto;

      table {
        table-layout: fixed;
        border-spacing: 0 1px;
        width: 100%;
        font-size: 1rem;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.5);

        thead {
          & > tr > td:nth-child(1) {
            width: 60%;
          }
        }

        tbody {
          & > tr > td:nth-child(4) {
            color: yellow;
          }
        }

        tr {
          background: rgba(0, 0, 0, 0.5);
        }

        td {
          padding: 8px;
          text-align: center;
          &:first-child {
            text-align: left;
          }
        }
      }

      // other
      .icon-redCard,
      .icon-corner {
        width: 17px;
        height: 17px;
      }
      .icon-corner {
        opacity: 0.7;
      }
    }
  }
</style>

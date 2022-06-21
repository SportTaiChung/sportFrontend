<template>
  <div id="BaseBall">
    <div class="table-wrapper" :style="background">
      <table>
        <thead>
          <tr>
            <td>{{ title }} - -</td>
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
            <td>{{ homeTeam }}</td>
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
            <td>{{ keyNameToShow('FH', 0) }}</td>
            <td>{{ '-' }}</td>
          </tr>
          <tr>
            <td>{{ awayTeam }}</td>
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
            <td>{{ keyNameToShow('FH', 1) }}</td>
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
    computed: {
      // 背景圖
      background() {
        const board = this.$SportLib.getBoardImageByCatId(4);
        const url = require('@/assets/img/common/liveBoard/boards/' + board);
        return {
          'background-image': `url(${url})`,
        };
      },
      // board 資訊
      title() {
        return '9';
      },
    },
    methods: {
      keyNameToShow(key, renderType) {
        const scoreData = this.gameScoreData[0];
        if (scoreData) {
          if (scoreData[key] === '') {
            return '';
          } else {
            if (renderType === 0) {
              return scoreData[key].split(':')[0];
            } else {
              return scoreData[key].split(':')[1];
            }
          }
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  #BaseBall {
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
            width: 28%;
          }
        }

        tbody {
          & > tr > td:nth-child(12) {
            color: yellow;
          }
        }

        tr {
          background: rgba(0, 0, 0, 0.5);
        }

        td {
          padding: 8px 3px;
          text-align: center;
          &:first-child {
            text-align: left;
          }
        }
      }
    }
  }
</style>

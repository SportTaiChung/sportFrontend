<template>
  <div id="BasketBall">
    <div class="table-wrapper" :style="background">
      <table>
        <thead>
          <tr>
            <td>{{ title }}</td>
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
            <td>{{ team1Info.name }}</td>
            <td>{{ team1Info.item1 }}</td>
            <td>{{ team1Info.item2 }}</td>
            <td>{{ team1Info.item3 }}</td>
            <td>{{ team1Info.item4 }}</td>
            <td>{{ team1Info.item5 }}</td>
            <td>{{ team1Info.item6 }}</td>
          </tr>
          <tr>
            <td>{{ team2Info.name }}</td>
            <td>{{ team2Info.item1 }}</td>
            <td>{{ team2Info.item2 }}</td>
            <td>{{ team2Info.item3 }}</td>
            <td>{{ team2Info.item4 }}</td>
            <td>{{ team2Info.item5 }}</td>
            <td>{{ team2Info.item6 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BasketBall',
    methods: {},
    computed: {
      // 背景圖
      background() {
        const board = this.$SportLib.getBoardImageByCatId(3);
        const url = require('@/assets/img/common/liveBoard/boards/' + board);
        return {
          'background-image': `url(${url})`,
        };
      },
      // board 資訊
      title() {
        return '02:00';
      },
      // 隊伍1 資訊
      team1Info() {
        return {
          name: '隊伍1',
          item1: '36',
          item2: '15',
          item3: '',
          item4: '',
          item5: '',
          item6: '51',
        };
      },
      // 隊伍2 資訊
      team2Info() {
        return {
          name: '隊伍2',
          item1: '12',
          item2: '17',
          item3: '',
          item4: '',
          item5: '',
          item6: '29',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  #BasketBall {
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
            width: 40%;
          }
        }

        tbody {
          & > tr > td:nth-child(7) {
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
    }
  }
</style>

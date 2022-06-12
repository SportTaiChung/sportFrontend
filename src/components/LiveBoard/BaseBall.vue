<template>
  <div id="BaseBall">
    <div class="table-wrapper" :style="backgroundY">
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
            <td>{{ team1Info.name }}</td>
            <td>{{ team1Info.item1 }}</td>
            <td>{{ team1Info.item2 }}</td>
            <td>{{ team1Info.item3 }}</td>
            <td>{{ team1Info.item4 }}</td>
            <td>{{ team1Info.item5 }}</td>
            <td>{{ team1Info.item6 }}</td>
            <td>{{ team1Info.item7 }}</td>
            <td>{{ team1Info.item8 }}</td>
            <td>{{ team1Info.item9 }}</td>
            <td>{{ team1Info.item10 }}</td>
            <td>{{ team1Info.item11 }}</td>
            <td>{{ team1Info.item12 }}</td>
          </tr>
          <tr>
            <td>{{ team2Info.name }}</td>
            <td>{{ team2Info.item1 }}</td>
            <td>{{ team2Info.item2 }}</td>
            <td>{{ team2Info.item3 }}</td>
            <td>{{ team2Info.item4 }}</td>
            <td>{{ team2Info.item5 }}</td>
            <td>{{ team2Info.item6 }}</td>
            <td>{{ team2Info.item7 }}</td>
            <td>{{ team2Info.item8 }}</td>
            <td>{{ team2Info.item9 }}</td>
            <td>{{ team2Info.item10 }}</td>
            <td>{{ team2Info.item11 }}</td>
            <td>{{ team2Info.item12 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseBall',
    methods: {},
    computed: {
      // 背景圖
      backgroundY() {
        const index = this.$SportLib.getBackgroundIndexByCatId(4);
        const y = (index > 0 ? index * 150 : 0) * -1;
        return {
          'background-position-y': y + 'px',
        };
      },
      // board 資訊
      title() {
        return '9';
      },
      // 隊伍1 資訊
      team1Info() {
        return {
          name: '隊伍1',
          item1: '0',
          item2: '1',
          item3: '0',
          item4: '0',
          item5: '0',
          item6: '1',
          item7: '1',
          item8: '4',
          item9: '0',
          item10: '4',
          item11: '5',
          item12: '2',
        };
      },
      // 隊伍2 資訊
      team2Info() {
        return {
          name: '隊伍2',
          item1: '2',
          item2: '4',
          item3: '0',
          item4: '1',
          item5: '0',
          item6: '2',
          item7: '1',
          item8: '1',
          item9: '0',
          item10: '0',
          item11: '0',
          item12: '0',
        };
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
      background-image: url('~@/assets/img/common/liveBoard/backgrounds.jpg');
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

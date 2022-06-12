<template>
  <div id="Soccer">
    <div class="table-wrapper" :style="backgroundY">
      <table>
        <thead>
          <tr>
            <td>{{ title }}</td>
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
            <td>{{ team1Info.name }}</td>
            <td>{{ team1Info.item1 }}</td>
            <td>{{ team1Info.item2 }}</td>
            <td>{{ team1Info.item3 }}</td>
          </tr>
          <tr>
            <td>{{ team2Info.name }}</td>
            <td>{{ team2Info.item1 }}</td>
            <td>{{ team2Info.item2 }}</td>
            <td>{{ team2Info.item3 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Soccer',
    methods: {},
    computed: {
      // 背景圖
      backgroundY() {
        const index = this.$SportLib.getBackgroundIndexByCatId(1);
        const y = (index > 0 ? index * 150 : 0) * -1;
        return {
          'background-position-y': y + 'px',
        };
      },
      // board 資訊
      title() {
        return "下半場 38'";
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

<template>
  <div id="GameResult">
    <div class="main-title">
      <h3>賽果</h3>
    </div>

    <!-- 功能選單 -->
    <div class="function-bar">
      <div class="date"> 日期 </div>
      <div class="update"> 更新 </div>
      <div class="btn-refresh"> <i class="el-icon-refresh-right"></i></div>
      <div class="league-filter"> 聯盟選擇 </div>
    </div>

    <!-- 賽果主容器 -->
    <div class="main-container">
      <!-- 球種列表 -->
      <div class="gameTypeList">
        <div class="header">球賽列表</div>
        <ul class="list">
          <!-- v-for me -->
          <li :class="selectedCatId === 4 ? 'active' : ''">
            <img class="menu-icon" :src="getMenuIconByCatID(4)" />
            棒球
          </li>
        </ul>
      </div>

      <!-- 賽果呈現區 -->
      <div class="gameResultList">
        <div class="game-result-container">
          <!-- header -->
          <div class="header" @click="isShowTableList = !isShowTableList">
            <table class="table-header">
              <tbody>
                <tr>
                  <td>
                    <i
                      class="el-icon-arrow-down collapse-status"
                      :class="isShowTableList ? 'active' : ''"
                    ></i>
                  </td>
                  <td>賽事</td>
                  <td v-for="(str, i) in titles" :key="i">{{ str }}</td>
                  <td>資訊</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 賽果 TableList -->
          <div class="tableList">
            <template v-if="isShowTableList">
              <BaseBall></BaseBall>
            </template>
          </div>
        </div>
        <!-- <BaseBall v-if="selectedCatId === 4"></BaseBall> -->
      </div>
    </div>
  </div>
</template>

<script>
  // import 各球種模板
  import BaseBall from '@/components/GameResultTable/BaseBall.vue';

  export default {
    name: 'GameResult',
    components: {
      BaseBall,
    },
    data() {
      return {
        selectedCatId: 4,
        titles: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'OT', '全場'],
        isShowTableList: true,
      };
    },
    methods: {
      getMenuIconByCatID(catId) {
        return require('@/assets/img/common/menuIcon/' + this.$SportLib.getMenuIconByCatID(catId));
      },
    },
  };
</script>

<style lang="scss" scoped>
  #GameResult {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    min-width: 980px;

    .main-title {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      height: 70px;
      background-color: #30679e;
      h3 {
        margin: 0;
        color: #fff;
        font-size: 21px;
        line-height: normal;
        margin-left: 2rem;
      }
    }

    .function-bar {
      flex-shrink: 0;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      height: 35px;
      border-top: 1px solid #5082b3;
      background-color: #30679e;
      color: #9cf;

      .date {
        position: relative;
        text-align: center;
        width: 170px;
        color: #fff;
        cursor: pointer;
      }

      .update {
        position: relative;
        text-align: center;
        width: 100px;
        cursor: pointer;
      }

      .date,
      .update {
        &::after {
          content: '';
          position: absolute;
          right: 0;
          width: 1px;
          height: 25px;
          margin: auto 0;
          top: 0;
          bottom: 0;
          background-color: #5082b3;
        }
      }

      .btn-refresh {
        padding: 0 1rem;
        font-size: 18px;
        font-weight: bolder;
        cursor: pointer;
      }

      .league-filter {
        position: relative;
        margin-left: auto;
        width: 115px;
        padding: 0 1rem;
        text-align: center;
        cursor: pointer;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          width: 1px;
          height: 25px;
          margin: auto 0;
          top: 0;
          bottom: 0;
          background-color: #5082b3;
        }
      }

      .date,
      .update,
      .btn-refresh,
      .league-filter {
        &:hover {
          color: #fff;
        }
      }
    }

    .main-container {
      flex-grow: 1;
      display: flex;
      flex-flow: row nowrap;
      overflow: hidden;

      .gameTypeList {
        flex-shrink: 0;
        display: flex;
        flex-flow: column;
        width: 170px;

        .header {
          color: #fff;
          width: 100%;
          height: 35px;
          line-height: 35px;
          background-color: #4984bf;
          border-bottom: 1px solid #9fcfff;
          border-right: 1px solid #83a0bf;
          text-align: center;
        }

        ul.list {
          flex: 1;
          border-right: 1px solid #bbb;
          overflow-x: hidden;
          overflow-y: auto;
          li {
            position: relative;
            height: 35px;
            display: flex;
            align-items: center;
            background-color: #d5d5d5;
            border-bottom: 1px solid #b3b3b3;
            padding-left: 45px;
            cursor: pointer;
            &:hover {
              background-color: #f0f0f0;
            }

            &.active {
              background-color: #f0f0f0;
            }

            img.menu-icon {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: calc(100% - 45px);
              margin: auto;
              width: auto;
              height: 100%;
              max-height: 18px;
            }
          }
        }
      }

      .gameResultList {
        flex-grow: 1;
        display: flex;
        flex-flow: column;
        overflow: hidden;

        .game-result-container {
          display: flex;
          flex-flow: column;
          overflow: hidden;
          .header {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            height: 35px;
            color: #fff;
            background-color: #4984bf;
            border-bottom: 1px solid #9fcfff;

            table.table-header {
              table-layout: fixed;
              border-collapse: separate;
              border-spacing: 0;
              width: 100%;
              cursor: pointer;

              td {
                text-align: center;
              }
              td:nth-child(1) {
                width: 55px;
              }
              td:nth-child(2) {
                width: 255px;
              }

              i.collapse-status {
                color: #ccc;
                font-size: 18px;
                font-weight: bold;

                &.active {
                  transform: scaleY(-1);
                }
              }

              &:hover {
                i.collapse-status {
                  color: #f0f0f0;
                }
              }
            }
          }

          .tableList {
            flex-grow: 1;
            overflow-x: hidden;
            overflow-y: auto;
          }
        }
      }
    }
  }
</style>

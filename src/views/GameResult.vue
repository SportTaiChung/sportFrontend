<template>
  <div id="GameResult" @click="onPageClick">
    <div class="main-title">
      <h3>賽果</h3>
    </div>

    <!-- 功能選單 -->
    <div class="function-bar">
      <div class="date">
        <i class="el-icon-arrow-left" @click="goPreviousDay()"></i>
        <div class="text" ref="btnDatePicker" @click="isShowDatePicker = !isShowDatePicker">
          {{ dateToString(selectedDate) }}
        </div>
        <i class="el-icon-arrow-right" @click="goNextDay()"></i>

        <ul class="date-picker" v-show="isShowDatePicker">
          <li
            v-for="(date, i) in lastDays"
            :key="i"
            :class="selectedDateIndex === i ? 'active' : ''"
            @click="selectedDateIndex = i"
            >{{ dateToString(date) }}</li
          >
        </ul>
      </div>
      <div class="timer">
        <div class="text" ref="btnTimer" @click="isShowTimerList = !isShowTimerList">
          {{ timerType[timerTypeIndex] }}
          <i class="el-icon-arrow-down"></i>
        </div>

        <ul class="updateTypeList" v-show="isShowTimerList">
          <li
            v-for="(type, i) in timerType"
            :key="i"
            :class="timerTypeIndex === i ? 'active' : ''"
            @click="timerTypeIndex = i"
            >{{ timerType[i] }}</li
          >
        </ul>
      </div>
      <div class="countdownSec" v-if="timerTypeIndex > 0"> {{ countdownSec }} </div>
      <div class="btn-refresh" @click="getGameResult()"> <i class="el-icon-refresh-right"></i></div>
      <div class="league-filter"> 聯盟選擇 </div>
    </div>

    <!-- 賽果主容器 -->
    <div class="main-container">
      <!-- 球種列表 -->
      <div class="gameTypeList">
        <div class="header">球賽列表</div>
        <ul class="list">
          <li
            v-for="(cat, i) in CatList"
            :key="i"
            :class="selectedCatId === cat.CatID ? 'active' : ''"
            @click="selectedCatId = cat.CatID"
          >
            <img class="menu-icon" :src="getMenuIconByCatID(cat.CatID)" />
            {{ cat.Name }}
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
          <div class="tableList" v-show="isShowTableList">
            <template v-for="(resultData, index) in resultDataArray">
              <BaseBall
                v-if="selectedCatId === 101"
                :resultData="resultData"
                :key="index"
              ></BaseBall>

              <Soccer v-if="selectedCatId === 1" :resultData="resultData" :key="index"></Soccer>
            </template>
          </div>
        </div>

        <div v-show="resultDataArray.length === 0" class="noResult">
          <img src="@/assets/img/common/btn_GDV_scoreBoard.svg" alt="" />
          暫無賽果
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 各球種 header 欄位
  import headers from '@/components/GameResultTable/headers.js';

  // import 各球種模板
  import BaseBall from '@/components/GameResultTable/BaseBall.vue';
  import Soccer from '@/components/GameResultTable/Soccer.vue';

  const today = new Date();
  const dateRange = 10;

  export default {
    name: 'GameResult',
    components: {
      BaseBall,
      Soccer,
    },
    data() {
      return {
        selectedCatId: null,
        isShowTableList: true,
        resultDataArray: [],
        today: today,
        lastDays: new Array(dateRange).fill(0).map((it, index) => {
          const result = new Date(today);
          result.setDate(result.getDate() - index);
          return result;
        }),
        selectedDateIndex: 0,
        isShowDatePicker: false,
        isShowTimerList: false,
        sysTimer: null,
        timerType: ['不更新', '每 30 秒', '每 60 秒'],
        timerTypeSec: [null, 30, 60],
        timerTypeIndex: 0,
        countdownSec: null,
      };
    },
    computed: {
      CatList() {
        return this.$store.state.Game.CatList;
      },
      selectedDate() {
        return this.lastDays[this.selectedDateIndex];
      },
      selectedDateYYYYMMDD() {
        return this.dateToYYYYMMDD(this.selectedDate);
      },
      totalCountdownSec() {
        return this.timerTypeSec[this.timerTypeIndex];
      },
      titles() {
        return headers[this.selectedCatId];
      },
    },
    created() {
      this.$store.commit('SetLoading', true);
      this.$store
        .dispatch('Game/GetCatList')
        .then(() => {
          if (this.CatList[0]) {
            this.selectedCatId = this.CatList[0].CatID;
          }
        })
        .finally(() => {
          this.$store.commit('SetLoading', false);
        });
    },
    mounted() {
      this.sysTimer = setInterval(() => {
        const totalSec = this.totalCountdownSec;
        if (totalSec > 0) {
          if (this.countdownSec > 0) {
            this.countdownSec--;
            if (this.countdownSec === 0) {
              this.countdownSec = totalSec;
              this.getGameResult();
            }
          }
        }
      }, 1000);
    },
    destroyed() {
      clearInterval(this.sysTimer);
    },
    methods: {
      getMenuIconByCatID(catId) {
        return require('@/assets/img/common/menuIcon/' + this.$SportLib.getMenuIconByCatID(catId));
      },
      getGameResult() {
        this.resultDataArray = [];
        const postData = {
          CatID: this.selectedCatId,
          ScheduleTime: this.selectedDateYYYYMMDD,
        };
        this.countdownSec = null;
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('Game/GetGameResult', postData)
          .then((res) => {
            console.log(res);
            this.resultDataArray = res.data;
          })
          .finally(() => {
            this.countdownSec = this.totalCountdownSec;
            this.$store.commit('SetLoading', false);
          });
      },
      dateToString(date) {
        let mm = date.getMonth() + 1;
        mm = mm < 10 ? '0' + mm : mm;
        let dd = date.getDate();
        dd = dd < 10 ? '0' + dd : dd;
        const day = date.getDay();
        const dayArr = ['日', '一', '二', '三', '四', '五', '六'];
        return `${mm}-${dd} 星期${dayArr[day]}`;
      },
      dateToYYYYMMDD(date) {
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        mm = mm < 10 ? '0' + mm : mm;
        let dd = date.getDate();
        dd = dd < 10 ? '0' + dd : dd;
        return `${yyyy}-${mm}-${dd}`;
      },
      goNextDay() {
        this.selectedDateIndex > 0 && this.selectedDateIndex--;
      },
      goPreviousDay() {
        this.selectedDateIndex < dateRange - 1 && this.selectedDateIndex++;
      },
      onPageClick(e) {
        const btnDatePicker = this.$refs.btnDatePicker;
        const btnTimer = this.$refs.btnTimer;
        if (e.target !== btnDatePicker) {
          this.isShowDatePicker = false;
        }
        if (e.target !== btnTimer) {
          this.isShowTimerList = false;
        }
      },
    },
    watch: {
      selectedCatId() {
        this.getGameResult();
      },
      selectedDateIndex() {
        this.getGameResult();
        this.isShowDatePicker = false;
      },
      timerTypeIndex() {
        this.countdownSec = this.totalCountdownSec;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
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
      @include base-background();
      // background-color: #30679e;
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
      // border-top: 1px solid #5082b3;
      border-top: 1px solid #34866a;

      @include base-background();
      // background-color: #30679e;
      // color: #9cf;。
      color: #eee;

      .date {
        position: relative;
        text-align: center;
        width: 170px;
        display: flex;
        align-items: center;
        padding: 0 0.8rem;

        .el-icon-arrow-left {
          margin-right: auto;
          font-size: 17px;
          font-weight: 500;
          padding-right: 5px;
          cursor: pointer;
          &:hover {
            color: #fff;
          }
        }
        .el-icon-arrow-right {
          margin-left: auto;
          font-size: 17px;
          font-weight: 500;
          padding-left: 5px;
          cursor: pointer;
          &:hover {
            color: #fff;
          }
        }
        .text {
          color: #fff;
          overflow: hidden;
          white-space: nowrap;
          line-height: normal;
          cursor: pointer;
        }
      }

      .timer {
        position: relative;
        text-align: center;
        width: 100px;
        cursor: pointer;
      }

      .countdownSec {
        color: orange;
        padding-left: 1rem;
        padding-right: 0.5rem;
        font-weight: bold;
        line-height: normal;
      }

      .date,
      .timer {
        &::after {
          content: '';
          position: absolute;
          right: 0;
          width: 1px;
          height: 25px;
          margin: auto 0;
          top: 0;
          bottom: 0;
          // background-color: #5082b3;
          background-color: #34866a;
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

      .btn-refresh,
      .league-filter {
        &:hover {
          color: #fff;
        }
      }

      ul.date-picker,
      ul.updateTypeList {
        position: absolute;
        top: calc(100% + 20px);
        left: 50%;
        transform: translateX(-50%);
        background-color: #f0f0f0;
        min-width: 130px;
        z-index: 15;
        box-shadow: rgb(0 0 0 / 30%) 0 0 10px;

        &::before {
          content: '';
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 9px 11px 9px;
          border-color: transparent transparent #f0f0f0 transparent;
          position: absolute;
          left: 0;
          right: 0;
          margin: 0 auto;
          top: -10px;
          z-index: 1;
        }

        li {
          height: 36px;
          line-height: 36px;
          color: #000;
          text-align: center;
          padding: 0 15px;
          background-color: #f0f0f0;
          border-bottom: 1px solid #e0e0e0;

          &.active {
            color: #006ede;
            background-color: #fff;
          }

          &:hover {
            background-color: #fff;
          }
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
          // background-color: #4984bf;
          background-color: #34866a;
          border-bottom: 1px solid #9fcfff;
          border-right: 1px solid #83a0bf;
          text-align: center;
        }

        ul.list {
          flex: 1;
          overflow-x: hidden;
          overflow-y: auto;
          background-color: #d5d5d5;
          border-right: 1px solid #bbb;
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
            // background-color: #4984bf;
            background-color: #34866a;
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
            overflow-y: overlay;
            z-index: 10;
          }
        }

        .noResult {
          width: 100%;
          height: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          font-size: 20px;

          img {
            width: 90px;
            opacity: 0.7;
          }
        }
      }
    }
  }
</style>

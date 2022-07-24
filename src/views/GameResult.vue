<template>
  <div id="GameResult" @click="onPageClick">
    <div class="main-title">
      <h3>{{ $t('GamesHeader.GameResult') }}</h3>
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
            >{{ dateToString(date) }}
          </li>
        </ul>
      </div>
      <div class="timer">
        <div class="text" ref="btnTimer" @click="isShowTimerList = !isShowTimerList">
          {{ timerTypeName }}
          <i class="el-icon-arrow-down"></i>
        </div>

        <ul class="updateTypeList" v-show="isShowTimerList">
          <li
            v-for="(type, i) in timerTypes"
            :key="i"
            :class="timerIndex === i ? 'active' : ''"
            @click="timerIndex = i"
          >
            <template v-if="timerTypes[i] > 0">
              {{ $t('Common.Each') }} {{ timerTypes[i] }} {{ $t('Common.Sec') }}
            </template>
            <template v-else> {{ $t('Common.NotUpdate') }} </template>
          </li>
        </ul>
      </div>
      <div class="countdownSec" v-if="timerIndex > 0"> {{ countdownSec }} </div>
      <div class="btn-refresh" @click="getGameResult()"> <i class="el-icon-refresh-right"></i></div>
      <!-- <div class="league-filter"> {{ $t('GamesSetup.LeagueSelect') }} </div> -->
    </div>

    <!-- 賽果主容器 -->
    <div class="main-container">
      <!-- 球種列表 -->
      <div class="gameTypeList">
        <div class="header">{{ $t('Common.GameList') }}</div>
        <ul class="cat-list">
          <li
            class="cat-item"
            v-for="(cat, i) in CatList"
            :key="i"
            :set="(isActive = selectedCatId === cat.CatID)"
            @click="selectedCatId = cat.CatID"
          >
            <div class="cat-name" :class="isActive ? 'active' : ''">
              <img class="cat-icon" :src="getMenuIconByCatID(cat.CatID)" />
              {{ cat.Name }}
              <i
                :class="`el-icon-arrow-${isActive ? 'down' : 'right'}`"
                v-if="cat.EvtItem.length"
              ></i>
            </div>
            <ul class="cat-child" v-if="cat.EvtItem.length && isActive">
              <li
                v-for="(item, j) in cat.EvtItem"
                :key="j"
                :class="selectedChildItemKey === item.ItemKey ? 'active' : ''"
                @click="
                  selectedChildItemKey = item.ItemKey;
                  getGameResult();
                "
              >
                {{ item.Name }}
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- 賽果呈現區 -->
      <div class="gameResultList">
        <div class="game-result-container">
          <!-- header -->
          <div class="header" @click="toggleAllLeagues()">
            <table class="table-header">
              <tbody>
                <tr>
                  <td>
                    <i
                      class="el-icon-arrow-down arrow"
                      :class="expandedLeagues.length > 0 ? 'active' : ''"
                    ></i>
                  </td>
                  <td v-if="!isOneRowMode">{{ $t('Common.Game2') }}</td>
                  <td v-for="(str, i) in titles" :key="i">{{ str.Value }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 賽果 TableList -->
          <div class="tableList">
            <div
              v-for="(league, i) in leagueList"
              :key="i"
              :set="(isExpanded = expandedLeagues.includes(i))"
            >
              <!-- League Collapse -->
              <div
                class="league-collapse"
                :class="isExpanded ? '' : 'closed'"
                @click="toggleLeague(i)"
              >
                <i class="el-icon-arrow-down arrow" :class="isExpanded ? 'expanded' : ''"></i>
                <p class="league-name"> {{ league.LeagueName }} </p>
              </div>

              <!-- Table Templates -->
              <div v-for="(teamData, j) in league.List" :key="j">
                <Universal
                  :titles="titles"
                  :teamData="teamData"
                  :isOneRowMode="isOneRowMode"
                  v-if="isExpanded"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-show="leagueList.length === 0 && !$store.state.isLoading" class="noResult">
          <img src="@/assets/img/common/btn_GDV_scoreBoard.svg" alt="" />
          {{ $t('Common.NoGameResult') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Universal from '@/components/GameResultTable/Universal.vue';

  const today = new Date();
  const dateRange = 10;

  export default {
    name: 'GameResult',
    components: {
      Universal,
    },
    data() {
      return {
        selectedCatId: null,
        isShowTableList: true,
        rawData: {
          BestHead: [],
          List: [],
        },
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
        timerTypes: [null, 30, 60],
        timerIndex: 0,
        countdownSec: null,
        expandedLeagues: [],
        selectedChildItemKey: null,
      };
    },
    computed: {
      CatList() {
        return this.$store.state.Game.CatList.filter(
          (cat) => cat.CatID !== this.$conf.favoriteCatID
        );
      },
      CatMapData() {
        return this.$store.state.Game.CatMapData;
      },
      selectedCatInfo() {
        return this.CatMapData[this.selectedCatId];
      },
      // 當前球種子項目Array
      childItems() {
        if (this.selectedCatInfo?.EvtItem) {
          return this.selectedCatInfo.EvtItem;
        }
        return [];
      },
      selectedChildItem() {
        return this.childItems.find((it) => it.ItemKey === this.selectedChildItemKey);
      },
      isOneRowMode() {
        return this.childItems.length > 0;
      },
      titles() {
        return this.rawData?.BestHead || [];
      },
      leagueList() {
        if (this.childItems.length > 0 && this.selectedChildItem) {
          const league = {
            CatID: this.selectedCatId,
            LeagueName: this.selectedChildItem.Name,
            List: [this.rawData?.List[0]],
          };
          return [league];
        }
        return this.rawData?.List || [];
      },
      selectedDate() {
        return this.lastDays[this.selectedDateIndex];
      },
      selectedDateYYYYMMDD() {
        return this.dateToYYYYMMDD(this.selectedDate);
      },
      totalCountdownSec() {
        return this.timerTypes[this.timerIndex];
      },
      timerTypeName() {
        const sec = this.totalCountdownSec;
        return sec > 0
          ? `${this.$t('Common.Each')} ${sec} ${this.$t('Common.Sec')}`
          : this.$t('Common.NotUpdate');
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
        const icon = this.CatMapData[catId].icon;
        return require('@/assets/img/common/menuIcon/' + icon);
      },
      getGameResult() {
        this.rawData = null;
        const postData = {
          CatID: this.selectedCatId,
          ScheduleTime: this.selectedDateYYYYMMDD,
        };
        if (this.childItems.length) {
          if (!this.selectedChildItemKey) {
            this.selectedChildItemKey = this.childItems[0].ItemKey;
          }
          postData.ItemKey = this.selectedChildItemKey;
        }
        this.countdownSec = null;
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('Game/GetGameResult', postData)
          .then((res) => {
            console.log(res);
            this.rawData = res.data;
            this.expandedLeagues = new Array(this.rawData.List.length).fill(null).map((_, i) => i);
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
        const dayArr = [
          this.$t('Common.SunDay'),
          this.$t('Common.MonDay'),
          this.$t('Common.TuesDay'),
          this.$t('Common.WednesDay'),
          this.$t('Common.Thursday'),
          this.$t('Common.FriDay'),
          this.$t('Common.SaturDay'),
        ];
        return `${mm}-${dd} ${this.$t('Common.Week')}${dayArr[day]}`;
      },
      dateToYYYYMMDD(date) {
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        mm = mm < 10 ? '0' + mm : mm;
        dd = dd < 10 ? '0' + dd : dd;
        return `${yyyy}-${mm}-${dd}`;
      },
      goNextDay() {
        this.selectedDateIndex > 0 && this.selectedDateIndex--;
      },
      goPreviousDay() {
        this.selectedDateIndex < dateRange - 1 && this.selectedDateIndex++;
      },
      toggleLeague(index) {
        if (this.expandedLeagues.includes(index)) {
          this.expandedLeagues = this.expandedLeagues.filter((it) => it !== index);
        } else {
          this.expandedLeagues.push(index);
        }
      },
      toggleAllLeagues() {
        this.expandedLeagues = this.expandedLeagues.length ? [] : this.leagueList.map((_, i) => i);
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
        this.selectedChildItemKey = null;
        this.getGameResult();
      },
      selectedDateIndex() {
        this.getGameResult();
        this.isShowDatePicker = false;
      },
      timerIndex() {
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
    ::-webkit-scrollbar {
      -webkit-appearance: none;
    }

    ::-webkit-scrollbar:vertical {
      width: 3px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.15);
    }
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
        color: gold;
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

        ul.cat-list {
          flex: 1;
          overflow-x: hidden;
          overflow-y: auto;
          background-color: #d5d5d5;
          border-right: 1px solid #bbb;
          li.cat-item {
            border-bottom: 1px solid #b3b3b3;
            .cat-name {
              position: relative;
              height: 35px;
              display: flex;
              align-items: center;
              background-color: #d5d5d5;
              padding-left: 45px;
              cursor: pointer;
              img.cat-icon {
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
              i {
                color: #555;
                margin-left: auto;
                margin-right: 1rem;
              }
              &:hover,
              &.active {
                background-color: #f0f0f0;
              }
            }
            ul.cat-child {
              margin: 5px;
              border-radius: 2px;
              overflow: hidden;
              li {
                color: #333;
                height: 35px;
                padding: 9px;
                text-align: center;
                background-color: rgba(255, 255, 255, 0.5);
                border-bottom: 1px solid rgba(0, 0, 0, 0.15);
                cursor: pointer;
                &:last-child {
                  border: 0;
                }
                &:hover,
                &.active {
                  background-color: rgba(255, 255, 255, 0.9);
                }
              }
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

              i.arrow {
                color: #ccc;
                font-size: 18px;
                font-weight: bold;

                &.active {
                  transform: scaleY(-1);
                }
              }

              &:hover {
                i.arrow {
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

            .league-collapse {
              display: flex;
              align-items: center;
              height: 35px;
              color: #000;
              cursor: pointer;
              background-color: #e8e8e8;
              position: sticky;
              top: 0;
              left: 0;

              i.arrow {
                color: #aaa;
                font-size: 18px;
                font-weight: bold;
                width: 55px;
                text-align: center;

                &.expanded {
                  transform: scaleY(-1);
                }
              }

              p.league-name {
                color: #000;
                margin-left: 1rem;
              }

              &:hover {
                i.arrow {
                  color: #333;
                }
              }

              &.closed {
                &::after {
                  content: '';
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  height: 1px;
                  background-color: #ccc;
                }
              }
            }
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

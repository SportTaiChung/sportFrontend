<template>
  <div id="mBetRecordHistory">
    <!-- 近2週總覽 -->
    <div v-show="page === 0">
      <table class="historyTable">
        <thead>
          <tr>
            <th class="date"> {{ $t('GameDate') }} </th>
            <th> {{ $t('HistoryRecord.BetAmount') }} </th>
            <th class="result"> {{ $t('Common.Result') }} </th>
          </tr>
        </thead>
      </table>

      <div class="date-group" v-for="(week, index) in weekDataFilter" :key="index">
        <div
          class="date-type-bar"
          :class="index === openFlag ? 'on' : ''"
          @click="openFlag = index === openFlag ? -1 : index"
        >
          {{ index === 0 ? '本週' : index === 1 ? '上週' : '' }}
        </div>
        <table class="historyTable" v-show="index === openFlag">
          <tbody>
            <tr v-for="(item, i) in week" :key="i">
              <!-- 日期 -->
              <td class="date">
                <template v-if="item.week !== 128">
                  {{ item.accdate.substr(5) }}
                  <br />
                  {{ item.weekLang }}
                </template>
                <template v-else>
                  {{ item.weekLang }}
                </template>
              </td>

              <!-- 投注額 -->
              <td> {{ item.amount }} </td>

              <!-- 結果 -->
              <template v-if="item.week !== 128">
                <td class="result" @click="goDateDetails(item.accdate)">
                  <el-link type="primary"> {{ item.ResultAmount }} </el-link>
                </td>
              </template>
              <template v-else>
                <td class="result"> {{ item.ResultAmount }} </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 當日詳細 -->
    <div v-show="page === 1">
      <table class="historyTable">
        <thead>
          <tr>
            <th class="date"> {{ currentDateStr }} </th>
            <th> {{ $t('HistoryRecord.BetAmount') }} </th>
            <th class="result"> {{ $t('Common.Result') }} </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(it, index) in todayDetailsReduce" :key="index">
            <td class="date"> {{ it.catName }} </td>
            <td> {{ it.totalAmount }} </td>
            <td class="result" @click="goFinalDetails(it.data)">
              <el-link type="primary"> {{ it.totalResultAmount }} </el-link>
            </td>
          </tr>
          <tr>
            <td class="date"> {{ $t('Common.Total') }} </td>
            <td> {{ getTotal.totalAmount }} </td>
            <td class="result"> {{ getTotal.totalResultAmount }} </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 詳細注單內容 -->
    <div v-show="page === 2" style="padding: 10px">
      <HistoryCardItem
        v-for="(historyItem, historyIndex) in betHistoryList"
        :key="historyIndex"
        :historyItem="historyItem"
        :isSettlement="true"
      >
      </HistoryCardItem>
    </div>
  </div>
</template>

<script>
  import HistoryCardItem from '@/components/HistoryCardItem';
  export default {
    name: 'mBetRecordHistory',
    components: {
      HistoryCardItem,
    },
    data() {
      return {
        /*
        0: 近2週總覽,
        1: 當日詳細,
        2: 詳細注單內容
        */
        page: 0,
        openFlag: 0, // 0: 本週, 1: 上週
        betHistoryData: [],
        weekData: [],
        todayDetails: [],
        betHistoryList: [],
        currentDateStr: '',
      };
    },
    computed: {
      weekDataFilter() {
        let thisWeek = []; // 本週
        let lastWeek = []; // 上週
        if (this.weekData && this.weekData.length > 0) {
          const thisWeekIndex = this.weekData.findIndex((it) => it.week === 128);
          if (thisWeekIndex !== -1) {
            thisWeek = this.weekData.slice(0, thisWeekIndex + 1);
            lastWeek = this.weekData.slice(thisWeekIndex + 1);
          }
        }
        return [thisWeek, lastWeek];
      },

      getTodayDetails() {
        var map = {};
        var dest = [];
        var destTypemap = [];
        // 分组 过关和单注
        for (var i = 0; i < this.todayDetails.length; i++) {
          var ai = this.todayDetails[i];
          if (ai.BetType === 99) {
            destTypemap.push(ai);
          }
        }
        var BetTypemap = {
          CatID: -99,
          catName: this.$t('Common.Stray'),
          data: destTypemap,
        };
        // 分组  各球类
        for (let i = 0; i < this.todayDetails.length; i++) {
          const ai = this.todayDetails[i];
          if (!map[ai.CatID]) {
            dest.push({
              CatID: ai.CatID,
              catName: ai.catName,
              data: [ai],
            });
            map[ai.CatID] = ai;
          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.CatID === ai.CatID && ai.BetType === 1) {
                dj.data.push(ai);
                break;
              }
            }
          }
        }
        dest.push(BetTypemap);
        dest.forEach((item) => {
          let Amounts = 0;
          let ResultAmounts = 0;
          let canwins = 0;
          item.data.forEach((itemdata) => {
            if (itemdata.BetType === 1) {
              canwins += Math.floor(itemdata.Amount * itemdata.dataBet[0].PayoutOddsStr);

              if (itemdata.dataBet[0].WagerPosName === this.$t('Common.HomeTeam')) {
                itemdata.dataBet[0].betname = itemdata.dataBet[0].HomeTeam;
              } else if (itemdata.dataBet[0].WagerPosName === this.$t('Common.AwayTeam')) {
                itemdata.dataBet[0].betname = itemdata.dataBet[0].AwayTeam;
              } else {
                itemdata.dataBet[0].betname = itemdata.dataBet[0].WagerPosName;
              }
            } else {
              var canwin = 0;
              var odds = [];
              var oddx = 1;
              itemdata.dataBet.forEach((Betlist, y) => {
                odds.push(parseFloat(Betlist.PayoutOddsStr) + 1);
                if (Betlist.WagerPosName === this.$t('Common.HomeTeam')) {
                  Betlist.betname = Betlist.HomeTeam;
                } else if (Betlist.WagerPosName === this.$t('Common.AwayTeam')) {
                  Betlist.betname = Betlist.AwayTeam;
                } else {
                  Betlist.betname = Betlist.WagerPosName;
                }
              });

              odds.forEach((odditem) => {
                oddx *= odditem;
              });
              canwin = oddx * itemdata.Amount - itemdata.Amount;
              itemdata.canwin = Math.floor(canwin);
              canwins += Math.floor(canwin);
            }

            Amounts += itemdata.Amount;
            ResultAmounts = this.$lib.trunc(ResultAmounts + itemdata.ResultAmount);
          });
          item.Amounts = Amounts;
          item.ResultAmounts = ResultAmounts;
          item.canwins = canwins;
          item.active = false;
        });
        return dest;
      },
      todayDetailsReduce() {
        const dataArr = this.getTodayDetails[0].data;
        if (dataArr) {
          const cats = dataArr.reduce((acc, it) => {
            if (!acc[it.catName]) acc[it.catName] = [];
            acc[it.catName].push(it);
            return acc;
          }, {});
          return Object.keys(cats).map((catName) => {
            const data = cats[catName];
            return {
              catName,
              totalAmount: data.reduce((sum, it) => (sum += it.Amount), 0),
              totalResultAmount: data.reduce((sum, it) => (sum += it.ResultAmount), 0),
              data,
            };
          });
        }
        return [];
      },
      getTotal() {
        return this.todayDetailsReduce.reduce(
          (acc, item) => {
            acc.totalAmount += item.totalAmount;
            acc.totalResultAmount += item.totalResultAmount;
            return acc;
          },
          { totalAmount: 0, totalResultAmount: 0 }
        );
      },
    },
    methods: {
      getBetHistory(type = false, starttime, endtime) {
        console.log('getBetHistory');
        this.$store.commit('SetLoading', true);
        let postData = {};
        if (type) {
          postData = {
            starttime,
            endtime,
          };
          this.todayDetails.length = 0;
          this.todayDetails = [];
        }
        this.$store
          .dispatch('History/getBetHistory', {
            isset: type,
            ...postData,
          })
          .then((res) => {
            if (!type) {
              this.betHistoryData = res.data.list;
            } else {
              this.todayDetails = res.data.list;
            }
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
      getBetDayHistory() {
        this.$store
          .dispatch('History/getBetDayHistory', {
            isset: true,
          })
          .then((res) => {
            this.weekData = res.data;
            this.$forceUpdate();
          });
      },
      // 前往 當日詳細
      goDateDetails(time) {
        this.page = 1;
        this.currentDateStr = time.substr(5);
        this.getBetHistory(true, time + ' 00:00:00', time + ' 23:59:59');
      },
      // 前往 詳細注單內容
      goFinalDetails(historyItems) {
        console.log('historyItem:', historyItems);
        this.betHistoryList = historyItems;
        this.page = 2;
      },
      goBackPage() {
        if (this.page > 0) this.page--;
      },
      refresh() {
        this.page = 0;
        this.getBetHistory(false);
      },
    },
    async created() {
      this.getBetHistory(false);
      this.getBetDayHistory();
    },
    watch: {
      page() {
        this.$emit('showGoBackBtn', this.page > 0);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #mBetRecordHistory {
    height: 100%;
    overflow-y: auto;

    .historyTable {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      table-layout: fixed;

      tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }

      thead {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      th {
        position: relative;
        height: 40px;
        font-size: 1.25em;
        font-weight: bold;
        letter-spacing: normal;
        background-color: #e4e4e4;
        border-bottom: 1px solid #c7c7c7;
        &::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 1px;
          height: 52%;
          margin: auto 0;
          background-color: #c7c7c7;
          display: block;
        }
      }

      td {
        height: 40px;
        font-size: 1.15rem;
        letter-spacing: normal;
        background-color: #fff;
        text-align: right;
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        padding: 0 2%;
        line-height: 1.15em;
      }

      th.date,
      td.date {
        text-align: center;
        line-height: 1.3;
      }
      td.date {
        color: #666;
      }

      th.result,
      td.result {
        width: 40%;
      }
    }

    .date-type-bar {
      height: 40px;
      line-height: 40px;
      font-size: 1.25rem;
      background-color: #e4e4e4;
      position: relative;
      box-sizing: border-box;
      border-bottom: 1px solid #c7c7c7;
      text-align: center;
      padding-right: 70%;
      cursor: pointer;

      &.on {
        &::after {
          transform: scaleY(-1);
        }
      }

      &:active {
        &::after {
          filter: invert(100%);
        }
      }

      &::after {
        content: '';
        position: absolute;
        width: 15%;
        height: 17px;
        background: url('~@/assets/img/mobile/btn_arrow_w.svg') no-repeat center;
        background-size: auto 17px;
        opacity: 1;
        filter: invert(50%);
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto 0;
      }
    }
  }
</style>

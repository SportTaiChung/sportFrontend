<template>
  <div id="HistoryRecord">
    <div class="Record_head">
      <h3>{{ $t('HistoryRecord.BetHistoryRecord') }}</h3>
    </div>
    <div class="Record_top">
      <ul>
        <li @click="active = 0" :class="active === 0 ? 'active' : ''">
          {{ $t('GamesBetInfo.NotCountBet') }}
        </li>
        <li @click="active = 1" :class="active !== 0 ? 'active' : ''">
          {{ $t('HistoryRecord.IsCountBet') }}
        </li>
      </ul>
      <div>
        <el-button v-show="active === 2" size="mini" @click="active = 1" icon="el-icon-arrow-left">
          {{ $t('Common.Return') }}
        </el-button>
        <el-button type="primary" size="mini" @click="update">{{ $t('Common.Update') }}</el-button>
      </div>
    </div>
    <div class="Record_main">
      <div class="Record_mainContainer">
        <!-- 未結算注單 -->
        <table v-show="active === 0" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <th width="200">{{ $t('HistoryRecord.BetMessage') }}</th>
            <th>{{ $t('Common.BetContent') }}</th>
            <th width="150">{{ $t('HistoryRecord.BetAmount') }}</th>
            <th width="150">{{ $t('HistoryRecord.BetRemainAmount') }}</th>
            <th width="150">{{ $t('Common.CanWin') }}</th>
          </tr>
          <tr class="rt_data" v-for="(item, i) in getBetHistoryData" :key="i">
            <td class="rt_info">
              <ul>
                <li>
                  <span>{{ $t('Common.DownBet') }} : </span>
                  <span>{{ item.BetTimeStr }}</span>
                </li>
                <li v-if="item.BetType === 1">
                  <span>{{ $t('Common.Game') }} : </span>
                  <span>{{ item.dataBet[0].ScheduleTimeStr }}</span>
                </li>
                <li v-else>
                  <span>{{ $t('HistoryRecord.TypeStray') }} </span>
                  <span> {{ item.dataBet.length }}{{ $t('Common.string') }} 1 x 1 </span>
                </li>
                <li>
                  <span>{{ $t('Common.BetID') }} : </span>
                  <span>{{ item.TicketID }}</span>
                </li>
                <li>
                  <span>{{ $t('Common.Odd') }} :</span>
                  <span>{{ $t('GamesSetup.NotIncludePrincipal') }}</span>
                </li>
              </ul>
            </td>
            <td v-if="item.BetType === 1">
              <ul>
                <li>
                  {{ item.catName }} - {{ item.dataBet[0].LeagueName }} -
                  {{ item.dataBet[0].WagerGrpName }}
                </li>
                <li>
                  {{ item.dataBet[0].HomeTeam }}
                  <span class="HomeTeamSign">({{ $t('Common.Home') }})</span> VS
                  {{ item.dataBet[0].AwayTeam }}
                </li>
                <li>
                  {{ $t('Common.Bet') }} :
                  <span class="betTeamColor">
                    {{ item.dataBet[0].betname }}
                    <span class="oddColor">
                      {{ item.dataBet[0].CutLine }}
                    </span>
                  </span>
                  @
                  <span class="oddColor">{{ item.dataBet[0].PayoutOddsStr }}</span>
                </li>
              </ul>
            </td>
            <td class="rt_fs" v-if="item.BetType === 99">
              <div class="rt_fs_list" v-for="(betlist, y) in item.dataBet" :key="y">
                <div>{{ y + 1 }}</div>
                <ul>
                  <li>
                    {{ item.catName }} - {{ betlist.LeagueName }} -
                    {{ betlist.WagerGrpName }}
                  </li>
                  <li
                    >{{ betlist.HomeTeam }}
                    <span class="HomeTeamSign">({{ $t('Common.Home') }})</span> VS
                    {{ betlist.AwayTeam }}</li
                  >
                  <li>
                    {{ $t('Common.Bet') }}：
                    <span class="betTeamColor">
                      {{ betlist.betname }}
                      <span class="oddColor">{{ betlist.CutLine }}</span>
                    </span>
                    @
                    <span class="oddColor">{{ betlist.PayoutOddsStr }}</span>
                  </li>
                  <li>
                    {{ $t('GamesHeader.GameResult') }}:
                    <span class="resultScore">{{ betlist.HomeScore }} : </span>
                    <span class="resultScore">{{ betlist.AwayScore }}</span>
                  </li>
                  <li>
                    {{ $t('Common.GameTime') }}:
                    <span class="startGameTime">{{ betlist.ScheduleTimeStr }} </span>
                  </li>
                </ul>
              </div>
            </td>
            <td class="rt_betval">{{ item.Amount }}</td>
            <td class="rt_betval">{{ item.AfterAmount }}</td>
            <td class="rt_betval">
              {{ item.ToWin }}
            </td>
          </tr>
          <tr class="rt_foot">
            <td colspan="2">{{ $t('Common.Total') }}</td>
            <td class="betSumTotal">{{ totalAmount }}</td>
            <td></td>
            <td>{{ totalWinAmount }}</td>
          </tr>
        </table>

        <!-- 已結算注單 -->
        <table v-show="active === 1" border="0" cellspacing="0" cellpadding="0" class="weektable">
          <tr>
            <th>{{ $t('GameDate') }}</th>
            <th>{{ $t('HistoryRecord.BetAmount') }}</th>
            <th>{{ $t('Common.ReturnWater') }}</th>
            <th>{{ $t('Common.Result') }}</th>
          </tr>
          <tr
            v-for="(item, i) in weekData"
            :class="item.weekLang.indexOf($t('Common.Total')) > 0 ? 'week' : ''"
            :key="i"
          >
            <td>{{ item.accdate.substr(5) }} {{ item.weekLang }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.RetAmt }}</td>
            <td v-if="item.weekLang.indexOf($t('Common.Total')) > 0">{{ item.ResultAmount }}</td>
            <td v-else>
              <el-link type="primary" @click="goThisWeek(item.accdate)">{{
                item.ResultAmount
              }}</el-link>
            </td>
          </tr>
        </table>

        <!-- 已結算注單詳細 -->
        <div v-show="active === 2">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <th width="185">{{ $t('HistoryRecord.BetMessage') }}</th>
              <th width="400">{{ $t('Common.BetContent') }}</th>
              <th width="100">{{ $t('HistoryRecord.BetAmount') }}</th>
              <th width="130">{{ $t('HistoryRecord.BetRemainAmount') }}</th>
              <th width="100">{{ $t('Common.CanWin') }}</th>
              <th width="100">{{ $t('Common.ReturnWater') }}</th>
              <th width="100">{{ $t('Common.Result') }}</th>
            </tr>
          </table>

          <div v-for="(item, i) in gettodayDetails" :key="i">
            <table border="0" cellspacing="0" cellpadding="0" class="collapsetable">
              <tr>
                <td width="585" @click="upactive(item.CatID)">
                  <i :class="item.active ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
                  <template v-if="i === 0"> {{ $t('Common.NormalBet') }} </template>
                  <template v-if="i === 1"> {{ $t('GamesBetInfo.StrayBet') }} </template>
                </td>
                <td width="100">{{ item.Amounts }}</td>
                <td width="130">{{ item.AfterAmounts }}</td>
                <td width="100">{{ item.canwins }}</td>
                <td width="100">{{ item.RetAmts }}</td>
                <td width="100">{{ item.ResultAmounts }}</td>
              </tr>
            </table>

            <table
              border="0"
              cellspacing="0"
              cellpadding="0"
              v-show="item.active"
              v-for="(itemdata, y) in item.data"
              :key="y"
            >
              <tr class="rt_data">
                <td width="185" class="rt_info">
                  <ul>
                    <li>
                      <span>{{ $t('Common.DownBet') }} : </span>
                      <span>{{ itemdata.BetTimeStr.slice(5, 16) }}</span>
                    </li>
                    <li v-if="itemdata.BetType === 1">
                      <span>{{ $t('Common.Game') }} : </span>
                      <span>{{ itemdata.dataBet[0].ScheduleTimeStr.slice(5, 16) }}</span>
                    </li>
                    <li v-else>
                      <span>{{ $t('HistoryRecord.TypeStray') }} </span>
                      <span> {{ itemdata.dataBet.length }}{{ $t('Common.string') }} 1 x 1 </span>
                    </li>
                    <li>
                      <span>{{ $t('Common.BetID') }} : </span>
                      <span>{{ itemdata.TicketID }}</span>
                    </li>
                    <li>
                      <span>{{ $t('Common.Odd') }} :</span>
                      <span>{{ $t('GamesSetup.NotIncludePrincipal') }}</span>
                    </li>
                  </ul>
                </td>
                <!-- 過關 -->
                <td width="400" class="rt_fs" v-if="itemdata.BetType === 99">
                  <div class="rt_fs_list" v-for="(betlist, y) in itemdata.dataBet" :key="y">
                    <div>{{ y + 1 }}</div>
                    <ul>
                      <li>
                        {{ itemdata.catName }} - {{ betlist.LeagueName }} -
                        {{ betlist.WagerGrpName }}
                      </li>
                      <li>
                        {{ betlist.HomeTeam }}
                        <span class="HomeTeamSign">({{ $t('Common.Home') }})</span> VS
                        {{ betlist.AwayTeam }}
                      </li>
                      <li>
                        {{ $t('Common.Bet') }}：
                        <span class="betTeamColor">
                          {{ betlist.betname }}
                          <span class="oddColor">{{ betlist.CutLine }} </span>
                        </span>
                        @
                        <span class="oddColor"> {{ betlist.PayoutOddsStr }}</span>
                      </li>
                      <li>
                        {{ $t('GamesHeader.GameResult') }}:
                        <span class="resultScore">{{ betlist.HomeScore }} : </span>
                        <span class="resultScore">{{ betlist.AwayScore }}</span>
                      </li>
                      <li>
                        {{ $t('Common.GameTime') }}:
                        <span class="startGameTime">{{ betlist.ScheduleTimeStr }} : </span>
                      </li>
                    </ul>
                  </div>
                </td>
                <!-- 一般投注 -->
                <td width="400" v-else>
                  <ul>
                    <li>
                      {{ itemdata.catName }} - {{ itemdata.dataBet[0].LeagueName }} -
                      {{ itemdata.dataBet[0].WagerGrpName }}
                    </li>
                    <li>
                      {{ itemdata.dataBet[0].HomeTeam }} <span class="HomeTeamSign">(主)</span> VS
                      {{ itemdata.dataBet[0].AwayTeam }}
                    </li>
                    <li>
                      {{ $t('Common.Bet') }} :
                      <span class="betTeamColor">
                        {{ itemdata.dataBet[0].betname }}
                        <span class="oddColor">
                          {{ itemdata.dataBet[0].CutLine }}
                        </span>
                      </span>
                      @
                      <span class="oddColor">{{ itemdata.dataBet[0].PayoutOddsStr }}</span>
                    </li>
                  </ul>
                </td>
                <td width="100" class="rt_betval">{{ itemdata.Amount }}</td>
                <td width="130" class="rt_betval">{{ itemdata.AfterAmount }}</td>
                <td width="100" class="rt_betval" v-if="itemdata.BetType === 1">
                  {{ Math.floor(itemdata.Amount * itemdata.dataBet[0].PayoutOddsStr) }}
                </td>
                <td width="100" class="rt_betval" v-else>
                  {{ itemdata.canwin }}
                </td>
                <td width="100" class="rt_betval">{{ itemdata.RetAmt }}</td>
                <td width="100" class="rt_betval">{{ itemdata.ResultAmount }}</td>
              </tr>
            </table>
          </div>
          <table border="0" cellspacing="0" cellpadding="0">
            <tr class="rt_foot">
              <td width="585">{{ $t('Common.Total') }}</td>
              <td width="100" class="betSumTotal">{{ gettotal.Amounts }}</td>
              <td width="130">{{ gettotal.AfterAmounts }}</td>
              <td width="100">{{ gettotal.canwins }}</td>
              <td width="100">{{ gettotal.RetAmts }}</td>
              <td width="100">{{ gettotal.ResultAmounts }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        active: 0,
        betHistoryData: [],
        weekData: [],
        todayDetails: [],
      };
    },
    filters: {},

    computed: {
      totalAmount() {
        let total = 0;
        this.betHistoryData.forEach((item) => {
          total += item.Amount;
        });
        return total;
      },
      totalWinAmount() {
        let total = 0;
        this.betHistoryData.forEach((item) => {
          total += item.ToWin;
        });
        return total;
      },
      getBetHistoryData() {
        this.betHistoryData.forEach((item, i) => {
          if (item.BetType === 1) {
            if (item.dataBet[0].WagerPosName === this.$t('Common.HomeTeam')) {
              this.betHistoryData[i].dataBet[0].betname = item.dataBet[0].HomeTeam;
            } else if (item.dataBet[0].WagerPosName === this.$t('Common.AwayTeam')) {
              this.betHistoryData[i].dataBet[0].betname = item.dataBet[0].AwayTeam;
            } else {
              this.betHistoryData[i].dataBet[0].betname = item.dataBet[0].WagerPosName;
            }
          } else {
            item.dataBet.forEach((betList, y) => {
              if (betList.WagerPosName === this.$t('Common.HomeTeam')) {
                this.betHistoryData[i].dataBet[y].betname = betList.HomeTeam;
              } else if (betList.WagerPosName === this.$t('Common.AwayTeam')) {
                this.betHistoryData[i].dataBet[y].betname = betList.AwayTeam;
              } else {
                this.betHistoryData[i].dataBet[y].betname = item.dataBet[y].WagerPosName;
              }
            });
          }
        });
        return this.betHistoryData;
      },
      gettodayDetails() {
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
          let AfterAmounts = 0;
          let RetAmts = 0;
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
            AfterAmounts += itemdata.AfterAmount;
            RetAmts += itemdata.RetAmt;
            ResultAmounts += itemdata.ResultAmount;
          });
          item.Amounts = Amounts;
          item.AfterAmounts = AfterAmounts;
          item.RetAmts = RetAmts;
          item.ResultAmounts = ResultAmounts;
          item.canwins = canwins;
          item.active = false;
        });
        return dest;
      },
      gettotal() {
        const total = { Amounts: 0, AfterAmounts: 0, RetAmts: 0, ResultAmounts: 0, canwins: 0 };

        this.gettodayDetails.forEach((item) => {
          total.Amounts += item.Amounts;
          total.AfterAmounts += item.AfterAmounts;
          total.RetAmts += item.RetAmts;
          total.ResultAmounts += item.ResultAmounts;
          total.canwins += item.canwins;
        });
        return total;
      },
    },
    methods: {
      update() {
        if (this.active === 0) {
          this.getBetHistory(false);
        } else if (this.active === 1) {
          this.getBetHistory(false);
        }
      },
      upactive(id) {
        this.gettodayDetails.forEach((item) => {
          if (item.CatID === id) {
            item.active = !item.active;
          }
        });
        this.$forceUpdate();
      },
      goThisWeek(time) {
        this.active = 2;
        this.getBetHistory(true, time + ' 00:00:00', time + ' 23:59:59');
      },
      getBetHistory(type = false, starttime, endtime) {
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
      getBetDayHistory(type) {
        this.$store
          .dispatch('History/getBetDayHistory', {
            isset: true,
          })
          .then((res) => {
            this.weekData = res.data;
            this.$forceUpdate();
          });
      },
    },
    async created() {
      this.getBetHistory(false);
      this.getBetDayHistory();
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/sass/theme/mixin.scss';
  @import '../../assets/sass/global.scss';
  #HistoryRecord {
    height: 100%;
    .betTeamColor {
      color: #0077ff;
    }
    .oddColor {
      color: #f00;
    }
    .betSumTotal {
      color: #ffe900 !important;
    }
    .resultScore {
      color: #0a9c00;
    }
    .startGameTime {
      color: #666;
    }
    .HomeTeamSign {
      color: #ff8800;
    }
    .Record_head {
      width: 100%;
      height: 70px;
      // position: fixed;
      top: 0;
      background-color: #3fa381;
      h3 {
        color: #81f0ca;
        font-size: 21px;
        display: inline-block;
        margin-left: 20px;
      }
    }
    .Record_top {
      background-color: #404040;
      color: #bbb;
      width: 100%;
      // position: fixed;
      top: 70px;
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;
      font-size: 13px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      ul {
        display: flex;
        li {
          margin-right: 20px;
          cursor: pointer;
        }
        li.active {
          color: #ffe900;
        }
      }
    }
    .Record_main {
      height: calc(100% - 70px - 40px);
      overflow: auto;
      .Record_mainContainer {
        height: fit-content;
        .rt_info {
          color: #666;
        }
        table {
          width: 100%;
          font-size: 13px;
          border: none;
          background-color: #e5e5e5;
          th {
            background: #d8d8d8;
            font-size: 14px;
            //border-bottom: 1px solid #bbb;
            height: 48px;
          }
          td {
            border-bottom: 1px solid #bbb;
            border-right: 1px solid #bbb;
            padding: 10px;
            ul {
              li {
                line-height: 20px;
              }
            }
          }

          td.rt_fs {
            padding: 0;
            .rt_fs_list {
              display: flex;
              align-items: center;
              min-height: 100px;
              border-bottom: 1px solid #bbb;
              > div {
                min-height: 100px;
                width: 50px;
                text-align: center;
                line-height: 100px;
                border-right: 1px solid #bbb;
              }
              > ul {
                padding: 0 20px;
              }
            }
            .rt_fs_list:last-child {
              border: none;
            }
          }
          td.rt_betval {
            text-align: right;
            font-weight: bold;
            font-size: 17px;
          }
          .rt_foot {
            text-align: right;
            // position: fixed;
            bottom: 0;
            width: 100%;
            td {
              background-color: #404040;
              color: #ffffff;
              font-size: 14px;
              flex: 1;
            }
          }
        }
      }
    }
    .weektable {
      tr {
        td {
          text-align: right;
        }
        td:first-child {
          text-align: left;
          padding: 0 20px;
        }
      }
      .week {
        td {
          background: #404040;
          color: #ffffff;
          font-size: 14px;
          font-weight: bold;
        }
        td:nth-child(2) {
          color: #ffe900;
        }
        td:nth-child(3) {
          color: #20b616;
        }
        td:nth-child(4) {
          color: #20b616;
        }
      }
    }
    .collapsetable {
      tr {
        td {
          background: #ccc;
          text-align: right;
          font-weight: bold;
          font-size: 17px;
        }
        td:first-child {
          cursor: pointer;
          text-align: left;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
</style>

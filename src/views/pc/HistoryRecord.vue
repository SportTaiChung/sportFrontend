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
    <div class="Record_main" ref="Record_main">
      <div class="Record_mainContainer">
        <!-- 未結算注單 -->
        <template v-if="active === 0">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <th width="200">{{ $t('HistoryRecord.BetMessage') }}</th>
              <th>{{ $t('Common.BetContent') }}</th>
              <th width="150">{{ $t('HistoryRecord.BetAmount') }}</th>
              <th width="150">{{ $t('Common.CanWin') }}</th>
            </tr>
            <tr v-if="getBetHistoryData.length === 0">
              <td class="NoDataTD" colspan="5">
                <div class="NoData">尚無資料</div>
              </td>
            </tr>
            <tr class="rt_data" v-for="(item, i) in getBetHistoryDataWithPageData" :key="i">
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
                      {{ $t('Common.GameTime') }}:
                      <span class="startGameTime">{{ betlist.ScheduleTimeStr }} </span>
                    </li>
                  </ul>
                </div>
              </td>
              <td class="rt_betval">{{ item.Amount }}</td>
              <td class="rt_betval">
                {{ item.ToWin }}
              </td>
            </tr>
            <tr class="rt_foot">
              <td colspan="2">{{ $t('Common.Total') }}</td>
              <td class="betSumTotal">{{ totalAmount }}</td>
              <td>{{ totalWinAmount }}</td>
            </tr>
          </table>

          <div class="footerPageBlock">
            <el-pagination
              class
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageData.currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pageData.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="getBetHistoryData.length"
            >
            </el-pagination>
          </div>
        </template>

        <!-- 已結算注單 -->
        <table v-show="active === 1" border="0" cellspacing="0" cellpadding="0" class="weektable">
          <tr>
            <th>{{ $t('GameDate') }}</th>
            <th>{{ $t('HistoryRecord.BetAmount') }}</th>
            <th>{{ $t('Common.Result') }}</th>
          </tr>
          <tr
            v-for="(item, i) in weekData"
            :class="item.weekLang.indexOf($t('Common.Total')) > 0 ? 'week' : ''"
            :key="i"
          >
            <td>{{ item.accdate.substr(5) }} {{ item.weekLang }}</td>
            <td>{{ item.amount }}</td>
            <td
              v-if="item.weekLang.indexOf($t('Common.Total')) > 0"
              :class="sumClassColorJudge(item.ResultAmount)"
              >{{ item.ResultAmount }}
            </td>
            <td v-else>
              <el-link
                type="primary"
                @click="goThisWeek(item.accdate)"
                :class="sumBlueClassColorJudge(item.ResultAmount)"
                style="text-decoration: underline"
              >
                {{ item.ResultAmount }}
              </el-link>
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
              <th width="100">{{ $t('Common.CanWin') }}</th>
              <th width="100">{{ $t('Common.Result') }}</th>
            </tr>
          </table>

          <div v-for="(item, i) in gettodayDetails" :key="i">
            <table border="0" cellspacing="0" cellpadding="0" class="collapsetable">
              <tr>
                <td width="585" @click="upactive(item.catName)">
                  <i :class="item.active ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
                  {{ item.catName }}
                </td>
                <td width="100">{{ item.Amounts }}</td>
                <td width="100">{{ item.canwins }}</td>
                <td
                  width="100"
                  :class="parseInt(item.ResultAmounts) < 0 ? 'ScoreColor' : 'resultScore'"
                >
                  {{ item.ResultAmounts }}
                </td>
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
                      <template v-if="$conf.settlementSpecial.indexOf(itemdata.CatID) === -1">
                        <li>
                          {{ itemdata.catName }} - {{ betlist.LeagueName }} -
                          {{ betlist.WagerGrpName }}
                        </li>
                        <li>
                          <span class="ScoreColor">[{{ betlist.HomeScore }}] </span>
                          {{ betlist.HomeTeam }}
                          <span class="HomeTeamSign">({{ $t('Common.Home') }})</span> VS
                          <span class="ScoreColor">[{{ betlist.AwayScore }}] </span>
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
                      </template>

                      <template v-else>
                        <li>
                          {{ itemdata.catName }} - {{ betlist.LeagueName }} -
                          {{ betlist.WagerGrpName }}
                        </li>
                        <li>
                          {{ betlist.HomeTeam }} <span class="HomeTeamSign">(主)</span> VS

                          {{ betlist.AwayTeam }}
                        </li>
                        <li>
                          {{ $t('Common.Bet') }} :
                          <span class="betTeamColor">
                            {{ betlist.betname }}
                          </span>
                          @
                          <span class="oddColor">{{ betlist.PayoutOddsStr }}</span>
                        </li>
                        <li>
                          {{ $t('GamesHeader.GameResult') }} :
                          <span class="oddColor">
                            {{ betlist.HomeScore }}
                          </span>
                        </li>
                      </template>
                    </ul>
                  </div>
                </td>
                <!-- 一般投注 -->
                <td width="400" v-else>
                  <ul>
                    <template v-if="$conf.settlementSpecial.indexOf(itemdata.CatID) === -1">
                      <li>
                        {{ itemdata.catName }} - {{ itemdata.dataBet[0].LeagueName }} -
                        {{ itemdata.dataBet[0].WagerGrpName }}
                      </li>
                      <li>
                        <span class="ScoreColor">[{{ itemdata.dataBet[0].HomeScore }}] </span>
                        {{ itemdata.dataBet[0].HomeTeam }} <span class="HomeTeamSign">(主)</span> VS
                        <span class="ScoreColor">[{{ itemdata.dataBet[0].AwayScore }}]</span>
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
                    </template>
                    <template v-else>
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
                        </span>
                        @
                        <span class="oddColor">{{ itemdata.dataBet[0].PayoutOddsStr }}</span>
                      </li>
                      <li>
                        {{ $t('GamesHeader.GameResult') }} :
                        <span class="oddColor">
                          {{ itemdata.dataBet[0].HomeScore }}
                        </span>
                      </li>
                    </template>
                  </ul>
                </td>
                <td width="100" class="rt_betval">{{ itemdata.Amount }}</td>
                <td width="100" class="rt_betval" v-if="itemdata.BetType === 1">
                  {{ Math.floor(itemdata.Amount * itemdata.dataBet[0].PayoutOddsStr) }}
                </td>
                <td width="100" class="rt_betval" v-else>
                  {{ itemdata.canwin }}
                </td>
                <td
                  width="100"
                  class="rt_betval"
                  :class="parseInt(itemdata.ResultAmount) < 0 ? 'ScoreColor' : 'resultScore'"
                  >{{ itemdata.ResultAmount }}</td
                >
              </tr>
            </table>
          </div>
          <table border="0" cellspacing="0" cellpadding="0">
            <tr class="rt_foot">
              <td width="585">{{ $t('Common.Total') }}</td>
              <td width="100" class="betSumTotal">{{ gettotal.Amounts }}</td>
              <td width="100">{{ gettotal.canwins }}</td>
              <td width="100" :class="this.sumClassColorJudge(gettotal.ResultAmounts)">
                {{ gettotal.ResultAmounts }}
              </td>
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
        pageData: {
          currentPage: 1,
          pageSize: 100,
        },
      };
    },
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
      getBetHistoryDataWithPageData() {
        return this.getBetHistoryData.filter((it, index) => {
          const minIndex = (this.pageData.currentPage - 1) * this.pageData.pageSize;
          const maxIndex = this.pageData.currentPage * this.pageData.pageSize;
          if (index >= minIndex && index <= maxIndex) {
            return true;
          } else {
            return false;
          }
        });
      },
      gettodayDetails() {
        const catMap = {};
        const dest = [];

        this.todayDetails.forEach((it) => {
          if (!catMap[it.catName]) {
            dest.push({
              catName: it.catName,
              data: [it],
            });
            catMap[it.catName] = it;
          } else {
            for (let j = 0; j < dest.length; j++) {
              const dj = dest[j];
              if (dj.catName === it.catName) {
                dj.data.push(it);
                break;
              }
            }
          }
        });

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
      gettotal() {
        const total = { Amounts: 0, ResultAmounts: 0, canwins: 0 };

        this.gettodayDetails.forEach((item) => {
          total.Amounts += item.Amounts;
          total.ResultAmounts += item.ResultAmounts;
          total.canwins += item.canwins;
        });
        return total;
      },
    },
    methods: {
      sumClassColorJudge(num) {
        if (parseInt(num) < 0) {
          return 'ScoreColor';
        } else if (parseInt(num) === 0) {
          return 'whiteColor';
        } else {
          return 'resultScore';
        }
      },
      sumBlueClassColorJudge(num) {
        if (parseInt(num) < 0) {
          return 'ScoreColor';
        } else if (parseInt(num) === 0) {
          return 'linkColor';
        } else {
          return 'resultScore';
        }
      },
      handleSizeChange(val) {
        this.pageData.pageSize = val;
      },
      handleCurrentChange(val) {
        this.pageData.currentPage = val;
        this.$nextTick(() => {
          this.$refs.Record_main.scrollTop = 0;
        });
      },
      update() {
        if (this.active === 0) {
          this.getBetHistory(false);
        } else if (this.active === 1) {
          this.getBetHistory(false);
        }
      },
      upactive(catName) {
        this.gettodayDetails.forEach((item) => {
          if (item.catName === catName) {
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
    .whiteColor {
      color: white !important;
    }
    .ScoreColor {
      color: red !important;
      margin-right: 1px;
    }
    .linkColor {
      color: #409eff !important;
    }
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
      color: #0a9c00 !important;
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
        .footerPageBlock {
          display: flex;
          justify-content: center;
          padding: 15px 0;
          background: #e5e5e5;
        }
        .rt_info {
          color: #666;
        }
        .NoData {
          margin: 20px auto;
          text-align: center;
          font-size: 14px;
          width: 100%;
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

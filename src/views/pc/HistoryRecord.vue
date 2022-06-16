<template>
  <div>
    <div class="Record_head">
      <h3>投注记录</h3>
    </div>
    <div class="Record_top">
      <ul>
        <li @click="active = 0" :class="active === 0 ? 'active' : ''"> 未結算注單 </li>
        <li @click="active = 1" :class="active !== 0 ? 'active' : ''"> 已結算注單 </li>
      </ul>
      <div>
        <!--            <el-select v-model="cadid" placeholder="全部" v-show="active === 1" @change="chanercadid">-->
        <!--                <el-option-->

        <!--                    v-for="item in options"-->
        <!--                    :key="item.value"-->
        <!--                    :label="item.label"-->
        <!--                    :value="item.value">-->
        <!--                </el-option>-->
        <!--            </el-select>-->
        <el-button v-show="active === 2" size="mini" @click="active = 1" icon="el-icon-arrow-left">
          返回</el-button
        >
        <el-button type="primary" size="mini" @click="updata">更新</el-button>
      </div>
    </div>
    <div class="Record_main">
      <table v-show="active === 0" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <th width="200">注單訊息</th>
          <th>投注內容</th>
          <th width="150">投注額</th>
          <th width="150">投注後餘額</th>
          <th width="150">可贏</th>
        </tr>
        <tr class="rt_data" v-for="(item, i) in getbetHistorydata">
          <td class="rt_info">
            <ul>
              <li>
                <span>下注 : </span>
                <span>{{ item.BetTimeStr }}</span>
              </li>
              <li v-if="item.BetType === 1">
                <span>比赛 : </span>
                <span>{{ item.dataBet[0].ScheduleTimeStr }}</span>
              </li>
              <li v-else>
                <span>类型 : 過關 </span>
                <span> {{ item.dataBet.length }}串 1 x 1 </span>
              </li>
              <li>
                <span>單號 : </span>
                <span>{{ item.TicketID }}</span>
              </li>
              <li>
                <span>賠率 :</span>
                <span>不含本金</span>
              </li>
            </ul>
          </td>
          <td v-if="item.BetType === 1">
            <ul>
              <li>
                {{ item.CatID | getball }} - {{ item.dataBet[0].LeagueName }} -
                {{ item.dataBet[0].HalfType === 0 ? '全場' : '半場' }}
              </li>
              <li>
                {{ item.dataBet[0].HomeTeam }} (主) VS
                {{ item.dataBet[0].AwayTeam }}
              </li>
              <li>
                投注 : {{ item.dataBet[0].betname }} {{ item.dataBet[0].CutLine }} @
                {{ item.dataBet[0].PayoutOddsStr }}
              </li>
            </ul>
          </td>
          <td class="rt_fs" v-if="item.BetType === 99">
            <div class="rt_fs_list" v-for="(betlist, y) in item.dataBet" :key="y">
              <div>{{ y + 1 }}</div>
              <ul>
                <li>
                  {{ item.CatID | getball }} - {{ betlist.LeagueName }} -
                  {{ betlist.HalfType === 0 ? '全場' : '半場' }}
                </li>
                <li>{{ betlist.HomeTeam }} (主) VS {{ betlist.AwayTeam }}</li>
                <li>
                  投注： {{ betlist.betname }} {{ betlist.CutLine }} @
                  {{ betlist.PayoutOddsStr }}
                </li>
              </ul>
            </div>
          </td>
          <td class="rt_betval">{{ item.Amount }}</td>
          <td class="rt_betval">{{ item.AfterAmount }}</td>
          <td class="rt_betval">
            {{ Math.floor(item.Amount * item.dataBet[0].PayoutOddsStr) }}
          </td>
        </tr>
        <tr class="rt_foot">
          <td colspan="2">合計</td>
          <td>{{ totalAmount }}</td>
          <td></td>
          <td>125</td>
        </tr>
      </table>

      <table v-show="active === 1" border="0" cellspacing="0" cellpadding="0" class="weektable">
        <tr>
          <th>比賽日期</th>
          <th>投注額</th>
          <th>返水</th>
          <th>結果</th>
        </tr>
        <tr v-for="(item, i) in weekdata" :class="item.weekLang.indexOf('合計') > 0 ? 'week' : ''">
          <td>{{ item.accdate.substr(5) }} {{ item.weekLang }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.RetAmt }}</td>
          <td v-if="item.weekLang.indexOf('合計') > 0">{{ item.result }}</td>
          <td v-else>
            <el-link type="primary" @click="gothisweek(item.accdate)">{{ item.result }}</el-link>
          </td>
        </tr>
      </table>

      <div v-show="active === 2">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <th width="185">注單訊息</th>
            <th width="400">投注內容</th>
            <th width="100">投注額</th>
            <th width="130">投注後餘額</th>
            <th width="100">可贏</th>
            <th width="100">返水</th>
            <th width="100">結果</th>
            <th width="100">返還</th>
          </tr>
        </table>

        <div v-for="(item, i) in gettodayDetails">
          <table border="0" cellspacing="0" cellpadding="0" class="collapsetable">
            <tr>
              <td width="585" @click="upactive(item.CatID)">
                <i :class="item.active ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
                {{ item.catName }}
              </td>
              <td width="100">{{ item.Amounts }}</td>
              <td width="130"></td>
              <td width="100">{{ item.canwins }}</td>
              <td width="100">{{ item.RetAmts }}</td>
              <td width="100">{{ item.results }}</td>
              <td width="100"></td>
            </tr>
          </table>

          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            v-show="item.active"
            v-for="(itemdata, y) in item.data"
          >
            <tr class="rt_data">
              <td width="185" class="rt_info">
                <ul>
                  <li>
                    <span>下注 : </span>
                    <span>{{ itemdata.BetTimeStr.slice(5, 16) }}</span>
                  </li>
                  <li v-if="itemdata.BetType === 1">
                    <span>比赛 : </span>
                    <span>{{ itemdata.dataBet[0].ScheduleTimeStr.slice(5, 16) }}</span>
                  </li>
                  <li v-else>
                    <span>类型 : 過關 </span>
                    <span> {{ itemdata.dataBet.length }}串 1 x 1 </span>
                  </li>
                  <li>
                    <span>單號 : </span>
                    <span>{{ itemdata.TicketID }}</span>
                  </li>
                  <li>
                    <span>賠率 :</span>
                    <span>不含本金</span>
                  </li>
                </ul>
              </td>
              <td width="400" class="rt_fs" v-if="itemdata.BetType === 99">
                <div class="rt_fs_list" v-for="(betlist, y) in itemdata.dataBet" :key="y">
                  <div>{{ y + 1 }}</div>
                  <ul>
                    <li>
                      {{ itemdata.catName }} - {{ betlist.LeagueName }} -
                      {{ betlist.HalfType === 0 ? '全場' : '半場' }}
                    </li>
                    <li> {{ betlist.HomeTeam }} (主) VS {{ betlist.AwayTeam }} </li>
                    <li>
                      投注： {{ betlist.betname }} {{ betlist.CutLine }} @
                      {{ betlist.PayoutOddsStr }}
                    </li>
                  </ul>
                </div>
              </td>
              <td width="400" v-else>
                <ul>
                  <li>
                    {{ itemdata.catName }} - {{ itemdata.dataBet[0].LeagueName }} -
                    {{ itemdata.dataBet[0].HalfType === 0 ? '全場' : '半場' }}
                  </li>
                  <li>
                    {{ itemdata.dataBet[0].HomeTeam }} (主) VS
                    {{ itemdata.dataBet[0].AwayTeam }}
                  </li>
                  <li>
                    投注 : {{ itemdata.dataBet[0].betname }} {{ itemdata.dataBet[0].CutLine }} @
                    {{ itemdata.dataBet[0].PayoutOddsStr }}
                  </li>
                  <!--                                <li>賽果：111：110</li>-->
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
              <td width="100" class="rt_betval">0</td>
            </tr>
          </table>
        </div>
        <table border="0" cellspacing="0" cellpadding="0">
          <tr class="rt_foot">
            <td width="585">合計</td>
            <td width="100">{{ gettotal.Amounts }}</td>
            <td width="130"></td>
            <td width="100">{{ gettotal.canwins }}</td>
            <td width="100">{{ gettotal.RetAmts }}</td>
            <td width="100">{{ gettotal.results }}</td>
            <td width="100"></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  // import { getbetDayHistory, getbetHistory } from '@/request/api/historyRecord';

  export default {
    name: 'index',
    data() {
      return {
        active: 0,
        activeName: [],
        betHistorydata: [],
        options: [
          {
            value: 1,
            label: '足球',
          },
          {
            value: 31,
            label: '世界杯',
          },
          {
            value: '32',
            label: '歐洲杯',
          },
          {
            value: '83',
            label: '彩球',
          },
          {
            value: '85',
            label: 'ESports',
          },
          {
            value: '101',
            label: '棒球',
          },
          {
            value: '102',
            label: '籃球',
          },
          {
            value: '55',
            label: '网球',
          },
          {
            value: '72',
            label: '赛马赛狗',
          },
          {
            value: '5',
            label: '美足',
          },
          {
            value: '21',
            label: '乒乓球',
          },
          {
            value: '22',
            label: '羽毛球',
          },
          {
            value: '82',
            label: '冰球',
          },
        ],
        cadid: '',
        weekdata: [],
        todayDetails: [],
      };
    },
    filters: {},

    computed: {
      totalAmount() {
        var total = 0;
        this.betHistorydata.forEach((item) => {
          total += item.Amount;
        });
        return total;
      },
      getbetHistorydata() {
        this.betHistorydata.forEach((item, i) => {
          if (item.BetType === 1) {
            if (item.dataBet[0].WagerPosName === '主隊') {
              this.betHistorydata[i].dataBet[0].betname = item.dataBet[0].HomeTeam;
            } else if (item.dataBet[0].WagerPosName === '客隊') {
              this.betHistorydata[i].dataBet[0].betname = item.dataBet[0].AwayTeam;
            } else {
              this.betHistorydata[i].dataBet[0].betname = item.dataBet[0].WagerPosName;
            }
          } else {
            item.dataBet.forEach((Betlist, y) => {
              if (Betlist.WagerPosName === '主隊') {
                this.betHistorydata[i].dataBet[y].betname = Betlist.HomeTeam;
              } else if (Betlist.WagerPosName === '客隊') {
                this.betHistorydata[i].dataBet[y].betname = Betlist.AwayTeam;
              } else {
                this.betHistorydata[i].dataBet[y].betname = item.dataBet[y].WagerPosName;
              }
            });
          }
        });
        return this.betHistorydata;
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
          catName: '過關',
          data: destTypemap,
        };
        // 分组  各球类
        for (var i = 0; i < this.todayDetails.length; i++) {
          var ai = this.todayDetails[i];
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
          var Amounts = 0;
          var RetAmts = 0;
          var results = 0;
          var canwins = 0;
          item.data.forEach((itemdata) => {
            if (itemdata.BetType === 1) {
              canwins += Math.floor(itemdata.Amount * itemdata.dataBet[0].PayoutOddsStr);

              if (itemdata.dataBet[0].WagerPosName === '主隊') {
                itemdata.dataBet[0].betname = itemdata.dataBet[0].HomeTeam;
              } else if (itemdata.dataBet[0].WagerPosName === '客隊') {
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
                if (Betlist.WagerPosName === '主隊') {
                  Betlist.betname = Betlist.HomeTeam;
                } else if (Betlist.WagerPosName === '客隊') {
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
            RetAmts += itemdata.RetAmt;
            results += itemdata.ResultAmount;
          });
          item.Amounts = Amounts;
          item.RetAmts = RetAmts;
          item.results = results;
          item.canwins = canwins;
          item.active = false;
        });
        return dest;
      },
      gettotal() {
        var total = { Amounts: 0, RetAmts: 0, results: 0, canwins: 0 };

        this.gettodayDetails.forEach((item) => {
          // this.totalall.Amounts += item.Amounts
          // this.totalall.RetAmts += item.RetAmts
          // this.totalall.results += item.results
          total.Amounts += item.Amounts;
          total.RetAmts += item.RetAmts;
          total.results += item.results;
          total.canwins += item.canwins;
        });
        return total;
      },
    },
    methods: {
      updata() {
        if (this.active === 0) {
          this.getbetHistory(false);
          // this.getbetDayHistory()
        } else if (this.active === 1) {
          this.getbetHistory(false);
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
      chanercadid(value) {
        this.getbetDayHistory();
      },
      gothisweek(time) {
        this.active = 2;
        this.getbetHistory(true, time, time);
      },
      getbetHistory(type, s, e) {
        var formdata = {};
        if (!type) {
          formdata = { lang: 'cn', isset: false };
        } else {
          formdata = {
            lang: 'cn',
            isset: false,
            starttime: s,
            endtime: e,
            normal: false,
          };
        }
        this.$store
          .dispatch('History/getBetHistory', {
            isset: false,
          })
          .then((res) => {
            if (!type) {
              this.betHistorydata = res.data.list;
            } else {
              this.todayDetails = res.data.list;
            }
          });
      },
      getbetDayHistory(type) {
        this.$store
          .dispatch('History/getBetDayHistory', {
            isset: false,
          })
          .then((res) => {
            this.weekdata = res.data;
            this.$forceUpdate();
          });
      },
    },
    created() {
      this.getbetHistory(false);
      this.getbetDayHistory();
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/sass/theme/mixin.scss';
  @import '../../assets/sass/global.scss';
  .Record_head {
    width: 100%;
    height: 70px;
    position: fixed;
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
    position: fixed;
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
    margin-top: 110px;
    table {
      width: 100%;
      font-size: 13px;
      border: none;
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
        td {
          background-color: #404040;
          color: #ffffff;
          font-size: 14px;
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
</style>

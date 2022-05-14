<template>
  <div id="test"> {{ JSON.stringify(changeData, null, 2) }}</div>
</template>

<script>
  export default {
    name: 'test',
    filters: {
      pretty: function (value) {
        return JSON.stringify(JSON.parse(value), null, 2);
      },
    },
    data() {
      return {
        data: {
          BestHead: [
            {
              WagerGrpID: 10,
              Name: '全場讓球',
              WagerTypeID: [101, 103],
            },
            {
              WagerGrpID: 10,
              Name: '全場大小',
              WagerTypeID: [102, 104, 109],
            },
            {
              WagerGrpID: 10,
              Name: '全場獨贏',
              WagerTypeID: [111, 110],
            },
            {
              WagerGrpID: 11,
              Name: '半場讓球',
              WagerTypeID: [101, 103],
            },
            {
              WagerGrpID: 11,
              Name: '半場大小',
              WagerTypeID: [102, 104, 109],
            },
            {
              WagerGrpID: 11,
              Name: '半場獨贏',
              WagerTypeID: [111, 110],
            },
          ],
          List: [
            {
              LeagueID: 8228,
              LeagueNameStr: '澳洲足协杯外围赛-排位',
              CatID: 1,
              Team: [
                {
                  EvtStatus: 1,
                  ScheduleTimeStr: '2022/05/13 17:30:00',
                  EvtID: 100059403,
                  Row: 1,
                  HomeTeamStr: '西悉尼流浪者-会晋级',
                  HomeID: 56329,
                  AwayTeamStr: '布里斯班狮吼-会晋级',
                  AwayID: 56330,
                  TimeAct: '0',
                  HomeScore: 0,
                  AwayScore: 0,
                  HomeRCard: 0,
                  AwayRCard: 0,
                  HomeYCard: 0,
                  AwayYCard: 0,
                  Wager: [
                    {
                      WagerGrpID: 10,
                      WagerTypeID: 101,
                      GameType: 1,
                      WagerGrpNameStr: '全场今日',
                      WagerTypeNameStr: '让分盘',
                      GameTypeNameStr: '今日',
                      Odds: [
                        {
                          GameID: 100684979,
                          HdpPos: 1,
                          HomeHdp: '0',
                          AwayHdp: '',
                          HomeHdpOdds: '0.69',
                          AwayHdpOdds: '1.29',
                          OULine: '',
                          OverOdds: '0',
                          UnderOdds: '0',
                          HomeOdds: '0',
                          AwayOdds: '0',
                          DrewOdds: '0',
                          Status: 1,
                        },
                      ],
                    },
                  ],
                },
              ],
              CatNameStr: '足球',
            },
          ],
        },
        changeData: null,
      };
    },
    created() {
      console.log('header:', this.data.BestHead);
      console.log('origin:', this.data);
      this.changeData = this.gameListFinalData(this.data);
      console.log('after data:', this.gameListFinalData(this.data));
    },
    methods: {
      gameListFinalData(state) {
        const BestHeadData = state.BestHead;
        return state.List.map((it, index) => {
          return { uid: index, ...it };
        }).map((listData) => {
          const newListData = JSON.parse(JSON.stringify(listData));
          newListData.Team = listData.Team.map((TeamData) => {
            const newTeamData = JSON.parse(JSON.stringify(TeamData));
            const DrewOdds = [];
            newTeamData.Wager.forEach((item_Team_Wager) => {
              DrewOdds.push(item_Team_Wager.Odds[0].DrewOdds);
            });
            // 如果 DrewOdds每個都是字串0 代表不會有和 玩法
            if (DrewOdds.every((key) => key === '0' || key === '0.00')) {
              newTeamData.hasDrewOdds = false;
            } else {
              newTeamData.hasDrewOdds = true;
            }

            const oldWagerDatas = newTeamData.Wager;
            const newWagerData = new Array(BestHeadData.length).fill({
              isNoData: true,
            });
            BestHeadData.forEach((headData, headIndex) => {
              oldWagerDatas.forEach((oldWagerData) => {
                if (headData.WagerTypeID.indexOf(oldWagerData.WagerTypeID) !== -1) {
                  newWagerData[headIndex] = oldWagerData;
                }
              });
            });
            newTeamData.Wager = newWagerData;

            // 可能會對其他數據做操作
            // newTeamData.Wager = newTeamData.Wager.map((wagerData) => {
            //   const newWagerData = JSON.parse(JSON.stringify(wagerData));
            //   const originOdds = newWagerData.Odds;
            //   const newOdds = new Array(BestHeadData.length).fill({
            //     status: -1,
            //   });
            //   BestHeadData.forEach((headData, headIndex) => {
            //     originOdds.forEach((originOddData) => {
            //       debugger;
            //       if (headData.WagerTypeID.indexOf(originOddData.WagerTypeID) !== -1) {
            //         newOdds[headIndex] = originOddData;
            //       }
            //     });
            //   });
            //   newWagerData.Odds = newOdds;
            //   console.log(newWagerData.Odds);
            //   return newWagerData;
            // });
            return newTeamData;
          });
          return newListData;
        });
        // TODO 測試CODE 過濾指定賽事
        // .filter((it) => {
        //   if (it.LeagueID === 7893) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // })
      },
    },
  };
</script>

<style lang="scss" scoped>
  #test {
  }
</style>

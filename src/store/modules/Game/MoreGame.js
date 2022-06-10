import { getGameDetail, getGameDetailSmall } from '@/api/Game';
export default {
  namespaced: true,
  state: {
    isShowMoreGame: false,
    // CatID
    // CatNameStr
    // LeagueID
    // LeagueNameStr
    // teamData
    // MenuHead
    moreGameData: {},
    teamData: [],
    // 監聽此值發生變化,就能知道moreGameData重新被初始化
    MoreGameStoreUpdateFlag: false,
  },
  mutations: {
    setIsShowMoreGame(state, val) {
      state.isShowMoreGame = val;
    },
    closeMoreGameList(state) {
      state.isShowMoreGame = false;
      state.moreGameData = {};
    },
  },
  actions: {
    openMoreGameList(store, { teamData }) {
      store.state.MoreGameStoreUpdateFlag = !store.state.MoreGameStoreUpdateFlag;
      store.state.teamData = teamData;
      store.commit('setIsShowMoreGame', true);
      store.dispatch('GetMoreGameDetail', teamData);
    },
    // 18-a. (赔率)游戏玩法资讯 更多
    GetMoreGameDetail(store, teamData) {
      return new Promise((resolve, reject) => {
        return getGameDetail({
          show: 2,
          moreModel: true,
          EvtIDs: teamData.EvtID.toString(),
        })
          .then((res) => {
            // if (res.data.List.length !== 0) {
            //   const newteamData = res.data.List[0].Team[0];
            //   const newMenuData = res.data.Menu;
            //   // 只更新目前打開更多的EvtID狀態
            //   if (
            //     Object.keys(store.state.moreGameData).length !== 0 &&
            //     newteamData.EvtID === store.state.moreGameData.teamData.EvtID
            //   ) {
            //     store.state.moreGameData.teamData = newteamData;
            //     store.state.moreGameData.MenuHead = newMenuData;
            //   }
            // }
            store.state.moreGameData = res.data;
            resolve(res);
          })
          .catch(reject);
      });
    },
    GetMoreGameDetailSmall(store) {
      return new Promise((resolve, reject) => {
        if (Object.keys(store.state.moreGameData).length === 0) {
          resolve();
          return;
        }
        return getGameDetailSmall({
          CatID: store.state.moreGameData.CatID,
          GameType: store.state.moreGameData.GameType,
          moreModel: true,
        }).then((res) => {
          if (Object.keys(store.state.moreGameData).length !== 0 && res.data.length !== 0) {
            res.data.forEach((newOddData) => {
              const newGameID = newOddData.GameID;
              const newWagerGrpID = newOddData.WagerGrpID;
              const newWagerTypeID = newOddData.WagerTypeID;

              const wagerIndex = store.state.moreGameData.teamData.Wager.findIndex(
                (wagerData) =>
                  wagerData.WagerGrpID === newWagerGrpID && wagerData.WagerTypeID === newWagerTypeID
              );
              if (wagerIndex > -1) {
                store.state.moreGameData.teamData.Wager[wagerIndex].Odds.every((oddData) => {
                  if (oddData.GameID === newGameID) {
                    oddData.HdpPos = newOddData.HdpPos;
                    oddData.HomeHdp = newOddData.HomeHdp;
                    oddData.AwayHdp = newOddData.AwayHdp;
                    oddData.HomeHdpOdds = newOddData.HomeHdpOdds;
                    oddData.AwayHdpOdds = newOddData.AwayHdpOdds;
                    oddData.OULine = newOddData.OULine;
                    oddData.OverOdds = newOddData.OverOdds;
                    oddData.UnderOdds = newOddData.UnderOdds;
                    oddData.HomeOdds = newOddData.HomeOdds;
                    oddData.AwayOdds = newOddData.AwayOdds;
                    oddData.DrewOdds = newOddData.DrewOdds;
                    oddData.Status = newOddData.Status;
                    store.state.moreGameData.teamData.EvtStatus = newOddData.EvtStatus;
                    return false;
                  } else {
                    return true;
                  }
                });
              }
            });
          }
        });
      });
    },
  },
};

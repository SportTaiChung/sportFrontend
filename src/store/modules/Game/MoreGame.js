import { getGameDetail, getGameDetailSmall } from '@/api/Game';
export default {
  namespaced: true,
  state: {
    isShowMoreGame: false,
    // CatID
    // CatNameStr
    // LeagueID
    // LeagueNameStr
    // TeamData
    // MenuHead
    moreGameData: {},
  },
  mutations: {
    setIsShowMoreGame(state, val) {
      state.isShowMoreGame = val;
    },
    setMoreGameData(state, val) {
      state.moreGameData = JSON.parse(JSON.stringify(val));
    },
    closeMoreGameList(state) {
      state.isShowMoreGame = false;
      state.moreGameData = {};
    },
  },
  actions: {
    openMoreGameList(store, collapseData) {
      store.commit('setIsShowMoreGame', true);
      store.commit('setMoreGameData', collapseData);
      store.dispatch('GetMoreGameDetail', collapseData);
    },
    // 18-a. (赔率)游戏玩法资讯 更多
    GetMoreGameDetail(store, collapseData) {
      return new Promise((resolve, reject) => {
        return getGameDetail({
          CatID: collapseData.CatID,
          GameType: collapseData.GameType,
          show: 2,
          EvtIDs: collapseData.TeamData.EvtID,
          moreModel: true,
        })
          .then((res) => {
            if (res.data.List.length !== 0) {
              const newTeamData = res.data.List[0].Team[0];
              const newMenuData = res.data.Menu;
              // 只更新目前打開更多的EvtID狀態
              if (
                Object.keys(store.state.moreGameData).length !== 0 &&
                newTeamData.EvtID === store.state.moreGameData.TeamData.EvtID
              ) {
                store.state.moreGameData.TeamData = newTeamData;
                store.state.moreGameData.MenuHead = newMenuData;
              }
            }
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
          console.log(res.data);
          if (Object.keys(store.state.moreGameData).length !== 0 && res.data.length !== 0) {
            res.data.forEach((newOddData) => {
              const newGameID = newOddData.GameID;
              const newWagerGrpID = newOddData.WagerGrpID;
              const newWagerTypeID = newOddData.WagerTypeID;

              const wagerIndex = store.state.moreGameData.TeamData.Wager.findIndex(
                (wagerData) =>
                  wagerData.WagerGrpID === newWagerGrpID && wagerData.WagerTypeID === newWagerTypeID
              );
              if (wagerIndex > -1) {
                store.state.moreGameData.TeamData.Wager[wagerIndex].Odds.every((oddData) => {
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
                    store.state.moreGameData.TeamData.EvtStatus = newOddData.EvtStatus;
                    console.log('find update!');
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

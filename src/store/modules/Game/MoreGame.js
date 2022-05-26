import { getGameDetail } from '@/api/Game';
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
      console.log('collapseData:', collapseData);
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
  },
};

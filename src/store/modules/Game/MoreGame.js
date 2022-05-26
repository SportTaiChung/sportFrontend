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
    openMoreGameList(state, val) {
      state.isShowMoreGame = true;
      state.moreGameData = JSON.parse(JSON.stringify(val));
    },
    closeMoreGameList(state) {
      state.isShowMoreGame = false;
      state.moreGameData = {};
    },
  },
  actions: {},
};

// 存放所有玩法面板賠率

export default {
  namespaced: true,
  state: {
    oddDataList: {},
  },
  getters: {},
  mutations: {
    clearAll(state) {
      state.oddDataList = {};
    },
    update(state, val) {
      state.oddDataList[val.key] = val.value;
    },
  },
  actions: {},
};

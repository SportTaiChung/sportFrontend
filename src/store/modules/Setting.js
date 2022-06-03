// import { login, logout, getUserInfoAbout, getUserInfoCash } from '@/api/User';

export default {
  namespaced: true,
  state: {
    tableSort: 1,
    acceptBetter: false,
    includePrincipal: false,
  },
  getters: {},
  mutations: {
    setTableSort(state, val) {
      state.tableSort = val;
    },
    setAcceptBetter(state, val) {
      state.acceptBetter = val;
    },
    setIncludePrincipal(state, val) {
      state.includePrincipal = val;
    },
  },
  actions: {},
};

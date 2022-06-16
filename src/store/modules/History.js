import { getBetDayHistory, getBetHistory } from '@/api/Game';
// import rootStore from '@/store';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getBetDayHistory() {
      return getBetDayHistory();
    },
    getBetHistory() {
      return getBetHistory();
    },
  },
};

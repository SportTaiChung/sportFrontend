import { getBetDayHistory, getBetHistory } from '@/api/Game';
// import rootStore from '@/store';

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    getBetDayHistory(store, postData) {
      return getBetDayHistory(postData);
    },
    getBetHistory(store, postData) {
      return getBetHistory(postData);
    },
  },
};

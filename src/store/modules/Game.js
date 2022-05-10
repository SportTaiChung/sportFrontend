import { getMenuGameType, getMenuGameCatList } from '@/api/Game';
// import { autoAPI } from '@/api/promiseApiHandler';

export default {
  namespaced: true,
  state: {
    GameTypeList: [],
    BallTypeList: [],
  },
  getters: {},
  mutations: {
    setGameTypeList(state, val) {
      state.GameTypeList = val;
    },
    setBallTypeList(state, val) {
      state.BallTypeList = val;
    },
  },
  actions: {
    GetMenuGameType(store) {
      return new Promise((resolve, reject) => {
        return getMenuGameType()
          .then(async (res) => {
            store.commit('setGameTypeList', res.data);
            resolve(res);
          })
          .catch(reject);
      });
    },
    GetMenuGameCatList(store, postData) {
      return new Promise((resolve, reject) => {
        return getMenuGameCatList(postData)
          .then(async (res) => {
            store.commit('setBallTypeList', res.data.item);
            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};

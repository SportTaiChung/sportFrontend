import { getMenuGameType, getMenuGameCatList, getGameDetail } from '@/api/Game';

export default {
  namespaced: true,
  state: {
    GameTypeList: [],
    BallTypeList: [],
    GameList: [],
  },
  getters: {},
  mutations: {
    setGameTypeList(state, val) {
      state.GameTypeList = val;
    },
    setBallTypeList(state, val) {
      state.BallTypeList = val;
    },
    setGameList(state, val) {
      state.GameList = val;
    },
  },
  actions: {
    // 16. 獲取左側菜單
    GetMenuGameType(store) {
      return new Promise((resolve, reject) => {
        store.commit('setGameTypeList', []);
        return getMenuGameType()
          .then(async (res) => {
            store.commit('setGameTypeList', res.data);
            resolve(res);
          })
          .catch(reject);
      });
    },
    // 17. 獲取左侧菜单球种(含赛事数量)
    GetMenuGameCatList(store, postData) {
      return new Promise((resolve, reject) => {
        store.commit('setBallTypeList', []);
        return getMenuGameCatList(postData)
          .then(async (res) => {
            store.commit('setBallTypeList', res.data.item);
            resolve(res);
          })
          .catch(reject);
      });
    },
    // 18. (赔率)游戏玩法资讯
    GetGameDetail(store, postData) {
      return new Promise((resolve, reject) => {
        return getGameDetail(postData)
          .then(async (res) => {
            store.commit('setGameList', res.data);
            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};

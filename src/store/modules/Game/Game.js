import { getMenuGameType, getMenuGameCatList, getGameDetail } from '@/api/Game';
import * as GameTypeListGetters from './getters/GameTypeList';
import * as GameListGetters from './getters/GameList';

export default {
  namespaced: true,
  state: {
    // 左邊側欄上方選單列表
    GameTypeList: [],
    // 左邊側欄上方選單列表
    BallTypeList: [],
    // 遊戲大面板列表
    GameList: [],
    // 當前選擇的遊戲分類 (ex.早盤、今日)
    selectGameType: null,
    // 當前選擇的球種
    selectCatID: null,
    // 當前選擇的WagerType
    selectWagerTypeKey: null,
  },
  getters: {
    ...GameTypeListGetters,
    ...GameListGetters,
  },
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
    setCatIDAndGameType(state, { selectGameType, selectCatID, selectWagerTypeKey }) {
      state.selectGameType = selectGameType;
      state.selectCatID = selectCatID;
      state.selectWagerTypeKey = selectWagerTypeKey;
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
        store.commit('setCatIDAndGameType', {
          selectGameType: null,
          selectCatID: null,
          selectWagerTypeKey: null,
        });
        return getGameDetail(postData)
          .then(async (res) => {
            store.commit('setCatIDAndGameType', {
              selectGameType: postData.GameType,
              selectCatID: postData.CatID,
              selectWagerTypeKey: postData.WagerTypeKey,
            });
            store.commit('setGameList', res.data);
            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};

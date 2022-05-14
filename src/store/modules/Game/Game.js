import { getMenuGameType, getMenuGameCatList, getGameDetail, getGameDetailSmall } from '@/api/Game';
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
    updateGameList(state, updateData) {
      if (state.GameList.length !== 0) {
        updateData.forEach((updateData) => {
          const gameListIndex = state.GameList.List.findIndex(
            (LeagueData) => LeagueData.LeagueID === updateData.LeagueID
          );

          if (gameListIndex !== -1) {
            try {
              state.GameList.List[gameListIndex].Team.every((teamData) => {
                return teamData.Wager.every((wagerData) => {
                  return wagerData.Odds.every((oddData) => {
                    if (oddData.GameID === updateData.GameID) {
                      oddData.HdpPos = updateData.HdpPos;
                      oddData.HomeHdp = updateData.HomeHdp;
                      oddData.AwayHdp = updateData.AwayHdp;
                      oddData.HomeHdpOdds = updateData.HomeHdpOdds;
                      oddData.AwayHdpOdds = updateData.AwayHdpOdds;
                      oddData.OULine = updateData.OULine;
                      oddData.OverOdds = updateData.OverOdds;
                      oddData.UnderOdds = updateData.UnderOdds;
                      oddData.HomeOdds = updateData.HomeOdds;
                      oddData.AwayOdds = updateData.AwayOdds;
                      oddData.DrewOdds = updateData.DrewOdds;
                      oddData.Status = updateData.Status;
                      console.log('update!');
                      return false;
                    }
                  });
                });
              });
            } catch (err) {
              debugger;
            }
          }
        });
      }
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
    // 18-a. (赔率)游戏玩法资讯
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
    GetGameDetailSmall(store) {
      return new Promise((resolve, reject) => {
        const CatID = store.state.selectCatID;
        const GameType = store.state.selectGameType;
        const WagerTypeKey = store.state.selectWagerTypeKey;
        if (CatID !== null || GameType !== null || WagerTypeKey !== null) {
          return getGameDetailSmall({
            CatID,
            GameType,
            WagerTypeKey,
          }).then((res) => {
            // console.log('res:', res.data);
            store.commit('updateGameList', res.data);
          });
        } else {
          resolve();
        }
      });
    },
  },
};

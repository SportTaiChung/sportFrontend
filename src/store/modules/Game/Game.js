import { getMenuGameType, getMenuGameCatList, getGameDetail, getGameDetailSmall } from '@/api/Game';
import * as GameTypeListGetters from './getters/GameTypeList';
import * as GameListGetters from './getters/GameList';

export default {
  namespaced: true,
  state: {
    // 左邊側欄上方選單列表
    GameTypeList: [],
    // 側欄選單列表
    MenuList: [],
    // 一次包含所有選單
    FullMenuList: [],
    // 遊戲盤口面板列表
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
      state.GameTypeList.length = 0;
      state.GameTypeList = val;
    },
    setMenuList(state, val) {
      state.MenuList.length = 0;
      state.MenuList = val;
    },
    setFullMenuList(state, val) {
      state.FullMenuList.length = 0;
      state.FullMenuList = val;
    },
    setGameList(state, val) {
      state.GameList.length = 0;
      state.GameList = val;
    },
    setGameType(state, val) {
      state.selectGameType = val;
    },
    setCatIDAndGameTypeAndWagerType(state, { selectGameType, selectCatID, selectWagerTypeKey }) {
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
                      if (updateData.EvtStatus !== 1) {
                        console.warn(
                          'some data is disable!!',
                          teamData.EvtStatus,
                          updateData.EvtStatus
                        );
                      }
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
                      teamData.EvtStatus = updateData.EvtStatus;
                      return false;
                    } else {
                      return true;
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
    // 清除選擇的數據
    // ClearSelectData(store) {
    //   store.commit('setGameList', []);
    //   store.commit('setCatIDAndGameTypeAndWagerType', {
    //     selectGameType: null,
    //     selectCatID: null,
    //     selectWagerTypeKey: null,
    //   });
    // },
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
    GetMenuGameCatList(store, isClearOldData = false) {
      return new Promise((resolve, reject) => {
        if (isClearOldData) {
          store.commit('setMenuList', []);
          store.commit('setFullMenuList', []);
        }
        return getMenuGameCatList()
          .then(async (res) => {
            if (
              store.state.selectGameType === null &&
              store.state.selectCatID === null &&
              store.state.selectWagerTypeKey === null
            ) {
              store.commit('setCatIDAndGameTypeAndWagerType', {
                selectGameType: res.data.Default.GameType,
                selectCatID: res.data.Default.catid,
                selectWagerTypeKey: res.data.Default.WagerTypeKey,
              });
            }
            const listIndex = res.data.list.findIndex(
              (listData) => listData.GameType === store.state.selectGameType
            );
            if (listIndex > -1) {
              store.commit('setMenuList', res.data.list[listIndex].LeftMenu.item);
            }

            store.commit('setFullMenuList', res.data.list);

            resolve(res);
          })
          .catch(reject);
      });
    },
    // 18-a. (赔率)游戏玩法资讯
    GetGameDetail(store, postData) {
      return new Promise((resolve, reject) => {
        let apiPostData = postData;
        if (postData.WagerTypeKey === null) {
          apiPostData = {
            GameType: postData.GameType,
            CatID: postData.CatID,
          };
        }
        store.commit('setGameList', []);
        window.OddData.clear();

        let newWagerTypeKey = 1;
        if (postData.WagerTypeKey !== null) {
          newWagerTypeKey = postData.WagerTypeKey;
        }
        store.commit('setCatIDAndGameTypeAndWagerType', {
          selectGameType: postData.GameType,
          selectCatID: postData.CatID,
          selectWagerTypeKey: newWagerTypeKey,
        });
        return getGameDetail({ ...apiPostData, show: store.rootState.Setting.tableSort })
          .then(async (res) => {
            console.log('game detail API response done');
            store.commit('setGameList', res.data);
            resolve(res);
          })
          .catch(reject);
      });
    },
    // 更新GameDetail
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
            console.log(res.data.map((it) => it.Status));
            store.commit('updateGameList', res.data);
          });
        } else {
          resolve();
        }
      });
    },
  },
};

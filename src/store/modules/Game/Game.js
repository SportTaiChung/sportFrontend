import {
  getGameResultLeagues,
  getMenuGameType,
  getMenuGameCatList,
  getGameDetail,
  getGameDetailSmall,
} from '@/api/Game';
import { WagerTypeIDandWagerGrpIDtoString } from '@/utils/SportLib';
import * as GameTypeListGetters from './getters/GameTypeList';
import rootStore from '@/store';

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
    // 當前選擇的球種 如果是-999 代表是收藏玩法
    selectCatID: null,
    // 當前選擇的WagerType
    selectWagerTypeKey: null,
    // 當前選擇指定的聯盟
    selectLeagueIDs: [],
    // GamesNavMenu會去監聽此值,此值如果發生變化,會重新打detail API
    isCallGameDetailAPI: false,
  },
  getters: {
    ...GameTypeListGetters,
  },
  mutations: {
    changeCatReset(state) {
      state.selectLeagueIDs.length = 0;
      state.selectLeagueIDs = [];
    },
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
    setSelectLeagueIDs(state, val) {
      state.selectLeagueIDs.length = 0;
      state.selectLeagueIDs = val;
    },
    setGameList(state, setData) {
      state.GameList.length = 0;
      const favoritesTmp = [];
      state.GameList = setData.data.map((gameData) => {
        const newBestHead = gameData.Items.BestHead.map((it) => {
          return {
            originName: it.Name,
            showName: WagerTypeIDandWagerGrpIDtoString(it.WagerTypeIDs, it.WagerGrpIDs[0]),
            WagerGrpIDs: it.WagerGrpIDs,
            WagerTypeIDs: it.WagerTypeIDs,
          };
        });
        const newList = gameData.Items.List.filter((it) => {
          // 檢查 League 底下的 teamData.EvtStatus 是否為1
          const enableTeamList = it.Team.filter((teamData) => teamData.EvtStatus === 1);
          const isLeagueEnable = enableTeamList.length !== 0;
          return isLeagueEnable;
        })
          .map((it, index) => {
            return { id: index, ...it };
          })
          .map((listData) => {
            const newListData = JSON.parse(JSON.stringify(listData));
            newListData.Team = listData.Team.map((TeamData) => {
              favoritesTmp.push(TeamData.EvtID);

              const newTeamData = JSON.parse(JSON.stringify(TeamData));
              const DrewOdds = [];
              newTeamData.Wager.forEach((item_Team_Wager) => {
                DrewOdds.push(item_Team_Wager.Odds[0].DrewOdds);
              });
              // 如果 DrewOdds每個都是字串0 代表不會有和 玩法
              if (DrewOdds.every((key) => key === '0' || key === '0.00')) {
                newTeamData.hasDrewOdds = false;
              } else {
                newTeamData.hasDrewOdds = true;
              }

              // 補上空欄位
              const oldWagerDatas = JSON.parse(JSON.stringify(newTeamData.Wager));
              const newWagerData = new Array(newBestHead.length).fill({
                isNoData: true,
              });
              newBestHead.forEach((headData, headIndex) => {
                oldWagerDatas.every((oldWagerData, oldWagerDataIndex) => {
                  if (headData.WagerTypeIDs.indexOf(oldWagerData.WagerTypeID) !== -1) {
                    newWagerData[headIndex] = oldWagerData;
                    oldWagerDatas.splice(oldWagerDataIndex, 1);
                    return false;
                  }
                });
              });
              newTeamData.Wager = newWagerData;

              return newTeamData;
            });
            return newListData;
          });

        return {
          ...gameData,
          Items: {
            BestHead: newBestHead,
            List: newList,
          },
        };
      });

      // 從收藏模式API 進來的
      if (setData.isFavorite) {
        rootStore.commit('Setting/setFavorites', favoritesTmp);
      }
    },
    setGameType(state, val) {
      state.selectGameType = val;
    },
    setCatIDAndGameTypeAndWagerType(state, { selectGameType, selectCatID, selectWagerTypeKey }) {
      state.selectGameType = selectGameType;
      state.selectCatID = selectCatID;
      state.selectWagerTypeKey = selectWagerTypeKey;
    },
    updateGameList(state, { updateOtherStore, updateData }) {
      if (state.GameList.length !== 0) {
        const notFindData = [];
        updateData.forEach((updateData) => {
          let isFind = false;
          state.GameList.every((GameData) => {
            const gameListIndex = GameData.Items.List.findIndex(
              (LeagueData) => LeagueData.LeagueID === updateData.LeagueID
            );

            if (gameListIndex !== -1) {
              try {
                GameData.Items.List[gameListIndex].Team.every((teamData) => {
                  return teamData.Wager.every((wagerData) => {
                    if (wagerData?.isNoData) {
                      return false;
                    } else {
                      return wagerData.Odds.every((oddData) => {
                        if (oddData.GameID === updateData.GameID) {
                          isFind = true;
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
                          // console.log('update!!!');
                          return false;
                        } else {
                          return true;
                        }
                      });
                    }
                  });
                });
              } catch (err) {
                console.error('err:', err);
              }
              return false;
            } else {
              return true;
            }
          });
          if (!isFind) {
            notFindData.push(updateData);
          }
        });

        if (!updateOtherStore) {
          // 更新數據有,但是Table卻沒有時,要重新打detail API
          if (notFindData.length !== 0) {
            console.warn('update的資料,detail資料不存在,即將重打detail API', notFindData);
            state.isCallGameDetailAPI = !state.isCallGameDetailAPI;
          }
        }

        if (updateOtherStore) {
          rootStore.commit('MoreGame/updateMoreGameData', {
            updateOtherStore: false,
            updateData,
          });
        }
      }
    },
  },
  actions: {
    // API(15,18)共用-聯賽Items
    GetGameResultLeagues(store) {
      return new Promise((resolve, reject) => {
        return getGameResultLeagues()
          .then(async (res) => {
            resolve(res);
          })
          .catch(reject);
      });
    },
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
    GetGameDetail(store, { updateBehind, postData }) {
      return new Promise((resolve, reject) => {
        let apiPostData = postData;
        if (postData.WagerTypeKey === null) {
          apiPostData = {
            GameType: postData.GameType,
            CatID: postData.CatID,
          };
        }

        if (!updateBehind) {
          store.commit('setGameList', {
            data: [],
            isFavorite: false,
          });
        }

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
        return getGameDetail({
          ...apiPostData,
          show: store.rootState.Setting.tableSort,
          LeagueIDs: store.state.selectLeagueIDs.join(','),
        })
          .then(async (res) => {
            console.log('game detail API response done');

            if (res.data?.List.length !== 0) {
              console.log(
                'detail 當前所有league id',
                res.data.List.map((it) => it.LeagueID).sort((a, b) => a - b)
              );
              const newData = [
                {
                  CatID: res.data.List[0].CatID,
                  CatName: res.data.List[0].CatNameStr,
                  Items: { ...res.data },
                },
              ];
              store.commit('setGameList', {
                data: newData,
                isFavorite: false,
              });
            }
            resolve(res);
          })
          .catch(reject);
      });
    },
    // 18-b. 收藏夾盤口-(赔率)游戏玩法资讯
    GetFavoriteGameDetail(store) {
      return new Promise((resolve, reject) => {
        let postData = null;
        postData = {
          GameType: store.state.selectGameType,
          EvtIDs: rootStore.state.Setting.favorites.join(','),
          FavoritesModel: true,
        };
        return getGameDetail(postData)
          .then(async (res) => {
            store.commit('setGameList', {
              data: res.data,
              isFavorite: true,
            });
            resolve(res);
          })
          .catch(reject);
      });
    },
    // 19-a. 更新GameDetail
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
            const EvtStatusList = res.data.map((it) => it.EvtStatus);
            console.log('DetailSmall 內所有資料的EvtStatus:', EvtStatusList);
            console.log(
              `EvtStatus 為 -1 的資料 有 ${EvtStatusList.filter((it) => it === -1).length} 筆`
            );
            store.commit('updateGameList', {
              updateOtherStore: true,
              updateData: res.data,
            });
          });
        } else {
          resolve();
        }
      });
    },
    // 19-b. 更新GameDetail
    GetFavoriteGameDetailSmall(store) {
      return new Promise((resolve, reject) => {
        const GameType = store.state.selectGameType;
        return getGameDetailSmall({
          FavoritesModel: true,
          GameType,
          EvtIDs: rootStore.state.Setting.favorites.join(','),
        }).then((res) => {
          store.commit('updateGameList', {
            updateOtherStore: true,
            updateData: res.data,
          });
        });
      });
    },
  },
};

import {
  getCatList,
  getGameResultLeagues,
  getMenuGameType,
  getMenuGameCatList,
  getGameDetail,
  getGameDetailSmall,
  getLive,
  getQAHistory,
  sendQAMessage,
  sendQAFile,
  getCountMes,
  sendReadMes,
  getGameResult,
  getAnnouncement,
  getMainBetInfo,
} from '@/api/Game';
import * as GameTypeListGetters from './getters/GameTypeList';
import rootStore from '@/store';
import { getMenuIconByCatID, getBoardImageByCatId, getColorByCatId } from '@/utils/SportLib';
import { NotCheckWagerGrpIDs, favoriteCatID } from '@/Config/index.js';

export default {
  namespaced: true,
  state: {
    // 大分類 array
    CatList: [],
    // map對應表
    CatMapData: {},
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
    // 當前選擇指定的聯盟
    selectLeagueIDs: [],
    // GamesNavMenu會去監聽此值,此值如果發生變化,會重新打detail API
    isCallGameDetailAPI: false,
    // 是否快速投注
    isQuickBet: {
      isEnable: false,
      amount: 10,
    },
    // 是否顯示客服
    isShowService: false,
    // 下注資訊
    betInfo: [],
  },
  getters: {
    ...GameTypeListGetters,
  },
  mutations: {
    setBetInfo(state, val) {
      state.betInfo = val;
    },
    setCatList(state, val) {
      state.CatList = val;
    },
    setIsShowService(state, val) {
      state.isShowService = val;
    },
    setCatMapData(state, val) {
      state.CatMapData = val;
    },
    changeCatReset(state) {
      state.selectLeagueIDs.length = 0;
      state.selectLeagueIDs = [];
    },
    setQuickBetEnable(state, val) {
      state.isQuickBet.isEnable = val;
    },
    setQuickBetAmount(state, val) {
      state.isQuickBet.amount = val;
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
        let hasMoreCount = false;
        const newBestHead = gameData.Items.BestHead.map((it) => {
          return {
            showName: it.Name,
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
            return { ...it, id: index, CatNameStr: state.CatMapData[it.CatID].Name };
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
                  // 如果 WagerGrpID 不是128,需要同時檢查WagerGrpIDs和WagerTypeIDs
                  if (NotCheckWagerGrpIDs.indexOf(headData.WagerGrpIDs[0]) === -1) {
                    const WagerGrpIDIndex = headData.WagerGrpIDs.indexOf(oldWagerData.WagerGrpID);
                    const WagerTypeIDIndex = headData.WagerTypeIDs.indexOf(
                      oldWagerData.WagerTypeID
                    );

                    if (WagerTypeIDIndex !== -1 && WagerGrpIDIndex !== -1) {
                      newWagerData[headIndex] = oldWagerData;
                      oldWagerDatas.splice(oldWagerDataIndex, 1);
                      return false;
                    } else {
                      return true;
                    }
                  } else {
                    // 如果 WagerGrpID 是128, 只要檢查 WagerTypeIDs 就好
                    if (headData.WagerTypeIDs.indexOf(oldWagerData.WagerTypeID) !== -1) {
                      newWagerData[headIndex] = oldWagerData;
                      oldWagerDatas.splice(oldWagerDataIndex, 1);
                      return false;
                    }
                  }
                });
              });
              newTeamData.Wager = newWagerData;

              if (TeamData.MoreCount !== 0) {
                hasMoreCount = true;
              }

              return newTeamData;
            });
            return newListData;
          });

        return {
          ...gameData,
          Items: {
            BestHead: newBestHead,
            List: newList,
            hasMoreCount,
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
    updateGameList(state, { isUpdateFromOtherStore, updateData }) {
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
                GameData.Items.List[gameListIndex].Team.every((teamData, teamIndex) => {
                  return teamData.Wager.every((wagerData) => {
                    if (wagerData?.isNoData) {
                      return true;
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
                // 檢查League Data 的Team 是否EvtStatus 都為1,如果都是非1的話 就移除此League資料
                const EvtStatusEnableList = GameData.Items.List[gameListIndex].Team.filter(
                  (it) => it.EvtStatus === 1
                );
                if (EvtStatusEnableList.length === 0) {
                  GameData.Items.List.splice(gameListIndex, 1);
                }
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

        // 自己store呼叫的 dispatch
        if (!isUpdateFromOtherStore) {
          // 更新數據有,但是Table卻沒有時,要重新打detail API
          if (notFindData.length !== 0) {
            console.warn('update的資料,detail資料不存在,即將重打detail API', notFindData);
            state.isCallGameDetailAPI = !state.isCallGameDetailAPI;
          }
          rootStore.commit('MoreGame/updateMoreGameData', {
            isUpdateFromOtherStore: true,
            updateData,
          });
        }
      }
    },
    updateTeamData(state, { isUpdateFromOtherStore, updateData }) {
      if (state.GameList.length !== 0) {
        updateData.forEach((updateData) => {
          state.GameList.every((GameData) => {
            const gameListIndex = GameData.Items.List.findIndex(
              (LeagueData) => LeagueData.LeagueID === updateData.LeagueID
            );

            if (gameListIndex !== -1) {
              try {
                GameData.Items.List[gameListIndex].Team.every((teamData, teamIndex) => {
                  if (
                    teamData.AwayID === updateData.AwayID &&
                    teamData.HomeID === updateData.HomeID
                  ) {
                    teamData = { ...teamData, ...updateData };
                    return false;
                  } else {
                    return true;
                  }
                });
              } catch (err) {
                console.error('updateTeamData:', err);
              }
              return false;
            } else {
              return true;
            }
          });
        });
      }
    },
    updateMoreCount(state, { updateData }) {
      if (state.GameList.length !== 0) {
        updateData.forEach((updateData) => {
          state.GameList.every((GameData) => {
            return GameData.Items.List.every((LeagueData) => {
              return LeagueData.Team.every((teamData) => {
                if (teamData.EvtID === updateData.EvtID) {
                  teamData.MoreCount = updateData.Count;
                  return false;
                } else {
                  return true;
                }
              });
            });
          });
        });
      }
    },
  },
  actions: {
    GetCatList(store) {
      return new Promise((resolve, reject) => {
        return getCatList()
          .then((res) => {
            res.push({
              CatID: favoriteCatID,
              GameScoreRefresh: false,
              GroupCatIDs: [favoriteCatID],
              Name: '收藏',
            });

            // 設定 icon 顏色 背景...
            res.forEach((it) => {
              it.icon = getMenuIconByCatID(it.CatID);
              it.color = getColorByCatId(it.CatID);
              it.background = getBoardImageByCatId(it.CatID);
            });

            const mapList = res.reduce((sum, it) => {
              let appendObj = {};

              it.GroupCatIDs.forEach((id) => {
                appendObj = {
                  ...appendObj,
                  ...{
                    [id]: it,
                  },
                };
              });
              return { ...sum, ...appendObj };
            }, {});
            store.commit('setCatList', res);
            store.commit('setCatMapData', mapList);
            resolve();
          })
          .catch(reject);
      });
    },

    // 11. 游戏公告讯息 false
    GetAnnouncement(store) {
      return new Promise((resolve, reject) => {
        return getAnnouncement({
          sla: true,
        }).then((res) => resolve(res));
      });
    },
    // 12-1.获取在线咨询信息
    GetQAHistory(store, { isGuestMode = false }) {
      return new Promise((resolve, reject) => {
        return getQAHistory(isGuestMode).then((res) => {
          resolve(res);
        });
      });
    },
    // 12-2 未讀訊息數
    GetCountMes(store, { isGuestMode = false }) {
      return new Promise((resolve, reject) => {
        return getCountMes(isGuestMode).then((res) => {
          resolve(res);
        });
      });
    },
    // 12-3 標示已讀
    SendReadMes(store, { isGuestMode = false }) {
      return new Promise((resolve, reject) => {
        return sendReadMes(isGuestMode).then((res) => {
          resolve(res);
        });
      });
    },
    // 13.传送咨询-信息
    SendQAMessage(store, { message, isGuestMode = false }) {
      return new Promise((resolve, reject) => {
        const postData = {
          Content: message,
        };
        return sendQAMessage(postData, isGuestMode).then((res) => {
          resolve(res);
        });
      });
    },
    // 14.传送咨询-檔案信息
    SendQAFile(store, { base64File, name, isGuestMode = false }) {
      return new Promise((resolve, reject) => {
        const postData = {
          Content: base64File,
          FileName: name,
        };
        return sendQAFile(postData, isGuestMode).then((res) => {
          resolve(res);
        });
      });
    },
    // 15.賽事結果
    GetGameResult(store, { CatID, ScheduleTime, LeagueID, EvtID, ItemKey }) {
      return new Promise((resolve, reject) => {
        let postData = {};
        if (EvtID) {
          postData = { EvtID };
        } else {
          postData = {
            CatID,
            LeagueID,
            ScheduleTime,
            ItemKey,
          };
        }
        return getGameResult(postData)
          .then(async (res) => {
            resolve(res);
          })
          .catch(reject);
      });
    },
    // API(15,18)共用-聯賽Items
    GetGameResultLeagues(store) {
      return new Promise((resolve, reject) => {
        return getGameResultLeagues({
          CatID: store.state.selectCatID,
          GameType: store.state.selectGameType,
        })
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
          show: store.rootState.Setting.UserSetting.tableSort,
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
                  CatName: store.state.CatMapData[res.data.List[0].CatID].Name,
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
          EvtIDs: rootStore.state.Setting.UserSetting.favorites.join(','),
          FavoritesModel: true,
        };
        return getGameDetail(postData)
          .then(async (res) => {
            res.data = res.data.map((it) => {
              if (it.Items.List.length !== 0) {
                it.CatID = it.Items.List[0].CatID;
              } else {
                it.CatID = null;
              }
              return it;
            });
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
            // const EvtStatusList = res.data.List.map((it) => it.EvtStatus);
            // console.log('DetailSmall 內所有資料的EvtStatus:', EvtStatusList);
            // console.log(
            //   `EvtStatus 為 -1 的資料 有 ${EvtStatusList.filter((it) => it === -1).length} 筆`
            // );
            store.commit('updateGameList', {
              isUpdateFromOtherStore: false,
              updateData: res.data.List,
            });

            if (res.data.GameScoreHead.length !== 0) {
              store.commit('updateTeamData', {
                isUpdateFromOtherStore: false,
                updateData: res.data.GameScoreHead,
              });
            }

            if (res.data.MoreCoutToEvtID.length !== 0) {
              store.commit('updateMoreCount', {
                updateData: res.data.MoreCoutToEvtID,
              });
            }
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
          EvtIDs: rootStore.state.Setting.UserSetting.favorites.join(','),
        }).then((res) => {
          store.commit('updateGameList', {
            isUpdateFromOtherStore: false,
            updateData: res.data.List,
          });
        });
      });
    },
    GetLiveURL(store) {
      return new Promise((resolve, reject) => {
        return getLive().then((res) => {
          resolve(res);
        });
      });
    },
    GetMainBetInfo(store, postData) {
      return new Promise((resolve, reject) => {
        const newPostData = Object.assign({}, postData);
        if (postData.CatIDs === favoriteCatID) {
          newPostData.EvtIDs = rootStore.state.Setting.UserSetting.favorites.join(',');
          delete newPostData.CatIDs;
        }
        return getMainBetInfo(newPostData).then((res) => {
          store.state.betInfo = res.data;
          resolve(res);
        });
      });
    },
  },
};

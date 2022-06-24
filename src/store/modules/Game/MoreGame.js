import { getGameDetail, getGameDetailSmall, getGameResult } from '@/api/Game';
import rootStore from '@/store';

export default {
  namespaced: true,
  state: {
    isShowMoreGame: false,
    moreGameData: {},
    teamData: {},
    // 監聽此值發生變化,就能知道moreGameData重新被初始化
    MoreGameStoreUpdateFlag: false,
    loading: false,
  },
  mutations: {
    setIsShowMoreGame(state, val) {
      state.isShowMoreGame = val;
    },
    closeMoreGameList(state) {
      state.isShowMoreGame = false;
      state.moreGameData = {};
      state.teamData = {};
    },
    updateGameScoreHead(state, newGameScore) {
      if (Object.keys(state.moreGameData).length !== 0) {
        state.moreGameData.GameScoreHead = newGameScore;
      }
    },
    updateTeamData(state, newTeamData) {
      if (Object.keys(state.teamData).length !== 0) {
        state.teamData = { ...state.teamData, ...newTeamData };
      }
    },
    updateMoreGameData(state, { isUpdateFromOtherStore, updateData }) {
      if (Object.keys(state.moreGameData).length !== 0 && updateData.length !== 0) {
        updateData.forEach((newOddData) => {
          const newGameID = newOddData.GameID;
          const newWagerGrpID = newOddData.WagerGrpID;
          const newWagerTypeID = newOddData.WagerTypeID;

          state.moreGameData.List.every((gameData) => {
            return gameData.List.every((leagueData) => {
              if (leagueData.LeagueID === newOddData.LeagueID) {
                const wagerIndex = leagueData.Team[0].Wager.findIndex(
                  (wagerData) =>
                    wagerData.WagerGrpID === newWagerGrpID &&
                    wagerData.WagerTypeID === newWagerTypeID
                );
                if (wagerIndex > -1) {
                  leagueData.Team[0].Wager[wagerIndex].Odds.every((oddData) => {
                    if (oddData.GameID === newGameID) {
                      oddData.HdpPos = newOddData.HdpPos;
                      oddData.HomeHdp = newOddData.HomeHdp;
                      oddData.AwayHdp = newOddData.AwayHdp;
                      oddData.HomeHdpOdds = newOddData.HomeHdpOdds;
                      oddData.AwayHdpOdds = newOddData.AwayHdpOdds;
                      oddData.OULine = newOddData.OULine;
                      oddData.OverOdds = newOddData.OverOdds;
                      oddData.UnderOdds = newOddData.UnderOdds;
                      oddData.HomeOdds = newOddData.HomeOdds;
                      oddData.AwayOdds = newOddData.AwayOdds;
                      oddData.DrewOdds = newOddData.DrewOdds;
                      oddData.Status = newOddData.Status;
                      state.teamData.EvtStatus = newOddData.EvtStatus;
                      return false;
                    } else {
                      return true;
                    }
                  });
                }
                return leagueData.Team[0].Wager;
              }
              return true;
            });
          });
        });

        // 自己store呼叫的 dispatch
        if (!isUpdateFromOtherStore) {
          // 更新主玩法data
          rootStore.commit('Game/updateGameList', {
            isUpdateFromOtherStore: true,
            updateData,
          });
        }
      }
    },
  },
  actions: {
    openMoreGameList(store, { teamData }) {
      store.state.MoreGameStoreUpdateFlag = !store.state.MoreGameStoreUpdateFlag;
      store.state.teamData = teamData;
      store.commit('setIsShowMoreGame', true);
      store.dispatch('GetMoreGameDetail', teamData);
    },
    // 18-a. (赔率)游戏玩法资讯 更多
    GetMoreGameDetail(store, teamData) {
      return new Promise((resolve, reject) => {
        store.state.moreGameData.length = 0;
        store.state.moreGameData = [];
        store.state.loading = true;
        return getGameDetail({
          show: 2,
          moreModel: true,
          EvtIDs: teamData.EvtID.toString(),
        })
          .then((res) => {
            store.state.moreGameData = res.data;
            resolve(res);
          })
          .catch(reject)
          .finally(() => {
            store.state.loading = false;
          });
      });
    },
    GetMoreGameDetailSmall(store, EvtID) {
      return new Promise((resolve, reject) => {
        if (Object.keys(store.state.moreGameData).length === 0) {
          resolve();
          return;
        }
        return getGameDetailSmall({
          EvtID,
        }).then((res) => {
          if (res.data.GameScore.length !== 0) {
            // 不要懷疑,這邊API拿到的key 是GameScore,但卻要拿去更新GameScoreHead的key
            store.commit('updateGameScoreHead', res.data.GameScore);
            store.commit('updateTeamData', res.data.GameScore[0]);
          }
          store.commit('updateMoreGameData', {
            isUpdateFromOtherStore: false,
            updateData: res.data.List,
          });
        });
      });
    },
    // 15.即時比分數據
    GetGameLiveResult(store, EvtID) {
      return new Promise((resolve, reject) => {
        return getGameResult({ EvtID })
          .then(async (res) => {
            console.log('res:', res);
            if (Object.keys(store.state.moreGameData).length === 0) {
              // store.state.moreGameData.GameScore=res
            }
            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};

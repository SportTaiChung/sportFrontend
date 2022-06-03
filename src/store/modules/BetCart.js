import { getBetInfo, playBet, playState, getBetHistory } from '@/api/Game';
import { oddDataToPlayData } from '@/utils/SportLib';
import { Notification } from 'element-ui';
export default {
  namespaced: true,
  state: {
    betCartList: [],
    betHistoryList: [],
    isAddNewToChart: false,
    strayOdd: null,
  },
  getters: {
    showBetCartList(state) {
      return state.betCartList;
    },
    showBetHistoryList(state) {
      return state.betHistoryList;
    },
  },
  mutations: {
    setStrayOdd(state, val) {
      state.strayOdd = val;
    },
    pushCart(state, cartData) {
      state.betCartList.push(cartData);
    },
    clearCart(state) {
      state.betCartList.length = 0;
      state.betCartList = [];
    },
    removeCartByGameID(state, gameID) {
      const cartIndex = state.betCartList.findIndex((cartData) => cartData.GameID === gameID);
      if (cartIndex > -1) {
        state.betCartList.splice(cartIndex, 1);
      }
    },
    setBetHistoryList(state, list) {
      state.betHistoryList.length = 0;
      state.betHistoryList = list;
    },
  },
  actions: {
    isCartListAlreadyHaveSelf(store, { GameID, clickPlayIndex }) {
      return (
        store.state.betCartList.findIndex(
          (cartData) => cartData.GameID === GameID && cartData.clickPlayIndex === clickPlayIndex
        ) > -1
      );
    },
    // 获取投注盘口详情API
    callCartUpdateAPI(store, gameIDs) {
      return new Promise((resolve, reject) => {
        return getBetInfo({ GameIDs: JSON.stringify(gameIDs) })
          .then(async (res) => {
            if (res.data.length !== 0) {
              res.data.forEach((apiData) => {
                const updateGameID = apiData.GameID;
                const updateCartIndex = store.state.betCartList.findIndex(
                  (betCart) => betCart.GameID === updateGameID
                );
                if (updateCartIndex > -1) {
                  store.state.betCartList[updateCartIndex] = {
                    ...store.state.betCartList[updateCartIndex],
                    BetMax: apiData.BetMax,
                    BetMin: apiData.BetMin,
                    Status: apiData.Status,
                    EvtStatus: apiData.EvtStatus,
                    AwayHdp: apiData.AwayHdp,
                    AwayHdpOdds: apiData.AwayHdpOdds,
                    AwayOdds: apiData.AwayOdds,
                    DrewOdds: apiData.DrewOdds,
                    HdpPos: apiData.HdpPos,
                    HomeHdp: apiData.HomeHdp,
                    HomeHdpOdds: apiData.HomeHdpOdds,
                    HomeOdds: apiData.HomeOdds,
                    OULine: apiData.OULine,
                    OverOdds: apiData.OverOdds,
                    UnderOdds: apiData.UnderOdds,
                  };
                  store.state.betCartList[updateCartIndex].playData = oddDataToPlayData(
                    store.state.betCartList[updateCartIndex].SetFlag,
                    store.state.betCartList[updateCartIndex].WagerTypeID,
                    store.state.betCartList[updateCartIndex]
                  );
                }
              });
              store.state.betCartList = store.state.betCartList.slice();
            }
            resolve(res);
          })
          .catch(reject);
      });
    },
    // 更新購物車內所有注單賠率資訊 API
    updateAllCartData(store) {
      return new Promise((resolve, reject) => {
        if (store.state.betCartList.length !== 0) {
          const betCartListGameIDs = store.state.betCartList.map((cartData) => cartData.GameID);
          return store.dispatch('callCartUpdateAPI', betCartListGameIDs);
        } else {
          resolve();
        }
      });
    },
    // 加入到購物車
    addToCart(store, betData) {
      // 是否在購物車內找到完全相同的自己
      const isSelfJustRemove =
        store.state.betCartList.findIndex(
          (cartData) =>
            cartData.GameID === betData.GameID && cartData.clickPlayIndex === betData.clickPlayIndex
        ) > -1;

      // 移除相同的game id
      store.commit('removeCartByGameID', betData.GameID);

      // 如果購物車內找到相同的自己,移除後就直接結束function
      if (isSelfJustRemove) {
        return;
      }

      // watch 此旗標就知道有新增投注到購物車
      store.state.isAddNewToChart = !store.state.isAddNewToChart;
      let newBetData = JSON.parse(JSON.stringify(betData));
      newBetData = {
        ...newBetData,
        BetMax: null,
        BetMin: null,
        betAmount: null,
        winAmount: null,
      };
      newBetData.playData = oddDataToPlayData(betData.SetFlag, newBetData.WagerTypeID, newBetData);
      store.commit('pushCart', newBetData);
      store.dispatch('callCartUpdateAPI', [betData.GameID]);
    },
    // 執行投注 API ,
    // betType : 1  一般投注
    // betType : 99 過關投注
    submitBet(store, list) {
      store.commit('SetLoading', true, { root: true });
      return playBet(list).then((res) => {
        return store.dispatch('playState', res.data.traceCodeKey);
      });
    },
    // 檢查投注狀態
    playState(store, traceCodeKey) {
      return new Promise((resolve, reject) => {
        return playState(traceCodeKey)
          .then((res) => {
            if (res.data.length === 0) {
              setTimeout(() => {
                return store.dispatch('playState', traceCodeKey);
              }, 1000);
            } else if (res.data[0].code === 201) {
              setTimeout(() => {
                return store.dispatch('playState', traceCodeKey);
              }, 1000);
              store.commit('SetLoading', true, { root: true });
            } else if (res.data[0].code === 200) {
              store.commit('clearCart');
              Notification.success({
                message: res.data[0].Message,
              });
              store.dispatch('User/GetUserInfoCash', null, { root: true });
              store.commit('SetLoading', false, { root: true });
              resolve(res);
            } else {
              Notification.error({
                message: res.data[0].Message,
              });
              store.commit('SetLoading', false, { root: true });
              reject(res);
            }
          })
          .catch(reject)
          .finally(() => {
            store.commit('SetLoading', false, { root: true });
          });
      });
    },
    getBetHistory(store, postData) {
      return new Promise((resolve, reject) => {
        return getBetHistory(postData)
          .then((res) => {
            if (res.data?.list) {
              store.commit('setBetHistoryList', res.data.list);
            }
            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};

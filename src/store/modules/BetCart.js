import { getBetInfo, playBet, playState, getBetHistory } from '@/api/Game';
import { oddDataToPlayData } from '@/utils/SportLib';
import { Notification } from 'element-ui';
export default {
  namespaced: true,
  state: {
    betCartList: [],
    betHistoryList: [],
    isAddNewToChart: false,
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
                    store.state.betCartList[updateCartIndex].CatID,
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
      // 先移除相同的game id
      store.commit('removeCartByGameID', betData.GameID);

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
      newBetData.playData = oddDataToPlayData(newBetData.CatID, newBetData.WagerTypeID, newBetData);
      store.commit('pushCart', newBetData);
      console.log('newBetData:', newBetData);

      store.dispatch('callCartUpdateAPI', [betData.GameID]);
    },
    // 執行投注 API
    submitBet(store) {
      const list = [];
      let findError = false;
      store.state.betCartList.every((cartData) => {
        console.log(cartData);
        const CatId = cartData.CatID;
        const GameID = cartData.GameID;
        const WagerTypeID = cartData.WagerTypeID;
        const WagerGrpID = cartData.WagerGrpID;
        const WagerPos = cartData.playData.playMethodData.wagerPos[cartData.clickPlayIndex];
        const HdpPos = cartData.HdpPos;
        const CutLine = cartData.playData.playMethodData.betCutLineDealFunc(cartData);
        const oddKey = cartData.playData.playMethodData.showOdd[[cartData.clickPlayIndex]];
        const OddValue = cartData.playData[oddKey];
        const WagerString = `${CatId},${GameID},${WagerTypeID},${WagerGrpID},${WagerPos},${HdpPos},${CutLine},${OddValue},DE`;
        if (cartData.betAmount === null || cartData.betAmount === '') {
          findError = true;
          return false;
        }
        const listItem = {
          CatId,
          WagerString,
          Amount: cartData.betAmount,
          AcceptBetter: false,
          BetType: 1,
        };
        list.push(listItem);
        return true;
      });
      if (findError) {
        Notification.error({
          message: '請先輸入下注金額',
        });
        return;
      }
      store.commit('SetLoading', true, { root: true });
      return playBet(list).then((res) => {
        return store.dispatch('playState', res.data.traceCodeKey);
      });
    },
    // 檢查投注狀態
    playState(store, traceCodeKey) {
      return new Promise((resolve, reject) => {
        return playState(traceCodeKey).then((res) => {
          if (res.data[0].code === 201) {
            setTimeout(() => {
              return store.dispatch('playState', traceCodeKey);
            }, 3000);
            store.commit('SetLoading', true, { root: true });
          } else if (res.data[0].code === 200) {
            store.commit('clearCart');
            Notification.success({
              message: res.data[0].Message,
            });
            store.commit('SetLoading', false, { root: true });
            resolve(res);
          } else {
            Notification.error({
              message: res.data[0].Message,
            });
            store.commit('SetLoading', false, { root: true });
            reject(res);
          }
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
import { getBetInfo } from '@/api/Game';
import { oddDataToPlayData } from '@/utils/SportLib';
export default {
  namespaced: true,
  state: {
    betCartList: [],
    isAddNewToChart: false,
  },
  getters: {
    showBetCartList(state) {
      return state.betCartList;
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
  },
  actions: {
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
    updateAllCartData(store) {
      if (store.state.betCartList.length !== 0) {
        const betCartListGameIDs = store.state.betCartList.map((cartData) => cartData.GameID);
        store.dispatch('callCartUpdateAPI', betCartListGameIDs);
      }
    },
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
    submitBet(store) {
      // state.betCartList
    },
  },
};

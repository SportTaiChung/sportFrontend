import { getBetInfo } from '@/api/Game';
import { oddDataToPlayData } from '@/utils/SportLib';
export default {
  namespaced: true,
  state: {
    betCartList: [],
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
    updateAllCartData(store) {
      if (store.betCartList.length !== 0) {
        const betCartListGameIDs = store.betCartList.map((cartData) => cartData.GameID);
        return new Promise((resolve, reject) => {
          return getBetInfo({ GameIDs: JSON.stringify([betCartListGameIDs]) })
            .then(async (res) => {
              if (res.data.length !== 0) {
                res.data.forEach((apiData) => {
                  const updateGameID = apiData.GameID;
                  let readyUpdateBetCart = store.state.betCartList.find(
                    (betCart) => betCart.GameID === updateGameID
                  );
                  if (readyUpdateBetCart) {
                    readyUpdateBetCart = {
                      ...readyUpdateBetCart,
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
                    readyUpdateBetCart.playData = oddDataToPlayData(
                      readyUpdateBetCart.CatID,
                      readyUpdateBetCart.WagerTypeID,
                      readyUpdateBetCart
                    );
                  }
                });
              }

              resolve(res);
            })
            .catch(reject);
        });
      }
    },
    addToCart(store, betData) {
      // 先移除相同的game id
      store.commit('removeCartByGameID', betData.GameID);

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
    },
  },
};

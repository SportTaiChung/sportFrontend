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
    pushCart(state, val) {
      return state.betCartList.push(val);
    },
  },
  actions: {
    addToCart(store, val) {
      let newBetData = JSON.parse(JSON.stringify(val));

      console.log('newBetData:', newBetData);

      return new Promise((resolve, reject) => {
        return getBetInfo({ GameIDs: JSON.stringify([newBetData.GameID]) })
          .then(async (res) => {
            if (res.data.length !== 0) {
              const apiData = res.data[0];
              newBetData = {
                ...newBetData,
                BetMax: apiData.BetMax,
                BetMin: apiData.BetMin,
                betAmount: null,
                winAmount: null,
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
              newBetData.playData = oddDataToPlayData(
                newBetData.CatID,
                newBetData.WagerTypeID,
                newBetData
              );
              store.commit('pushCart', newBetData);
            }
            console.log('newBetData:', newBetData);

            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};

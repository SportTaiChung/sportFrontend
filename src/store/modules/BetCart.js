import { getBetInfo, playBet, playState, getBetHistory } from '@/api/Game';
import { oddDataToPlayData } from '@/utils/SportLib';
import { PanelModeEnum } from '@/enum/BetPanelMode';
import rootStore from '@/store';
import { Notification } from 'element-ui';
export default {
  namespaced: true,
  state: {
    betCartList: [],
    betHistoryList: [],
    // 是否有新的注單加入到購物車
    isAddNewToChart: false,
    // 是否需要去清除BetViewList的資料
    isClearMemberData: false,
    strayOdd: null,
    panelMode: PanelModeEnum.normal,
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
    setPanelMode(state, val) {
      state.panelMode = val;
    },
    setIsClearMemberData(state, val) {
      state.isClearMemberData = val;
    },
    setStrayOdd(state, val) {
      state.strayOdd = val;
    },
    pushCart(state, cartData) {
      state.betCartList.push(cartData);
    },
    clearCart(state) {
      state.betCartList.length = 0;
      state.betCartList = [];
      state.strayOdd = null;
    },
    clearCartBetResult(state) {
      state.betCartList.forEach((it) => (it.betResult = null));
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
    updateBetCartListBetResult(state, resultList) {
      if (state.betCartList.length !== 0 && state.panelMode === PanelModeEnum.result) {
        resultList.forEach((it, index) => {
          state.betCartList[index].betResult = it;
        });
      }
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
      // 當在顯示結算面板時,點擊新的投注則會清空
      if (store.state.panelMode === PanelModeEnum.result) {
        store.commit('clearCart');
        store.commit('setPanelMode', PanelModeEnum.Normal);
        store.commit('setIsClearMemberData', !store.state.isClearMemberData);
      }

      // 是否在購物車內找到完全相同的自己
      const isSelfJustRemove =
        store.state.betCartList.findIndex(
          (cartData) => cartData.GameID === betData.GameID && cartData.wagerPos === betData.wagerPos
        ) > -1;

      // 移除相同的game id
      store.commit('removeCartByGameID', betData.GameID);

      // 如果購物車內找到相同的自己,移除後就直接結束function
      if (isSelfJustRemove) {
        return;
      }

      let newBetData = JSON.parse(JSON.stringify(betData));
      let betAmount = null;
      if (rootStore.state.Game.isQuickBet.isEnable) {
        betAmount = parseInt(rootStore.state.Game.isQuickBet.amount);
      } else if (
        rootStore.state.Setting.UserSetting.defaultAmount.type === 1 ||
        rootStore.state.Setting.UserSetting.defaultAmount.type === 2
      ) {
        betAmount = parseInt(rootStore.state.Setting.UserSetting.defaultAmount.amount);
      }
      newBetData = {
        ...newBetData,
        BetMax: null,
        BetMin: null,
        betAmount,
        winAmount: null,
        betResult: null,
      };
      console.log('newBetData!!!:', betData.SetFlag, newBetData);
      newBetData.playData = oddDataToPlayData(betData.SetFlag, newBetData.WagerTypeID, newBetData);
      store.commit('pushCart', newBetData);

      // watch 此旗標就知道有新增投注到購物車
      store.state.isAddNewToChart = !store.state.isAddNewToChart;

      store.dispatch('callCartUpdateAPI', [betData.GameID]);
    },
    // 執行投注 API ,
    // betType : 1  一般投注
    // betType : 99 過關投注
    submitBet(store, list) {
      return new Promise((resolve, reject) => {
        store.commit('SetLoading', true, { root: true });
        return playBet(list)
          .then((res) => {
            if (res.data?.ticket) {
              store.commit('updateBetCartListBetResult', res.data.ticket);
            }
            resolve(res);
          })
          .catch(reject);
      });
    },
    // 檢查投注狀態
    playState(store, { traceCodeKey, isStray }) {
      return new Promise((resolve, reject) => {
        return playState(traceCodeKey)
          .then((res) => {
            if (res?.data) {
              // 如果有找到201 就重新打一次playState
              if (res.data.find((it) => it.code === 201)) {
                setTimeout(() => {
                  store.dispatch('playState', { traceCodeKey, isStray });
                }, 500);
              }

              // 只有過關投注才能提示
              if (isStray && res.data.length !== 0) {
                if (res.data[0].code === 200) {
                  Notification.success({
                    message: res.data[0].Message,
                  });
                } else {
                  Notification.error({
                    message: res.data[0].Message,
                  });
                }
              }
              store.commit('updateBetCartListBetResult', res.data);
            }
            resolve(res);
          })
          .catch(reject);
      });
    },
    getBetHistory(store, postData) {
      return new Promise((resolve, reject) => {
        return getBetHistory(postData)
          .then((res) => {
            if (res.data?.list) {
              store.commit(
                'setBetHistoryList',
                res.data.list.map((it) => {
                  return {
                    ...it,
                    isCollapse: false,
                  };
                })
              );
            }
            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};

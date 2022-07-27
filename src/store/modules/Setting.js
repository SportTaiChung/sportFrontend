// import { login, logout, getUserInfoAbout, getUserInfoCash } from '@/api/User';
import rootStore from '@/store';
import * as SportLib from '@/utils/SportLib';
import { Message } from 'element-ui';

const defaultSettings = Object.freeze({
  // 收藏夾
  favorites: [],
  // 賽事排序方式 0: 熱門 1: 時間
  tableSort: 1,
  // 自動接收最佳賠率
  acceptBetter: false,
  // 是否含本金
  includePrincipal: false,
  // 下注確認信息
  showBetConfirm: true,
  // 默認金額
  defaultAmount: {
    // type: 0: 關閉 | 1: 最後投注, 2: 自訂金額
    type: 2,
    amount: 100,
  },
  // 默認過關投注
  defaultStrayAmount: {
    // type: 0: 關閉 | 1: 最後投注, 2: 自訂金額
    type: 2,
    amount: 100,
  },
  // 偏好籌碼 (最多6個)
  preferChips: SportLib.chipsData.slice(0, 6).map((chip) => chip.value),
});

export default {
  namespaced: true,
  state: {
    UserSetting: {},
  },
  getters: {},
  mutations: {
    writeSettingToLocalStorage(state, UserSetting) {
      const MBID = localStorage.getItem('MBID');
      let writeSetting = JSON.parse(localStorage.getItem('UserSetting'));
      if (writeSetting === null) {
        writeSetting = {};
      }
      if (writeSetting[MBID] === undefined) {
        writeSetting[MBID] = {};
      }
      writeSetting[MBID] = UserSetting;
      localStorage.setItem('UserSetting', JSON.stringify(writeSetting));
    },
    init(state, val) {
      const UserSetting = JSON.parse(localStorage.getItem('UserSetting'));
      const MBID = localStorage.getItem('MBID');
      const oldUser = UserSetting?.[MBID];
      if (oldUser) {
        // 舊會員
        // 先拷貝預設值, 再覆寫, 避免日後新增欄位後, localStorage 讀不到的問題
        const cloneDefault = Object.assign({}, defaultSettings);
        const finalSetting = Object.assign(cloneDefault, oldUser);

        // 修正偏好籌碼, 避免從 localStorage 讀到非預設值內的設定
        const allowed = SportLib.chipsData.map((chip) => chip.value);
        finalSetting.preferChips = finalSetting.preferChips.filter((v) => allowed.includes(v));

        // 如果沒有偏好籌碼, 則直接套用預設值籌碼
        if (finalSetting.preferChips.length < 1) {
          Object.assign(finalSetting.preferChips, defaultSettings.preferChips);
        }

        // 保存到 state
        state.UserSetting = Object.assign(cloneDefault, finalSetting);
      } else {
        // 新會員
        state.UserSetting = Object.assign({}, defaultSettings);
        rootStore.commit('Setting/writeSettingToLocalStorage', state.UserSetting);
      }
    },
    setTableSort(state, val) {
      state.UserSetting.tableSort = val;
      rootStore.commit('Setting/writeSettingToLocalStorage', state.UserSetting);
    },
    setAcceptBetter(state, val) {
      state.UserSetting.acceptBetter = val;
      rootStore.commit('Setting/writeSettingToLocalStorage', state.UserSetting);
    },
    setIncludePrincipal(state, val) {
      state.UserSetting.includePrincipal = val;
      rootStore.commit('Setting/writeSettingToLocalStorage', state.UserSetting);
    },
    addFavorites(state, val) {
      const findIndex = state.UserSetting.favorites.findIndex((it, index) => it === val);
      if (findIndex > -1) {
        state.UserSetting.favorites.splice(findIndex, 1);
        Message({
          message: '取消收藏!',
          type: 'warning',
        });
      } else {
        state.UserSetting.favorites.push(val);
        Message({
          message: '收藏成功!',
          type: 'success',
        });
      }
      rootStore.commit('Setting/writeSettingToLocalStorage', state.UserSetting);
    },
    setFavorites(state, newFavoritesArr) {
      state.UserSetting.favorites = newFavoritesArr;
      rootStore.commit('Setting/writeSettingToLocalStorage', state.UserSetting);
    },
    setSettings(state, val) {
      const newSettings = val;
      Object.assign(state.UserSetting, newSettings);
      rootStore.commit('Setting/writeSettingToLocalStorage', state.UserSetting);
    },
  },
  actions: {},
};

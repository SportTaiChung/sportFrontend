// import { login, logout, getUserInfoAbout, getUserInfoCash } from '@/api/User';
import rootStore from '@/store';

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
    type: 0,
    amount: 0,
  },
  // 默認過關投注
  defaultStrayAmount: {
    // type: 0: 關閉 | 1: 最後投注, 2: 自訂金額
    type: 0,
    amount: 0,
  },
  // 偏好籌碼 (最多6個)
  preferChips: [1, 5, 10, 500, 1000, 2000],
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
      if (UserSetting !== null && UserSetting[MBID] !== undefined) {
        // 舊會員
        // 先拷貝預設值, 再覆寫, 避免日後新增欄位後, localStorage 讀不到的問題
        const cloneDefault = Object.assign({}, defaultSettings);
        state.UserSetting = Object.assign(cloneDefault, UserSetting[MBID]);
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
      } else {
        state.UserSetting.favorites.push(val);
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

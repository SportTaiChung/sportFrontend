// import { login, logout, getUserInfoAbout, getUserInfoCash } from '@/api/User';
import rootStore from '@/store';
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
        state.UserSetting = UserSetting[MBID];
      } else {
        state.UserSetting = {
          favorites: [],
          tableSort: 1,
          acceptBetter: false,
          includePrincipal: false,
        };
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
      state.favorites = newFavoritesArr;
      rootStore.commit('Setting/writeSettingToLocalStorage', state.UserSetting);
    },
    clearFavorites(state, val) {
      state.favorites.length = 0;
      state.favorites = [];
    },
  },
  actions: {},
};

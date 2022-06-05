// import { login, logout, getUserInfoAbout, getUserInfoCash } from '@/api/User';

export default {
  namespaced: true,
  state: {
    tableSort: 1,
    acceptBetter: false,
    includePrincipal: false,
    favorites: [],
  },
  getters: {},
  mutations: {
    init(state, val) {
      let favoritesDefault = [];
      const favoritesData = JSON.parse(localStorage.getItem('favorites'));
      const MBID = localStorage.getItem('MBID');
      if (favoritesData !== null) {
        if (favoritesData[MBID] !== undefined) {
          favoritesDefault = favoritesData[MBID].favorites;
        }
      }
      state.favorites.length = 0;
      state.favorites = favoritesDefault;
    },
    setTableSort(state, val) {
      state.tableSort = val;
    },
    setAcceptBetter(state, val) {
      state.acceptBetter = val;
    },
    setIncludePrincipal(state, val) {
      state.includePrincipal = val;
    },
    addFavorites(state, val) {
      const findIndex = state.favorites.findIndex((it, index) => it === val);
      if (findIndex > -1) {
        state.favorites.splice(findIndex, 1);
      } else {
        state.favorites.push(val);
      }
      let favoritesData = JSON.parse(localStorage.getItem('favorites'));
      const MBID = localStorage.getItem('MBID');
      if (favoritesData) {
        if (favoritesData[MBID] === undefined) {
          favoritesData[MBID] = {};
        }
        favoritesData[MBID].favorites = state.favorites;
      } else {
        favoritesData = {};
        favoritesData[MBID] = {
          favorites: [val],
        };
      }
      localStorage.setItem('favorites', JSON.stringify(favoritesData));
    },
    clearFavorites(state, val) {
      state.favorites.length = 0;
      state.favorites = [];
    },
  },
  actions: {},
};

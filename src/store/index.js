import Vue from 'vue';
import Vuex from 'vuex';
import User from './modules/User';
import Game from './modules/Game/Game';
import { dataFresh } from '@/api/Common';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { User, Game },
  state: {
    isMobile: false,
    isLoading: false,
    isInit: false,
    nowThemeInfo: 'light', // 当前主题
    themes: ['light', 'dark'], // 所有主题
    // 當前語言都假定是簡體中文
    Lang: 'cn',
  },
  mutations: {
    SetThemeInfo(state, theme) {
      state.nowThemeInfo = theme;
    },
    SetIsMobile(state, newVal) {
      state.isMobile = newVal;
    },
    SetLoading(state, newVal) {
      state.isLoading = newVal;
    },
    SetIsInit(state, newVal) {
      state.isInit = newVal;
    },
  },
  actions: {
    getDataFresh() {
      return dataFresh();
    },
  },
});
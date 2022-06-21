import Vue from 'vue';
import Vuex from 'vuex';
import User from './modules/User';
import BetCart from './modules/BetCart';
import Game from './modules/Game/Game';
import MoreGame from './modules/Game/MoreGame';
import Setting from './modules/Setting';
import History from './modules/History';

import { systemTime } from '@/api/Common';

Vue.use(Vuex);

let Lang = localStorage.getItem('Lang');
if (Lang === null) {
  Lang = 'tw';
}
export default new Vuex.Store({
  modules: { User, Game, BetCart, MoreGame, Setting, History },
  state: {
    isMobile: false,
    isLoading: false,
    isInit: false,
    nowThemeInfo: 'light', // 当前主题
    themes: ['light', 'dark'], // 所有主题
    Lang,
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
    SetLang(state, newVal) {
      state.Lang = newVal;
      localStorage.setItem('Lang', newVal);
    },
  },
  actions: {
    getSystemTime() {
      return systemTime();
    },
  },
});

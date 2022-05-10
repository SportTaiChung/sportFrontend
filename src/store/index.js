import Vue from 'vue';
import Vuex from 'vuex';
import User from './modules/User';
import { dataFresh } from '@/api/Common';
import { autoAPI } from '@/api/promiseApiHandler';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { User },
  state: {
    // 儲存第一次進網站時的網址,
    // 因為網站初始化時會先強制把網站跳轉到init頁面,
    // 初始化完成後在重新回到使用者跳轉時的網址
    FirstInWebSiteURL: '',
    isMobile: false,
    isLoading: false,
    isInit: false,
    nowThemeInfo: 'light', // 当前主题
    themes: ['light', 'dark'], // 所有主题
  },
  mutations: {
    SetThemeInfo(state, theme) {
      state.nowThemeInfo = theme;
    },
    SetFirstInWebSiteURL(state, newVal) {
      state.FirstInWebSiteURL = newVal;
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

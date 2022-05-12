import axios from 'axios';
import store from '@/store';
import * as message from '@/utils/messageHandler.js';
import API_ERROR_CODE from '@/Config/API_ERROR_CODE';

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.VUE_APP_BASE_API:', process.env.VUE_APP_BASE_API);
const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/data/API' : process.env.VUE_APP_BASE_API,
  timeout: 15000,
  withCredentials: true,
});

// 發送API前的劫持
instance.interceptors.request.use(
  async (config, data) => {
    // 根據API 參數有沒有 AddRVfToken,來決定是否要在header加上RVfToken
    if (config.url !== '/datafresh/token' && config?.param?.AddRVfToken) {
      await store.dispatch('getDataFresh').then((res) => {
        config.headers.RVfToken = res.token;
      });
    }
    // 根據API 參數有沒有AddMemberToken,來決定是否要在header加上 SSSMBID 和 SSSToken
    if (config?.param?.AddMemberToken) {
      config.headers.SSSMBID = store.state.User.MBID;
      config.headers.SSSToken = store.state.User.Token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => {
    const resCode = res?.data?.code;
    if (resCode && resCode !== 200) {
      if (resCode === -101) {
        // token驗證失敗(已登入模式)
        window.router.replace({ name: 'Login' });
      }
      message.error(API_ERROR_CODE[resCode]);
      store.commit('SetLoading', false);
      return Promise.reject(res);
    } else {
      return res?.data;
    }
  },
  (err, data) => {
    return Promise.reject(err);
  }
);

export default instance;

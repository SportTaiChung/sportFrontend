import axios from 'axios';
import router from '../router';
import store from '@/store';
import * as message from '@/utils/messageHandler.js';
import API_ERROR_CODE from '@/Config/API_ERROR_CODE';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/data/API' : '/API',
  timeout: 15000,
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  async (config) => {
    if (config.url !== '/datafresh/token' && config?.param?.AddRVfToken) {
      await store.dispatch('getDataFresh').then((res) => {
        config.headers.RVfToken = res.token;
      });
    }
    if (config?.param?.AddMemberToken) {
      config.headers.SSSMBID = store.state.User.MBID;
      config.headers.SSSToken = store.state.User.Token;
    }
    return config;
  },
  // Handle error
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
        router.replace({ name: 'Login' });
      }
      message.error(API_ERROR_CODE[resCode]);
      store.commit('SetLoading', false);
      return Promise.reject(res);
    } else {
      return res?.data;
    }
  },
  (err, data) => {
    // if (err.response.status === 401) {
    //   router.replace({ name: 'Login' });
    // }
    return Promise.reject(err);
  }
);

export default instance;

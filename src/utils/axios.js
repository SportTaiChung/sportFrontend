import axios from 'axios';
import store from '@/store';
import * as message from '@/utils/messageHandler.js';
import API_ERROR_CODE from '@/Config/API_ERROR_CODE';

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('process VUE_APP_UI', process.env.VUE_APP_UI);
console.log('process.env.VUE_APP_BASE_API:', process.env.VUE_APP_BASE_API);
const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/data/api' : process.env.VUE_APP_BASE_API,
  timeout: 15000,
  withCredentials: true,
});

// 發送API前的劫持
instance.interceptors.request.use(
  async (config, data) => {
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

window.LockErrorMessage = false;
window.LockErrorEvent = null;
instance.interceptors.response.use(
  (res) => {
    const resCode = res?.data?.code;
    if (resCode && resCode !== 200) {
      const goLoginPageErrorCode = [-101, -105];
      if (!window.LockErrorMessage) {
        message.error(res?.data?.message);
      }
      if (goLoginPageErrorCode.includes(resCode)) {
        window.LockErrorMessage = true;
        clearTimeout(window.LockErrorEvent);
        setTimeout(() => {
          window.LockErrorMessage = false;
        }, 1000);
        store.dispatch('User/LogoutClearHandler');
      }
      console.error(API_ERROR_CODE[resCode]);
      store.commit('SetLoading', false);
      return Promise.reject(res);
    } else {
      return res?.data;
    }
  },
  (err, data) => {
    store.commit('SetLoading', false);
    console.error('axios catch err:', err);
    message.error(err);
    return Promise.reject(err);
  }
);

export default instance;

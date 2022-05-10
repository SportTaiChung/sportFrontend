import axios from 'axios';
import router from '../router';
import store from '@/store';
import * as message from '@/utils/messageHandler.js';

const instance = axios.create({
  // Api base url
  baseURL: process.env.NODE_ENV === 'development' ? '/data' : '/',
  timeout: 15000,
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  // Handle error
  (err) => {
    return Promise.reject(err);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (res) => {
    // if (res?.data.status === '1004') {
    //   if (res.config.url !== '/api/shopping_cart') {
    //     store.commit('SetLoading', false);
    //     router.replace({ name: 'Login' });
    //   }
    // } else if (res?.data.status === '1005') {
    //   store.commit('SetLoading', false);
    //   router.replace({ name: 'ConsoleLogin' });
    // } else {
    //   if (res?.data.status !== '0000') {
    //     store.commit('SetLoading', false);
    //   }
    // }
    return res?.data;
  },
  // Handle error
  (err, data) => {
    // if (err.response.status === 401) {
    //   router.replace({ name: 'Login' });
    // }
    return Promise.reject(err);
  }
);

export default instance;

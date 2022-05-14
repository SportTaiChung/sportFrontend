import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import VueCarousel from 'vue-carousel';
import axios from 'axios';
import * as message from '@/utils/messageHandler.js';
import * as SportLib from '@/utils/SportLib';
import * as utils from '@/utils/utils';
import * as filters from '@/utils/filters';
import '@/assets/sass/global.scss';
import '@/assets/sass/elementChange.scss';

import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Promise.all([router()]).then(async (res) => {
  // 將router注入到全域 方便axios等使用
  window.router = res[0];

  Vue.prototype.$SportLib = SportLib;
  Vue.prototype.$URL = URL;
  Vue.prototype.$axios = axios;
  Vue.prototype.$MSG = message;
  Vue.prototype.$lib = utils;

  Vue.use(ElementUI);
  Vue.use(VueCarousel);
  Vue.config.productionTip = false;

  new Vue({
    router: window.router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import VueCarousel from 'vue-carousel';
import axios from 'axios';
import * as message from '@/utils/messageHandler.js';
import * as common from '@/utils/common';
import * as utils from '@/utils/utils';
import '@/assets/sass/global.scss';
import '@/assets/sass/elementChange.scss';

import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';

Promise.all([router()]).then(async (res) => {
  const router = res[0];
  Vue.prototype.$common = common;
  Vue.prototype.$URL = URL;
  Vue.prototype.$axios = axios;
  Vue.prototype.$MSG = message;
  Vue.prototype.$lib = utils;

  Vue.use(ElementUI);
  Vue.use(VueCarousel);
  Vue.config.productionTip = false;

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});

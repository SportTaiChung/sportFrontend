import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import VueCarousel from 'vue-carousel';
import axios from 'axios';
import VueVirtualScroller from 'vue-virtual-scroller';

import * as message from '@/utils/messageHandler.js';
import * as SportLib from '@/utils/SportLib';
import * as lib from '@/utils/lib';
import '@/assets/sass/global.scss';
import '@/assets/sass/elementChange.scss';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';

import '@/utils/OddDataList';

// import '@/svgIcon/index.js';

Promise.all([router()]).then(async (res) => {
  // 將router注入到全域 方便axios等使用
  window.router = res[0];

  Vue.prototype.$SportLib = SportLib;
  Vue.prototype.$URL = URL;
  Vue.prototype.$axios = axios;
  Vue.prototype.$MSG = message;
  Vue.prototype.$lib = lib;

  Vue.use(ElementUI);
  Vue.use(VueCarousel);
  Vue.config.productionTip = false;

  new Vue({
    router: window.router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
});

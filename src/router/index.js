import Vue from 'vue';
import VueRouter from 'vue-router';

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/Games',
  },
  {
    path: '/Init',
    name: 'Init',
    component: () => import(/* webpackChunkName: "Init" */ '../views/Init.vue'),
  },
  {
    path: '/Games',
    name: 'Games',
    component: () => import(/* webpackChunkName: "Games" */ '../views/Games.vue'),
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 切換頁面時，回到最頂端
    return {
      x: 0,
      y: 0,
      // behavior: 'smooth',
    };
  },
});

export default router;

import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

export default async () => {
  // 靜態路由
  const routes = [
    {
      path: '/',
      redirect: '/Init',
    },
    {
      path: '/Init',
      name: 'Init',
      component: () => import(/* webpackChunkName: "Init" */ '../views/Init.vue'),
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue'),
    },
    {
      path: '/GameResult',
      name: 'GameResult',
      component: () => import(/* webpackChunkName: "GameResult" */ '../views/GameResult.vue'),
    },
    {
      path: '/TestOddData',
      name: 'TestOddData',
      component: () =>
        import(/* webpackChunkName: "TestTableData" */ '../views/Test/TestOddData.vue'),
    },
    {
      path: '/TestVirtualList',
      name: 'TestVirtualList',
      component: () =>
        import(/* webpackChunkName: "TestVirtualList" */ '../views/Test/TestVirtualList.vue'),
    },
    {
      path: '/TestI18n',
      name: 'TestI18n',
      component: () => import(/* webpackChunkName: "TestI18n" */ '../views/Test/TestI18n.vue'),
    },
  ];

  // 動態路由注入
  const dynamicRoute = [];
  if (process.env.VUE_APP_UI === 'pc') {
    dynamicRoute.push(import('./pc/index'));
  } else {
    dynamicRoute.push(import('./mobile/index'));
  }
  const dynamicRouteRes = await Promise.all(dynamicRoute).then((res) =>
    res.reduce((acc, cur) => [...acc, ...cur.default], [])
  );

  // 動態靜態路由合併
  const finalRoute = [...routes, ...dynamicRouteRes];

  const router = new VueRouter({
    routes: finalRoute,
    scrollBehavior(to, from, savedPosition) {
      // 切換頁面時，回到最頂端
      return {
        x: 0,
        y: 0,
        // behavior: 'smooth',
      };
    },
  });

  // 路由跳轉前劫持
  router.beforeEach((to, from, next) => {
    if (
      store.state.isInit ||
      to.name === 'Init' ||
      to.name === 'Login' ||
      to.name === 'HistoryRecord' ||
      to.name === 'GameResult' ||
      to.name === 'TestOddData' ||
      to.name === 'TestTableData' ||
      to.name === 'TestVirtualList' ||
      to.name === 'TestI18n'
    ) {
      next();
    } else {
      next({ name: 'Init', query: to.query });
    }
  });
  return router;
};

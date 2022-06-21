export default [
  {
    path: '/Games',
    name: 'Games',
    component: () => import(/* webpackChunkName: "Games" */ '../../views/pc/Games.vue'),
  },
  {
    path: '/HistoryRecord',
    name: 'HistoryRecord',
    component: () =>
      import(/* webpackChunkName: "HistoryRecord" */ '../../views/pc/HistoryRecord.vue'),
  },
];

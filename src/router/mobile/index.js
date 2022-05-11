export default [
  {
    path: '/Games',
    name: 'Games',
    component: () => import(/* webpackChunkName: "MobileGames" */ '../../views/mobile/Games.vue'),
  },
];

export default [
  {
    path: '/Games',
    name: 'Games',
    component: () => import(/* webpackChunkName: "Games" */ '../../views/mobile/mGames.vue'),
  },
];

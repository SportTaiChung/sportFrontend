export default [
  {
    path: '/Games',
    name: 'Games',
    component: () => import(/* webpackChunkName: "Games" */ '../../views/pc/Games.vue'),
  },
];

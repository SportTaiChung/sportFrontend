import router from '@/router';

export function getRouteByName(name) {
  const allRoutes = router.options.routes;
  return allRoutes.filter((route) => {
    return route.name === name;
  })[0];
}

export function getLayoutList() {
  const allRoutes = router.options.routes;
  return allRoutes.find((it) => it.name === 'Console').children[1];
}

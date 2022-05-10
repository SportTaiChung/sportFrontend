import router from '@/router';
import store from '@/store';

router.beforeEach((to, from, next) => {
  if (store.state.isInit || to.name === 'Init' || to.name === 'Login') {
    next();
  } else {
    store.commit('SetFirstInWebSiteURL', location.href);
    next({ name: 'Init' });
  }
});

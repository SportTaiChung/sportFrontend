import router from '@/router';
import store from '@/store';

router.beforeEach((to, from, next) => {
  if (store.state.isInit || to.name === 'Init') {
    next();
  } else {
    store.commit('SetFirstInWebSiteURL', location.href);
    next({ name: 'Init' });
  }
});

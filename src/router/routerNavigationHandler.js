import router from '@/router';
import store from '@/store';

router.beforeEach((to, from, next) => {
  if (store.state.isInit || to.name === 'Init' || to.name === 'Login') {
    next();
  } else {
    next({ name: 'Init', query: to.query });
  }
});

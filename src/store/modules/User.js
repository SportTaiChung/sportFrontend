import { login, logout, getUserInfoAbout, getUserInfoCash } from '@/api/User';

export default {
  namespaced: true,
  state: {
    MBID: localStorage.getItem('MBID'),
    Token: localStorage.getItem('Token'),
    UserData: null,
    UserCredit: null,
  },
  getters: {},
  mutations: {
    SetMBID(state, val) {
      state.MBID = val;
      localStorage.setItem('MBID', val);
    },
    SetToken(state, val) {
      state.Token = val;
      localStorage.setItem('Token', val);
    },
    SetUserData(state, val) {
      state.UserData = val;
    },
    SetUserCredit(state, val) {
      state.UserCredit = val;
    },
  },
  actions: {
    Login(store, postData) {
      return new Promise((resolve, reject) => {
        return login({ udomain: document.domain.split('.').slice(-2).join('.'), ...postData })
          .then(async (res) => {
            store.commit('SetMBID', res.data.mb.mbID);
            store.commit('SetToken', res.data.loginID);
            resolve(res);
          })
          .catch(reject);
      });
    },
    Logout(store) {
      return new Promise((resolve, reject) => {
        return logout()
          .then(async (res) => {
            resolve(res);
          })
          .catch(reject)
          .finally(() => {
            // 登出handler
            store.commit('BetCart/clearCart', null, { root: true });
            store.commit('SetToken', '');
            window.router.replace({ name: 'Login' });
          });
      });
    },
    UserInfoAbout(store) {
      return new Promise((resolve, reject) => {
        return getUserInfoAbout()
          .then(async (res) => {
            store.commit('SetUserData', res.data);
            resolve(res);
          })
          .catch(reject);
      });
    },
    GetUserInfoCash(store) {
      return new Promise((resolve, reject) => {
        return getUserInfoCash()
          .then(async (res) => {
            store.commit('SetUserCredit', res.data.CreditSport);
            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};

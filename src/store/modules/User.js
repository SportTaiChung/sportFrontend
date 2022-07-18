import { login, logout, getUserInfoAbout, getUserInfoCash, setNickName } from '@/api/User';

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
      if (val === '') {
        localStorage.removeItem('MBID');
      }
    },
    SetToken(state, val) {
      state.Token = val;
      localStorage.setItem('Token', val);
      if (val === '') {
        localStorage.removeItem('Token');
      }
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
        return login(postData)
          .then(async (res) => {
            store.commit('SetMBID', res.data.mb.mbID);
            store.commit('SetToken', res.data.loginID);
            resolve(res);
          })
          .catch(reject);
      });
    },
    LogoutClearHandler(store) {
      // 登出handler
      store.commit('BetCart/clearCart', null, { root: true });
      store.commit('SetToken', '');
      store.commit('SetMBID', '');
      window.router.replace({ name: 'Login' });
    },
    Logout(store) {
      return new Promise((resolve, reject) => {
        return logout()
          .then(async (res) => {
            resolve(res);
          })
          .catch(reject)
          .finally(() => {
            store.dispatch('LogoutClearHandler');
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
    setNickName(store, postData) {
      return new Promise((resolve, reject) => {
        return setNickName(postData)
          .then((res) => {
            store.state.UserData.RealName = postData.Nickname;
            resolve(res);
          })
          .catch(reject);
      });
    },
  },
};

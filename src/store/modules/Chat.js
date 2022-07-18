import { getDefaultMes } from '@/api/Game';
export default {
  namespaced: true,
  state: {
    ChatList: [],
    isChatInputFocus: false,
    // 快捷訊息
    defaultMSG: [],
  },
  getters: {},
  mutations: {
    SetChatList(state, val) {
      state.ChatList.length = 0;
      state.ChatList = val;
    },
    setChatInputFocus(state, val) {
      state.isChatInputFocus = val;
    },
    setDefaultMSG(state, val) {
      state.defaultMSG = val;
    },
    PushChatList(state, val) {
      state.ChatList.push(val);
    },
    ClearChatList(state, val) {
      state.ChatList.length = 0;
      state.ChatList = [];
    },
  },
  actions: {
    getDefaultMes(store, val) {
      return new Promise((resolve, reject) => {
        return getDefaultMes()
          .then((res) => {
            if (res?.data) {
              store.commit('setDefaultMSG', res.data);
            }
            resolve();
          })
          .catch(reject);
      });
    },
  },
};

export default {
  namespaced: true,
  state: {
    ChatList: [],
  },
  getters: {},
  mutations: {
    SetChatList(state, val) {
      state.ChatList.length = 0;
      state.ChatList = val;
    },
    PushChatList(state, val) {
      state.ChatList.push(val);
    },
    ClearChatList(state, val) {
      state.ChatList.length = 0;
      state.ChatList = [];
    },
  },
  actions: {},
};

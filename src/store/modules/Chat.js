export default {
  namespaced: true,
  state: {
    ChatList: [],
    isChatInputFocus: false,
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

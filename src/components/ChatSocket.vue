<template>
  <div id="ChatSocket"> </div>
</template>

<script>
  export default {
    name: 'ChatSocket',
    data() {
      return {
        isInit: false,
        initEvtID: '',
      };
    },
    created() {
      this.initDefaultMessage();
      window.chat = this;
    },
    computed: {
      User() {
        return this.$store.state.User;
      },
    },
    methods: {
      reset() {
        this.isInit = false;
        this.initEvtID = '';
        this.webSocketObj && this.webSocketObj.close && this.webSocketObj.close();
      },
      initDefaultMessage() {
        this.$store.dispatch('Chat/getDefaultMes');
      },
      initWebsocket(initEvtID, isReconnect = false) {
        this.initEvtID = initEvtID;
        if (this.isInit && !isReconnect) {
          return;
        }
        this.isInit = true;
        this.webSocketObj && this.webSocketObj.close && this.webSocketObj.close();

        this.webSocketObj = new WebSocket(
          `wss://${process.env.VUE_APP_CHAT_API}/roomsocket/roomsocket`
        );
        this.webSocketObj.onmessage = this.onMessage;
        this.webSocketObj.onopen = this.onOpen;
        this.webSocketObj.onerror = this.onError;
        this.webSocketObj.onclose = this.onClose;
      },
      onOpen() {
        if (this.webSocketObj.readyState === 1) {
          // - readyState 等于1 的时候建立链接成功
          this.reconnectTime = 0;
        }
      },
      onMessage(evt) {
        if (evt !== undefined) {
          // 其他解析測試
          // a.replace('@','####:####').replace('[','####:####').split("####:####")
          // const formatData = evt.data.split(/@|\[/);
          const formatData = evt.data
            .replace('@', '####:####')
            .replace('[', '####:####')
            .split('####:####');
          const eventName = formatData[1];
          const data = formatData[2];
          // console.log('onMessage:', formatData, eventName, data);

          if (eventName === 'init') {
            this.APILoginMB();
          } else if (eventName === 'APINowMes') {
            this.$store.commit('Chat/SetChatList', JSON.parse(data).data);
          } else if (eventName === 'APISendMes') {
            const parseData = JSON.parse(data);
            if (parseData?.data.length !== 0) {
              this.$store.commit('Chat/PushChatList', parseData.data[0]);
            }
          }
        }
      },
      onError() {
        console.warn('socket onError!');
        this.ReconnectSocket();
      },
      onClose() {
        console.warn('socket onClose!');
        this.ReconnectSocket();
      },
      ReconnectSocket() {
        if (this.reconnectTime <= 5) {
          setTimeout(() => {
            this.initWebsocket(true);
            this.reconnectTime++;
          }, 2000);
        }
      },
      APILoginMB() {
        const postData = {
          mbID: this.User.MBID,
          token: this.User.Token,
          EvtID: this.initEvtID,
        };
        this.webSocketObj.send(`@APILoginMB[${JSON.stringify(postData)}`);
      },
      SendMessage(message) {
        this.webSocketObj.send(message);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #ChatSocket {
  }
</style>

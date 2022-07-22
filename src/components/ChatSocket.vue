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
        isReconnectLock: null,
        timeOutEvent: null,
      };
    },
    created() {
      this.initDefaultMessage();
      window.chat = this;
    },
    destroyed() {
      clearTimeout(this.timeOutEvent);
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
        this.lockReconnect();
        this.webSocketObj && this.webSocketObj.close && this.webSocketObj.close();
      },
      initDefaultMessage() {
        this.$store.dispatch('Chat/getDefaultMes');
      },
      initWebsocket(initEvtID, isReconnect = false) {
        this.initEvtID = initEvtID;
        if (this.isInit && !isReconnect) {
          this.changeRoom(initEvtID);
          return;
        }
        this.lockReconnect();
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

          // else if (eventName === 'APIsayHi') {
          //   this.webSocketObj.send('@APIsayHi[]');
          // }
        }
      },
      onError() {
        console.warn('socket onError!');
        this.ReconnectSocket();
      },
      onClose() {
        if (this.isReconnectLock) {
          return;
        }
        console.warn('socket onClose!');
        this.ReconnectSocket();
      },
      ReconnectSocket() {
        if (this.reconnectTime <= 5) {
          console.log('ReconnectSocket', this.reconnectTime);
          this.initWebsocket(this.initEvtID, true);
          this.reconnectTime++;
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
      changeRoom(initEvtID) {
        this.webSocketObj.send(`@APILoginMBEvtIDChangeRoom[${initEvtID}`);
      },
      SendMessage(message) {
        console.log('this.webSocketObj:', this.webSocketObj, this.webSocketObj?.readyState);
        if (this.webSocketObj.readyState !== 1) {
          this.initWebsocket(this.initEvtID, true);
          setTimeout(this.initWebsocket, 1000);
        } else {
          this.webSocketObj.send(message);
        }
      },
      lockReconnect() {
        this.isReconnectLock = true;
        clearTimeout(this.timeOutEvent);
        this.timeOutEvent = setTimeout(() => {
          this.isReconnectLock = false;
        }, 2000);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #ChatSocket {
  }
</style>

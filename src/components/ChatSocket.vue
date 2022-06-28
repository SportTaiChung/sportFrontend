<template>
  <div id="ChatSocket"> </div>
</template>

<script>
  export default {
    name: 'ChatSocket',
    data() {
      return {};
    },
    created() {
      this.initWebsocket();
    },
    computed: {
      User() {
        return this.$store.state.User;
      },
    },
    methods: {
      initWebsocket() {
        if (WebSocket) {
          this.webSocketObj = new WebSocket(
            `wss://${process.env.VUE_APP_CHAT_API}/roomsocket/roomsocket`
          );
          this.webSocketObj.onmessage = this.onMessage;
          this.webSocketObj.onopen = this.onOpen;
          this.webSocketObj.onerror = this.onError;
          this.webSocketObj.onclose = this.onClose;
        }
        // var testScoket = new WebSocket(
        //   `wss://${process.env.VUE_APP_CHAT_API}/roomsocket/roomsocket`
        // );

        // testScoket.onopen = function (e) {
        //   if (e != undefined) {
        //     console.log({ error: 'connect', mes: 'opened', obj: e });
        //   }
        // };
        // testScoket.onclose = function (e) {
        //   if (e != undefined) {
        //     console.log({ error: 'close', mes: 'closed', obj: e });
        //   }
        // };

        // testScoket.onmessage = function (e) {
        //   if (e != undefined) {
        //     console.log({ error: 'received', mes: e.data, obj: e });
        //   }
        //   // socket.close();
        // };
        // testScoket.onerror = function (e) {
        //   if (e != undefined) {
        //     console.log({ error: 'error', mes: e.data, obj: e });
        //   }
        // };
      },
      onOpen() {
        if (this.webSocketObj.readyState === 1) {
          // - readyState 等于1 的时候建立链接成功
          this.wsHeartflag = true;
          this.reconnectTime = 0;
        }
      },
      onMessage(evt) {
        if (evt !== undefined) {
          // 其他解析測試
          // a.replace('@','####:####').replace('[','####:####').split("####:####")
          const formatData = evt.data.split(/@|\[/);
          const eventName = formatData[1];
          const data = formatData[2];
          console.log('onMessage:', eventName, JSON.parse(data));
          if (eventName === 'init') {
            this.APILoginMB();
          }
          this.onClose();
        }
      },
      onError() {
        // 链接失败，进行重连
        clearTimeout(this.wsHeart);
        this.wsHeartflag = false;
        if (this.reconnectTime <= 3) {
          setTimeout(() => {
            this.onOpen();
            this.reconnectTime += 1;
          }, 5000);
        } else {
          // 无法连接到聊天服务器
          this.onClose();
        }
      },
      onClose() {
        this.wsHeartflag = false;
        this.webSocketObj && this.webSocketObj.close && this.webSocketObj.close();
      },
      APILoginMB() {
        const postData = {
          mbID: this.User.MBID,
          token: this.User.Token,
        };
        this.webSocketObj.send(`@APILoginMB[${JSON.stringify(postData)}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #ChatSocket {
  }
</style>

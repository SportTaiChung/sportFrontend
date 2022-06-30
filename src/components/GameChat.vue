<template>
  <div id="GameChat">
    <div class="chatContainer" v-if="!isChatEnable">
      <div class="OpenChatBlock off"> </div>
      <div class="ChatInputBlock"> 大家好~ </div>
      <div class="ChatSubmitBlock"> </div>
    </div>

    <div class="chatContainer" v-else>
      <div class="OpenChatBlock on"> </div>
      <div class="ChatInputBlock"> 大家好~ </div>
      <div class="ChatSubmitBlock"> </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GameChat',
    data() {
      return {
        isChatEnable: false,
      };
    },
  };
</script>

<style lang="scss" scoped>
  #GameChat {
    height: 100%;
    .chatContainer {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .OpenChatBlock {
        display: block;
        width: 26px;
        height: 26px;
        display: block;
        &.on {
          background: url(~@/assets/img/common/chat/btn_chatroom.svg) no-repeat center bottom;
          background-size: 100% 200%;
        }
        &.off {
          background: url(~@/assets/img/common/chat/btn_chatroom.svg) no-repeat center top;
          background-size: 100% 200%;
        }
      }
      .ChatInputBlock {
        width: 270px;
        height: 40px;
        line-height: 40px;
        background-color: white;
        border-radius: 5px;
        color: gray;
        font-size: 16px;
        padding: 0 10px;
      }
      .ChatSubmitBlock {
        width: 50px;
        height: 40px;
        background-image: url(~@/assets/img/common/chat/icon_send.svg);
        background-position: center !important;
        background-size: 100%;
        width: 26px;
        height: 26px;
        display: block;
      }
    }
  }
</style>

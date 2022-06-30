<template>
  <div id="GameChat">
    <div class="chatContainer" v-if="!isChatEnable" @click="chatContainerClick">
      <div class="OpenChatBlock off"> </div>
      <div class="ChatInputBlock"> 大家好~ </div>
      <div class="ChatSubmitBlock"> </div>
    </div>

    <div class="chatContainer" v-else>
      <div class="ChatListBlock">
        <div class="chat-history" ref="history">
          <template v-for="(it, index) in ChatList">
            <div class="msg-wrap" :class="isSelfMessage(it.mbID) ? 'self' : ''" :key="index">
              <div class="msg-row">
                <div class="msg">
                  {{ it.Mes }}
                </div>
              </div>
              <div class="time">
                {{ funnyFormat(it.CreateTime) }}
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="OpenChatBlock on" @click="chatContainerClick"> </div>
      <div class="QuickMSGBlock"></div>
      <div class="ChatInputBlockOn">
        <input
          type="text"
          v-model="chatMessage"
          @keydown.enter="sendMessage"
          @focusin="focusin"
          @focusout="focusout"
        />
      </div>
      <div class="ChatSubmitBlock" @click="sendMessage"> </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GameChat',
    data() {
      return {
        isChatEnable: false,
        chatMessage: '',
      };
    },
    computed: {
      ChatList() {
        return this.$store.state.Chat.ChatList;
      },
    },
    watch: {
      isChatEnable() {
        this.$nextTick(() => {
          this.scrollBottom();
        });
      },
      ChatList: {
        handler() {
          this.scrollBottom();
        },
        immediate: true,
      },
    },
    methods: {
      focusin() {
        this.$store.commit('Chat/setChatInputFocus', true);
      },
      focusout() {
        this.$store.commit('Chat/setChatInputFocus', false);
      },
      chatContainerClick() {
        this.isChatEnable = !this.isChatEnable;
      },
      sendMessage() {
        window.chat.SendMessage(this.chatMessage);
        this.chatMessage = '';
      },
      scrollBottom() {
        if (this.$refs.history !== undefined) {
          this.$nextTick(() => {
            const view = this.$refs.history;
            view.scrollTo({ top: view.scrollHeight });
          });
        }
      },
      isSelfMessage(mbID) {
        return this.$store.state.User.MBID === mbID;
      },
      funnyFormat(data) {
        const createTimeStr = data.toString();
        return `${createTimeStr[8]}${createTimeStr[9]}:${createTimeStr[10]}${createTimeStr[11]}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  #GameChat {
    width: 100%;
    height: 100%;
    position: relative;
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
      %InputBlockStyle {
        width: 270px;
        height: 40px;
        line-height: 40px;
        background-color: white;
        border-radius: 5px;
        color: gray;
        font-size: 16px;
        padding: 0 10px;
      }
      .ChatInputBlock {
        @extend %InputBlockStyle;
      }
      .ChatInputBlockOn {
        @extend %InputBlockStyle;
        width: 240px;
        input {
        }
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
      .QuickMSGBlock {
        background: url(~@/assets/img/common/chat/btn_quickMsg.svg) no-repeat center top;
        background-size: 100% 200%;
        width: 23px;
        height: 23px;
        display: block;
      }
      .ChatListBlock {
        position: absolute;
        bottom: 60px;
        background-color: white;
        width: 100%;
        height: 200px;
        .chat-history {
          &::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          &::-webkit-scrollbar:vertical {
            width: 6px;
          }

          &::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background-color: rgba(0, 0, 0, 0.3);
          }
          flex-grow: 1;
          display: flex;
          flex-flow: column nowrap;
          align-items: flex-start;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 10px;
          height: 200px;
          .msg-wrap {
            display: flex;
            max-width: 450px;
            margin-bottom: 20px;
            margin-right: 20px;
            .msg-row {
              display: flex;
              flex-flow: row nowrap;

              .avatar {
                flex-shrink: 0;
                width: 45px;
                height: 45px;
                border: 1px solid #000;
                border-radius: 50rem;
                background-color: #333;
                overflow: hidden;
                margin-right: 20px;
                img {
                  width: 100%;
                }
              }
              .msg {
                color: #444;
                padding: 12px 20px;
                line-height: 26px;
                font-size: 16px;
                min-height: 50px;
                border-radius: 7px;
                display: inline-block;
                position: relative;
                background: #efefef;

                &::after {
                  position: absolute;
                  content: ' ';
                  bottom: 0;
                  height: 0;
                  width: 0;
                  border: 0 solid transparent;
                  pointer-events: none;
                  border-right-color: #efefef;
                  border-width: 10px;
                  transform: translateX(-100%);
                  left: 0;
                  top: 30%;
                }
              }
              .msgPhoto {
                display: block;
                max-width: 100%;
                margin: 0 auto;
              }
            }
            .time {
              margin: 0 8px;
              color: #6c757d;
              font-size: 1.23rem;
              text-align: center;
              display: flex;
              align-items: flex-end;
            }

            &.self {
              align-self: flex-end;
              flex-flow: row-reverse;

              .avatar {
                display: none;
              }
              .msg {
                background-color: #e8f1f3;
                &::after {
                  border-left-color: #e8f1f3;
                  border-right-color: transparent;
                  transform: translateX(100%);
                  right: 0;
                  left: unset;
                }
              }
            }
          }
        }
      }
    }
  }
</style>

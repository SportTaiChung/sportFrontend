<template>
  <div id="GameChat">
    <div class="chatContainer">
      <!-- 對話紀錄 -->
      <div class="chat-list-view" v-show="isChatEnable" :class="isExtended ? 'extended' : ''">
        <i class="btn-hide el-icon-close" @click="toggleChatRoom()"></i>
        <i
          class="btn-extend el-icon-arrow-up"
          :class="isExtended ? 'active' : ''"
          @click="toggleHeight()"
        ></i>
        <div class="chat-history" ref="history">
          <template v-for="(it, index) in ChatList">
            <div class="UserName" :key="'name' + index" v-if="!isSelfMessage(it.mbID)">
              {{ it.Name }}
            </div>
            <div class="msg-wrap" :class="isSelfMessage(it.mbID) ? 'self' : ''" :key="index">
              <div class="msg-row">
                <div class="msg"> {{ it.Mes }} </div>
              </div>
              <div class="time">
                {{ funnyFormat(it.CreateTime) }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 操作區 -->
      <div class="chat-control">
        <!-- 遮罩 -->
        <div class="cover" v-if="!isChatEnable" @click="toggleChatRoom()"></div>
        <div class="btn-toggleChat" :class="isChatEnable ? '' : 'active'" @click="toggleChatRoom()">
        </div>
        <div
          class="btn-quickMsg"
          :class="isShowQuickMsgList ? 'active' : ''"
          @click="isShowQuickMsgList = !isShowQuickMsgList"
        ></div>
        <div class="input-wrap">
          <input
            ref="input"
            type="text"
            :placeholder="placeholder"
            v-model="chatMessage"
            @keydown.enter="sendMessage"
            @focusin="focusin"
            @focusout="focusout"
          />
        </div>
        <div class="btn-submit" @click="sendMessage"> </div>
      </div>

      <!-- 快選訊息 list -->
      <ul class="quickMsgList" :class="isShowQuickMsgList ? 'active' : ''">
        <li
          v-for="(str, i) in quickMsgList"
          :key="i"
          @click="
            chatMessage = str;
            isShowQuickMsgList = false;
          "
          >{{ str }}
        </li>
      </ul>
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
        placeholder: '大家好~',
        isExtended: false,
        isShowQuickMsgList: false,
        quickMsgList: [
          '哈摟大家好~',
          '各位觀眾，進球!!!',
          '三分球!',
          '左手只是輔助。 ',
          '安安幾歲住哪~',
          '開~通殺!!',
        ],
      };
    },
    computed: {
      ChatList() {
        return this.$store.state.Chat.ChatList;
      },
    },
    watch: {
      isChatEnable(enabled) {
        this.$nextTick(() => {
          if (enabled) {
            this.scrollBottom();
            this.placeholder = '請輸入文字...';
            this.$refs.input.focus();
          } else {
            this.chatMessage = '';
            this.placeholder = '大家好~';
            this.isExtended = false;
            this.isShowQuickMsgList = false;
          }
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
      toggleChatRoom() {
        this.isChatEnable = !this.isChatEnable;
      },
      toggleHeight() {
        this.isExtended = !this.isExtended;
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
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    ::-webkit-scrollbar {
      -webkit-appearance: none;
    }

    ::-webkit-scrollbar:vertical {
      width: 6px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.3);
    }

    .chatContainer {
      position: relative;
      height: 100%;
      display: flex;
      flex-flow: column;
      justify-content: flex-end;
      pointer-events: none;
      & > * {
        pointer-events: auto;
      }
      .cover {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: 200ms ease;
        &:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }
      }
      .chat-control {
        flex-shrink: 0;
        position: relative;
        display: flex;
        height: 60px;
        width: 100%;
        align-items: center;
        background-color: #333;
        padding: 0 1.5rem;
        z-index: 10;
        .btn-toggleChat {
          flex-shrink: 0;
          width: 26px;
          height: 26px;
          cursor: pointer;
          background: url(~@/assets/img/common/chat/btn_chatroom.svg);
          background-position: center top;
          background-repeat: no-repeat;
          background-size: 100% 200%;
          &.active {
            background-position: center bottom;
          }
          &:hover {
            opacity: 0.7;
          }
        }
        .btn-quickMsg {
          flex-shrink: 0;
          width: 23px;
          height: 23px;
          background: url(~@/assets/img/common/chat/btn_quickMsg.svg);
          background-size: 100% 200%;
          background-repeat: no-repeat;
          background-position: center top;
          margin: 0 0 0 1.5rem;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }

          &.active {
            background-position: center bottom;
          }
        }
        .input-wrap {
          flex-grow: 1;
          height: calc(100% - 20px);
          line-height: 40px;
          background-color: white;
          border-radius: 5px;
          color: gray;
          font-size: 16px;
          padding: 0 10px;
          margin: 0 1.5rem;
          cursor: pointer;
          input {
            border: none !important;
            width: 100%;
          }
        }
        .btn-submit {
          flex-shrink: 0;
          width: 26px;
          height: 26px;
          background-image: url(~@/assets/img/common/chat/icon_send.svg);
          background-position: center !important;
          background-repeat: no-repeat;
          background-size: 100%;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        }
      }
      .chat-list-view {
        position: relative;
        width: 100%;
        height: 250px;
        overflow: hidden;
        border-top: 2px solid #bbb;
        background-color: #fff;
        box-shadow: 0px -15px 10px -15px rgba(0, 0, 0, 0.3);
        transition: height 500ms ease;

        &.extended {
          height: 100%;
        }

        i.btn-hide {
          position: absolute;
          right: 0.35rem;
          top: 0.5rem;
          font-size: 2rem;
          font-weight: 600;
          color: #888;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          z-index: 1;
          &:hover {
            color: #000;
          }
        }
        i.btn-extend {
          position: absolute;
          right: 0.35rem;
          top: 3rem;
          font-size: 2rem;
          font-weight: 600;
          color: #888;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          z-index: 1;
          &:hover {
            color: #000;
          }
          &.active {
            transform: rotate(180deg);
          }
        }

        .chat-history {
          padding: 10px;
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          .UserName {
            margin-bottom: 5px;
          }
          .msg-wrap {
            display: flex;
            margin-bottom: 1rem;
            margin-right: 1rem;
            // margin-left: 1rem;
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
                padding: 10px 18px;
                line-height: normal;
                font-size: 16px;
                min-height: 2rem;
                border-radius: 7px;
                display: inline-block;
                position: relative;
                background: #efefef;

                // &::after {
                //   position: absolute;
                //   content: ' ';
                //   bottom: 0;
                //   height: 0;
                //   width: 0;
                //   border: 0 solid transparent;
                //   pointer-events: none;
                //   border-right-color: #efefef;
                //   border-width: 10px;
                //   transform: translateX(-100%);
                //   left: 0;
                //   top: 20%;
                // }
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
              margin-right: 1.5rem;

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
      ul.quickMsgList {
        position: absolute;
        bottom: 60px;
        width: 100%;
        height: 250px;
        overflow-y: auto;
        transform: translateY(100%);
        transition: 300ms ease;
        background: rgba(42, 79, 107, 0.9);
        opacity: 0.5;
        z-index: 2;
        &.active {
          opacity: 1;
          transform: translateY(0);
        }

        li {
          border-bottom: 1px solid #547894;
          line-height: 40px;
          color: #fff;
          font-size: 1.3rem;
          padding: 0 0.8rem;
          cursor: pointer;
          &:hover {
            background-color: rgba(0, 107, 214, 0.8);
          }
        }
      }
    }
  }
</style>

<template>
  <div id="ServiceChat" :class="isOpen ? 'open' : ''">
    <div class="overlay" @click="close()"></div>
    <div class="panel">
      <div class="header">
        <h5>{{ $t('Login.CustomerService') }}</h5>
        <div class="btn-close" @click="close()"></div>
      </div>

      <div class="body">
        <div class="container">
          <div class="chat-header">
            <img src="@/assets/img/common/service/avatar8.png" class="avatar" />
            <div class="info">
              <div class="name"> {{ $t('Login.CustomerService') }} 冰冰 </div>
              <div class="status"> {{ $t('Common.Online') }} </div>
            </div>
          </div>

          <div class="chat-history" ref="history">
            <template v-for="(msg, index) in history">
              <div class="msg-wrap" :class="isSelfMessage(msg.getName) ? 'self' : ''" :key="index">
                <div class="msg-row">
                  <div class="avatar">
                    <img src="@/assets/img/common/service/avatar8.png" />
                  </div>
                  <div class="msg">
                    <template v-if="msg.Content.indexOf('{{FileImage}}') >= 0">
                      <img class="msgPhoto" :src="parseImgUrl(msg.Content)" @load="imgLoadDone()" />
                    </template>
                    <template v-else>
                      {{ msg.Content }}
                    </template>
                  </div>
                </div>
                <div class="time">{{ msg.CreateTimestr }}</div>
              </div>
            </template>
          </div>

          <div class="chat-input">
            <div class="btn-file-uploader" @click="$refs.fileInput.click()">
              <i class="el-icon-picture"></i>
              <input type="file" ref="fileInput" accept="image/*" style="display: none" />
            </div>
            <div class="input">
              <input
                type="text"
                v-model="modelInput"
                @keypress.enter="sendMseeage"
                :placeholder="$t('Common.InputMessage')"
              />
            </div>
            <div class="btn-submit" @click="sendMseeage">
              <i class="el-icon-s-promotion"></i>
            </div>
          </div>
        </div>

        <div class="loadingMask" :class="isLoading ? 'show' : ''">
          <i class="el-icon-loading"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ServiceChat',
    props: {
      isOpen: {
        type: Boolean,
      },
      serviceQuestion: {
        type: String,
      },
    },
    data() {
      return {
        modelInput: '',
        historyTimer: null,
        history: [],
        fileInput: null,
        isLoading: false,
        unreadCount: 0,
      };
    },
    computed: {
      isGuestMode() {
        return this.$router.currentRoute.name === 'Login';
      },
    },
    mounted() {
      this.fileInput = this.$refs.fileInput;
      this.fileInput.onchange = (e) => {
        var file = e.target.files[0];
        if (file.size > 3000000) {
          console.log('file is too large');
          this.$notify.error({ message: '檔案大小需小於 3MB' });
          return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file); // read as base64
        reader.onload = (readerEvent) => {
          const base64str = readerEvent.target.result;
          // console.log(base64str);
          const result = base64str.split(',')[1];
          // console.log(result);
          this.sendFile({ base64File: result, name: file.name });
        };
        reader.onerror = (error) => {
          console.error(error);
          this.$notify.error({ message: error });
        };
      };

      // 定時更新紀錄
      this.historyTimer = setInterval(() => {
        if (this.isOpen) {
          this.getHistory(true);
        }
      }, 5000);

      // 定時更新未讀數
      this.checkUnreadTimer = setInterval(() => {
        if (!this.isOpen) {
          this.getCountMse();
        }
      }, 8000);

      this.modelInput = this.serviceQuestion;
    },
    watch: {
      isOpen(newValue) {
        if (newValue === true) {
          this.getHistory();
          this.modelInput = this.serviceQuestion;
        }
      },
      unreadCount(newValue) {
        this.$emit('updateUnreadCount', newValue);
      },
    },
    methods: {
      close() {
        this.$emit('closeMe');
      },
      scrollToBottom(callback) {
        const view = this.$refs.history;
        view.scrollTo({ top: view.scrollHeight, behavior: 'smooth' });
        callback && callback();
      },
      // 取得對話紀錄
      getHistory(isBehindUpdate = false) {
        if (!this.isOpen) {
          return;
        }
        if (!isBehindUpdate) {
          this.isLoading = true;
        }
        this.$store
          .dispatch('Game/GetQAHistory', { isGuestMode: this.isGuestMode })
          .then((res) => (this.history = res.data.reverse()))
          .finally(() => {
            this.isLoading = false;
            this.scrollToBottom(() => {
              this.sendReadMes();
            });
          });
      },
      // 取得未讀數
      getCountMse() {
        this.$store
          .dispatch('Game/GetCountMes', { isGuestMode: this.isGuestMode })
          .then((res) => (this.unreadCount = res.data))
          .finally(() => {});
      },
      // 標示已讀
      sendReadMes() {
        this.$store.dispatch('Game/SendReadMes', { isGuestMode: this.isGuestMode }).then(() => {
          this.unreadCount = 0;
        });
      },
      sendMseeage() {
        if (!this.isLoading && this.modelInput.trim()) {
          const message = this.modelInput;
          this.modelInput = '';
          this.isLoading = true;
          this.$store
            .dispatch('Game/SendQAMessage', { message, isGuestMode: this.isGuestMode })
            .then((res) => this.getHistory())
            .finally(() => (this.isLoading = false));
        }
      },
      sendFile({ base64File, name }) {
        this.isLoading = true;
        this.$store
          .dispatch('Game/SendQAFile', { base64File, name, isGuestMode: this.isGuestMode })
          .then(() => this.getHistory())
          .finally(() => (this.isLoading = false));
      },
      parseImgUrl(str) {
        return str.split('{{FileImage}}')[1];
      },
      imgLoadDone() {
        this.scrollToBottom();
      },
      isSelfMessage(name) {
        return name !== 'Service';
      },
    },
    beforeDestroy() {
      clearInterval(this.historyTimer);
      clearInterval(this.checkUnreadTimer);
    },
  };
</script>

<style lang="scss" scoped>
  #ServiceChat {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
    overflow: hidden;
    display: flex;

    &.open {
      pointer-events: auto;
      .overlay {
        opacity: 1;
      }
      .panel {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      opacity: 0;
      transition: 350ms ease;
    }

    .panel {
      display: flex;
      flex-direction: column;
      width: calc(100% - 50px);
      height: 70%;
      max-height: 800px;
      max-width: 700px;
      overflow: hidden;
      margin: auto;
      border-radius: 6px;
      background-color: #fff;
      box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.4);
      font-size: 1.23rem;
      transform: translateY(-60px);
      opacity: 0;
      transition: 350ms ease;

      .header {
        flex: 0 1;
        padding: 1.23rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #dee2e6;
        h5 {
          color: #38a688;
          font-size: 1.538rem;
          margin: 0;
          font-size: 1.538rem;
          font-weight: 500;
          line-height: 1.5;
        }
        .btn-close {
          background-image: url('~@/assets/img/common/close.svg');
          background-repeat: no-repeat;
          background-position: center;
          height: 1.23rem;
          width: 1.23rem;
          margin-left: auto;
          opacity: 0.5;
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        }
      }

      .body {
        flex: 1;
        padding: 1.23rem;
        overflow: auto;
        position: relative;

        .container {
          display: flex;
          flex-flow: column nowrap;
          height: 100%;
          padding: 8px;
          position: relative;

          .chat-header {
            flex-shrink: 0;
            display: flex;
            padding-bottom: 20px;
            border-bottom: 2px solid #f4f7f6;
            box-shadow: 0px 15px 10px -15px rgba(0, 0, 0, 0.4);
            z-index: 1;

            img.avatar {
              width: 40px;
              height: 40px;
              border-radius: 50rem;
              border: none;
              outline: none;
              overflow: hidden;
              background-color: #333;
            }

            .info {
              display: flex;
              flex-flow: column nowrap;
              justify-content: space-evenly;
              padding-left: 1rem;
              .name {
              }
              .status {
                font-size: 1rem;
                color: #198754;
              }
            }
          }
          .chat-history {
            flex-grow: 1;
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 10px;

            .msg-wrap {
              display: inline-flex;
              flex-direction: column;
              max-width: 400px;
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
                margin: 10px auto;
                color: #6c757d;
                font-size: 1.23rem;
                text-align: center;
              }

              &.self {
                align-self: flex-end;
                .msg-row {
                  flex-flow: row-reverse;
                }
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

          .chat-input {
            flex-shrink: 0;
            display: flex;
            align-items: stretch;
            height: 46px;
            border-radius: 0.25rem;
            overflow: hidden;
            & > div {
              height: 100%;
            }
            .btn-file-uploader,
            .btn-submit {
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0 10px;
              cursor: pointer;
            }
            .btn-file-uploader {
              background-color: #fff;
              border: 1px solid #ced4da;
              border-radius: 0.25rem 0 0 0.25rem;
              border-width: 1px 0 1px 1px;
              &:hover {
                background: #f0f0f0;
              }
              &:active {
                background: #dddddd;
              }
              i {
                font-size: 22px;
                color: #000;
              }
            }
            .btn-submit {
              padding: 0 10px;
              border-radius: 0 0.25rem 0.25rem 0;
              background-color: #38a688;
              width: 60px;
              &:hover {
                filter: brightness(1.1);
              }
              &:active {
                filter: brightness(0.9);
              }
              i {
                font-size: 22px;
                color: #fff;
              }
            }
            .input {
              flex-grow: 1;
              border: 1px solid #ced4da;
              input {
                width: 100%;
                height: 100%;
                border: 0;
                padding: 0 1rem;
              }
            }
          }
        }

        .loadingMask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          // border-radius: 0.25rem;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
          opacity: 0;
          pointer-events: none;
          transition: 200ms ease;

          &.show {
            opacity: 1;
          }

          i {
            color: #fff;
            font-size: 40px;
          }
        }
      }
    }
  }
</style>

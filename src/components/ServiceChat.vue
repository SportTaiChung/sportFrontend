<template>
  <div id="ServiceChat" :class="isOpen ? 'open' : ''">
    <div class="overlay" @click="close()"></div>
    <div class="panel">
      <div class="header">
        <h5>專屬客服</h5>
        <div class="btn-close" @click="close()"></div>
      </div>

      <div class="body">
        <div class="container">
          <div class="chat-header">
            <img src="" class="avatar" />
            <div class="info">
              <div class="name"> 專屬客服 冰冰 </div>
              <div class="status"> 在線中 </div>
            </div>
          </div>

          <div class="chat-history">
            <div class="msg-wrap">
              <div class="msg-row">
                <div class="avatar"> </div>
                <div class="msg">
                  您好，歡迎來到新體育，請先點擊以下問題分類，讓我能夠更快的為您服務
                </div>
              </div>
              <div class="time">2分鐘前</div>
            </div>

            <div class="msg-wrap self">
              <div class="msg-row">
                <div class="avatar"> </div>
                <div class="msg">
                  您好，歡迎來到新體育，請先點擊以下問題分類，讓我能夠更快的為您服務
                </div>
              </div>
              <div class="time">2分鐘前</div>
            </div>
          </div>

          <div class="chat-input">
            <div class="btn-file-uploader">
              <i class="el-icon-picture"></i>
            </div>
            <div class="input">
              <input type="text" />
            </div>
            <div class="btn-submit">
              <i class="el-icon-s-promotion"></i>
            </div>
          </div>
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
        default: false,
      },
    },
    methods: {
      close() {
        this.$emit('closeMe');
      },
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
      height: 70vh;
      max-height: 700px;
      max-width: 500px;
      overflow: hidden;
      margin: 15vh auto auto auto;
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
        .container {
          display: flex;
          flex-flow: column nowrap;
          height: 100%;
          padding: 8px;

          .chat-header {
            flex-shrink: 0;
            display: flex;
            padding-bottom: 20px;
            border-bottom: 2px solid #f4f7f6;

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
                  margin-top: 15px;
                }
                .msg {
                  color: #444;
                  padding: 18px 20px;
                  line-height: 26px;
                  font-size: 16px;
                  min-height: 60px;
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
              }
            }
          }
        }
      }
    }
  }
</style>

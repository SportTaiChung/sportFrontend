<template>
  <div class="login-container">
    <div class="video-container">
      <video
        class="login-video"
        src="@/assets/login_video.mp4"
        autoplay=""
        loop=""
        playsinline=""
        webkit-playsinline="webkit-playsinline"
        muted="true"
      ></video>
    </div>

    <div class="main-container">
      <img src="@/assets/logo2.png" alt="" class="logo" />
      <div class="login-card" :body-style="cardCss">
        <div class="login-content">
          <div class="input-group">
            <img src="@/assets/img/common/account.png" />
            <input
              autocomplete="off"
              :placeholder="$t('Login.Account')"
              v-model="formData.username"
              @keydown.enter="handleLogin"
            />
          </div>
          <div class="input-group">
            <img src="@/assets/img/common/password.png" />
            <div
              class="btn-show-pwd"
              :class="isShowPassword ? 'on' : ''"
              @click="isShowPassword = !isShowPassword"
            >
            </div>
            <input
              autocomplete="new-password"
              name="new-password"
              :placeholder="$t('Login.Password')"
              show-password
              v-model="formData.password"
              :type="isShowPassword ? 'text' : 'password'"
              @keydown.enter="handleLogin"
            />
          </div>
        </div>
        <button class="btn-login" @click="handleLogin"> {{ $t('Login.MemberLogin') }} </button>

        <div class="line-other">
          <div class="line"></div>
          <div class="text">or</div>
          <div class="line"></div>
        </div>

        <div class="other-items">
          <!-- <div class="item">
            <img src="@/assets/img/common/password.png" />
            先去逛逛
          </div> -->
          <div class="item" @click="isOpenServicePanel = true">
            <img src="@/assets/img/common/service.png" />
            {{ $t('Login.CustomerService') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 客服面板 -->
    <ServicePanel
      :isOpen="isOpenServicePanel"
      @closeMe="isOpenServicePanel = false"
      @openServiceChat="openServiceChat"
    ></ServicePanel>

    <!-- 客服聊天室窗 -->
    <ServiceChat
      :isOpen="isOpenServiceChat"
      :serviceQuestion="serviceQuestion"
      @closeMe="isOpenServiceChat = false"
    ></ServiceChat>
  </div>
</template>

<script>
  import ServicePanel from '@/components/ServicePanel';
  import ServiceChat from '@/components/ServiceChat';
  export default {
    components: {
      ServicePanel,
      ServiceChat,
    },
    data() {
      return {
        formData: {
          username: '',
          password: '',
        },
        isOpenServicePanel: false,
        isOpenServiceChat: false,
        isShowPassword: false,
        serviceQuestion: '',
      };
    },
    computed: {
      cardCss: {
        get() {
          return {
            display: 'flex',
            'flex-direction': 'column',
            gap: '15px',
          };
        },
      },
    },
    created() {
      window.auto = this.auto;
    },
    methods: {
      handleLogin() {
        this.$store.commit('SetLoading', true);

        this.$store
          .dispatch('User/Login', {
            mbID: this.formData.username,
            pw: this.formData.password,
            siteid: 1,
            verCode: '5688',
          })
          .then((res) => {
            this.$router.replace({ name: 'Init' });
          });
      },
      openServiceChat(issue) {
        this.serviceQuestion = issue;
        this.isOpenServiceChat = true;
      },
      auto() {
        this.$store
          .dispatch('User/Login', {
            mbID: 'abcd_a13',
            pw: '123456789',
            siteid: 1,
            verCode: '5688',
          })
          .then((res) => {
            this.$router.replace({ name: 'Init' });
          });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ebeef5;

    .video-container {
      position: fixed;
      right: 0;
      bottom: 0;
      min-width: 100%;
      min-height: 100%;
      video.login-video {
        position: absolute;
        min-width: 100%;
        min-height: 100%;
        width: auto;
        height: auto;
        z-index: 1;
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
      }
    }

    .main-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10;
      width: 100%;

      img.logo {
        margin-top: -1.5rem;
        max-width: 200px;
      }

      .login-card {
        display: flex;
        flex-direction: column;
        background-color: rgba(255, 255, 255, 0.3);
        width: calc(100vw - 50px);
        min-width: 370px;
        max-width: 480px;
        padding: 1.8rem;
        border-radius: 1rem;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);

        .login-content {
          display: flex;
          flex-direction: column;
          margin-bottom: 3rem;
          gap: 1.2rem;

          .input-group {
            position: relative;
            width: 100%;

            img {
              position: absolute;
              left: 0.4rem;
              top: 50%;
              transform: translateY(-50%);
              height: calc(100% - 0.8rem);
            }

            input {
              width: 100%;
              height: 2.76rem;
              border: 0;
              border-radius: 3rem;
              background: rgba(0, 0, 0, 0.4);
              box-shadow: none;
              padding: 0 1rem;
              color: #fff;
              font-size: 1.3rem;
              text-align: center;
              &::placeholder {
                color: #eee;
              }
              &:hover,
              &:focus {
                background: rgba(255, 255, 255, 0.4) !important;
                color: #fff;
              }
            }

            .btn-show-pwd {
              position: absolute;
              right: 15px;
              top: 50%;
              height: 1.25rem;
              width: 1.25rem;
              background: url('~@/assets/img/common/eye-solid.svg');
              background-position: center;
              background-repeat: no-repeat;
              transform: translateY(-50%);
              cursor: pointer;
              &.on {
                &::after {
                  display: none;
                }
              }
              &::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 22px;
                height: 1px;
                background: #fff;
                transform: translate(-50%, -50%) rotate(45deg);
                z-index: 10;
              }
            }
          }
        }

        .btn-login {
          height: 2.5rem;
          width: 75% !important;
          border: 1px solid #dee2e6 !important;
          border-radius: 50rem !important;
          background-color: rgba(56, 166, 136, 0.5);
          color: #fff;
          padding: 0 1rem;
          font-size: 1.25rem;
          text-align: center;
          margin: 0 auto;
          transition: 300ms;
          &:not(:disabled) {
            cursor: pointer;
          }
          &:active,
          &:hover {
            background-color: rgba(56, 166, 136, 0.85);
          }
        }

        div.line-other {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          margin: 3rem 2rem;
          opacity: 0.5;
          .text {
            color: #dee2e6;
            font-size: 1.66rem;
            padding: 0 1rem;
          }

          .line {
            flex: 1;
            border-bottom: 1px solid #dee2e6;
          }
        }

        div.other-items {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-content: center;
          gap: 2rem;
          margin: 0 2rem;
          .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 1rem;
            color: #fff;
            cursor: pointer;
            img {
              max-width: 30px;
              height: auto;
              margin-bottom: 0.5rem;
              opacity: 0.85;
            }
            &:hover,
            &:active {
              img {
                opacity: 1;
              }
            }
          }
        }

        .tipText {
          color: #ff0000;
          font-size: 14px;
          text-align: center;
          line-height: 20px;
        }
      }
    }
  }
</style>

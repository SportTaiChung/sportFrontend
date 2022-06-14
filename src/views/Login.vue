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
            <img
              src="data:image/png;base64,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"
            />
            <input autocomplete="off" placeholder="帳號" v-model="formData.username" />
          </div>
          <div class="input-group">
            <img
              src="data:image/png;base64,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"
            />
            <input
              autocomplete="off"
              placeholder="密碼"
              show-password
              v-model="formData.password"
            />
          </div>
        </div>
        <button class="btn-login" @click="handleLogin"> 會員登入 </button>

        <div class="line-other">
          <div class="line"></div>
          <div class="text">or</div>
          <div class="line"></div>
        </div>

        <div class="other-items">
          <!-- <div class="item">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAYAAADhu0ooAAAEZUlEQVRoge2bW4hVVRjHf3NG8zaaiYnlg4GRBiK99W7llSLygmEXFF80nxVBBDGMHn0oeukmeEGtfImoRGrUTE0z7SKGlEYyKDUzOZYiuuXz/A9u9lrnNGf2XmsfxT9szpm11t77/Nf3rbW+77/WtCVJQovhCWAXcAnoBD4HjgM9wL8D/amtSPQj4AV9vwb8Dfwm0nuA79UJV507G6DViI4AfgUecmpu4x/gG+Br4Jg64Qxwo9GDYxMdBSwExgNDUuX2fRXwCHAEGOvc6cd14CzwI/ADcBQ4BHRlW8ckOg3YATxm73Vqq2WPAgebIJqFufMFWbhTVj8M9MUiapb8AnjSqbkNIzoJ+DYHUR/+BJZXPBUhMFWzaRmYALw5KNKLR2TGJHKz2gQyzLmjWDwei6hvfCzTeLTf0O7UFoxYRH2oLQtREGuM+hDcimmUSTQq7hFtElOAecDD0X55kyiC6ELNnjsUvj3jtGgB5CXaAawARutZZtHdrUi2CItm18jhSrVmFPyeXMj7A/qAtzwJ8UhgGzBTf59TzFkaiuhpUwOWO6UwBvhYZE8BLwLdTqtIKMqlNgNLnNKqG++SG+8DngWuOK0ioMixUyObdeMOubGRPQA8p/Ko47bIl1km8oFm4SzGpCaoL4GXgYtOq5CwxDvA9WriR1+SJDP0vornvZOSJLnovTMnQrmPufFS4L9MueWl22VZX+oWDKGIGon368zGD8iNowYVoSeED4GXnNLqBPVJJqgIipo41qYwzqfO1eoH2imXgZXAG55nmPq+SGo8gcSxWzCFYbA01deA++qMnXbpOr66/uBanTbWuTuB2Vp6gsEs+pR6NGrGn4EtNeNCWrSiNa5MkoYH9RlsJq5Iyj/r1MTFbr2t3hyRGzZGTwPztYM1MkCvJnquBfVDndrqtoEvTi6cqOE7XSFgVtpSh2SnJJgepyYQ0ZDP3yaPyeKAUrgo2UzIgOH+BiT3aUmJlrKFImqWfKcOSVs+FmjXOhpCuG6b0rVFTk11o3amctahd7JFO0RysVNTteTT0pk2adM3GookatuCbwOvODXV7fbnNbuuUXIeVWEo0nXfrWNJc9dZIrkaeN1pEQFF9OowpWM+kmZJi6V7ZcmNTos7hKh5xLo67npQQlivzi6sLVPIzuu6teM0WViUNTel446S9Fka8vaw5ZnnM2XHJZOkxeqGh51iIC9RW/TX67SXBe+fAnNixK7NoohZd4/GoK2hf3kE7JZAUctLd5n7Kv3Bva39uw1lEu1zSgKizANVtv7+LmHOZuytTosCUSbRDfqsKLULSbQrluv2ehLtQboqIdU/ecuWWBY9AeyXfBIDV3QM/ahi7s9iEb2qbcT3pDCkQ8L2lEUHYtlExP4AvtJ1TCexe2rybcwx2qXw0A4pT0zpx0NSBHt1Tv7/0C3R/RcJbaYN/9zonlb8dxA7wTI5U2Ye8ZOyIttZOKnkod8CWysSna4tCrOuWWqvXNGyJHPH5gHcBMcyu+Wd0vdcAAAAAElFTkSuQmCC"
            />
            先去逛逛
          </div> -->
          <div class="item">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAYAAADhu0ooAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REI0RDc5NTc1RDQ4MTFFQ0FDRENEREM1RTlDRjg1MDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REI0RDc5NTg1RDQ4MTFFQ0FDRENEREM1RTlDRjg1MDUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEQjRENzk1NTVENDgxMUVDQUNEQ0REQzVFOUNGODUwNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEQjRENzk1NjVENDgxMUVDQUNEQ0REQzVFOUNGODUwNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr+jBSsAAAb5SURBVHja7JsJbJRF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"
            />
            專屬客服
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formData: {
          username: 'abcd_a13',
          password: '123456789',
        },
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
    },
  };
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    width: 100vw;
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
      margin-bottom: 20vh;

      img.logo {
        margin-top: -1.5rem;
        max-width: 200px;
      }

      .login-card {
        display: flex;
        flex-direction: column;
        background-color: rgba(255, 255, 255, 0.3);
        width: calc(100vw - 50px);
        min-width: 250px;
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
                background: rgba(255, 255, 255, 0.4);
                color: #555;
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

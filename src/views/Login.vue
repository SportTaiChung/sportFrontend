<template>
  <div class="login-container">
    <el-container>
      <el-main class="main-container">
        <el-card class="login-card" shadow="never" :body-style="cardCss">
          <h2> 登入</h2>
          <div class="login-content">
            <el-input
              autocomplete="off"
              placeholder="請輸入帳號"
              v-model="formData.username"
              @keyup.enter.native="handleLogin"
            />
            <el-input
              autocomplete="off"
              placeholder="請輸入密碼"
              show-password
              v-model="formData.password"
              @keyup.enter.native="handleLogin"
            />
          </div>
          <el-button type="primary" @click="handleLogin"> 登錄 </el-button>
        </el-card>
      </el-main>
    </el-container>
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
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ebeef5;
    .main-container {
      display: flex;
      justify-content: center;
      .login-card {
        max-width: 400px;
        width: 100%;
        h2 {
          font-size: 16px;
          color: #4f4f4f;
          text-align: center;
        }
        .login-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
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
  .el-button--primary:focus {
    outline-color: #66b1ff;
  }
</style>

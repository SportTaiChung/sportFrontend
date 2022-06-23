<template>
  <div id="PersonalPanel" @click.stop="onMaskClick">
    <div class="popup">
      <div class="header">
        <div class="title"> 個人設置 </div>
        <div class="btn-close" @click.stop="onMaskClick"></div>
      </div>

      <div class="body">
        <div class="row">
          <div class="rowTitle"> 帳號</div>
          <div class="rowContent accountBlock">
            {{ $store.state.User.MBID }}
          </div>
        </div>
        <div class="row">
          <div class="rowTitle"> 暱稱</div>
          <div class="rowContent">
            <el-input
              v-model="nickName"
              :suffix-icon="inputIcon"
              @focus="inputFocus"
              @blur="inputBlur"
            ></el-input>
          </div>
        </div>
        <div class="row">
          <div class="rowTitle"> 語系</div>
          <div class="rowContent">
            <el-select v-model="lang" @change="newLang">
              <el-option
                v-for="item in langOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PersonalPanel',
    components: {},
    data() {
      return {
        nickName: '',
        lastNickName: '',
        lang: 'tw',
        langOptions: [
          {
            value: 'tw',
            label: '繁體中文',
          },
          {
            value: 'cn',
            label: '简体中文',
          },
        ],
        isFocus: false,
      };
    },
    created() {
      this.nickName = this.$store.state.User.UserData.RealName;
      this.lastNickName = this.nickName;
      this.lang = this.$store.state.Lang;
    },
    computed: {
      inputIcon() {
        if (this.isFocus) {
          return 'el-icon-success';
        } else {
          return '';
        }
      },
    },
    methods: {
      newLang(lang) {
        this.$store.commit('SetLang', lang);
        location.reload();
      },
      // 離開
      onMaskClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('closeMe');
      },
      inputFocus() {
        this.isFocus = true;
      },
      inputBlur() {
        this.isFocus = false;

        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('User/setNickName', {
            Nickname: this.nickName,
          })
          .then((res) => {
            this.lastNickName = this.nickName;
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
            });
          })
          .catch(() => {
            this.nickName = this.lastNickName;
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
    },
  };
</script>

<style lang="scss">
  .el-input__suffix {
    .el-input__icon {
      font-size: 18px;
      cursor: pointer;
    }
  }
</style>
<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #PersonalPanel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

    .popup {
      width: calc(100vw - 50px);
      max-width: 350px;
      max-height: 80%;
      background-color: #eee;
      overflow: hidden;

      .header {
        @include base-background();
        position: relative;
        .title {
          color: #fff;
          font-size: 1.2rem;
          text-align: center;
          height: 40px;
          line-height: 40px;
        }
        .btn-close {
          position: absolute;
          top: 0;
          right: 0;
          height: 40px;
          width: 40px;
          background: url('~@/assets/img/pc/btn_close_w.svg') no-repeat center;
          background-size: 13px;
          opacity: 0.5;
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        }
        .btn-help {
          cursor: pointer;
          font-family: Arial;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto 8px;
          border-radius: 50%;
          color: #fff;
          background-color: #136146;
          height: 25px;
          width: 25px;
          line-height: 26px;
          text-align: center;
          font-size: 17px;
          font-weight: bold;
        }
      }
      .line {
        height: 1px;
        background: #ccc;
        margin: 0 1.5rem;
      }
      .body {
        display: flex;
        flex-direction: column;
        max-height: 70%;
        overflow: auto;
        padding: 15px 20px;
        .row {
          display: flex;
          height: 40px;
          margin-bottom: 15px;
          .rowTitle {
            font-size: 18px;
            color: gray;
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .rowContent {
            width: calc(100% - 100px);
          }
          .accountBlock {
            background-color: rgb(204, 200, 200);
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgb(110, 110, 110);
            font-size: 18px;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="setUp">
    <div class="setUp_L">
      <span class="setUp_color">02-20 18:45:00</span>
      <div>
        <img alt="" class="icon" src="@/assets/img/sun1.svg" @click="changeTheme('light')" />
        <img alt="" class="icon" src="@/assets/img/yue.svg" @click="changeTheme('dark')" />
      </div>
    </div>
    <div class="setUp_C">
      <span>自動接收最佳賠率 <el-checkbox v-model="checked"></el-checkbox></span>
      <el-divider direction="vertical"></el-divider>
      <span class="yellow_color">聯盟選擇</span>
      <el-divider direction="vertical"></el-divider>
      <el-divider direction="vertical"></el-divider>
      <el-dropdown @command="handleHot" trigger="click">
        <span class="el-dropdown-link">
          {{ HotValue }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, key) in HotList" :key="key" :command="item.label">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-divider direction="vertical" class="margin-0"></el-divider>
    </div>
    <div class="setUp_R">
      <span class="setUp_color">快速投註</span>
      <input v-model="input" v-show="quick_bet" placeholder="請輸入金額" class="setUp_input" />
      <el-switch v-model="quick_bet" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
      <i class="el-icon-question"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GamesSetup',
    data() {
      return {
        quick_bet: false, // 快速投注开关
        checked: '',
        listValue: '含本金',
        input: '',
        list: [
          { value: '0', label: '含本金' },
          { value: '1', label: '不含本金' },
        ],
        HotValue: '時間排序',
        HotList: [
          { value: '0', label: '時間排序' },
          { value: '1', label: '熱門排序' },
        ],
      };
    },
    components: {},
    mounted() {},
    methods: {
      changeTheme(value) {
        this.$store.commit('SetThemeInfo', value);
      },
      closeProject(value) {
        this.listValue = value.label;
      },
      closeHotValue(value) {
        this.HotValue = value.label;
      },
      handleCommand(command) {
        this.listValue = command;
      },
      handleHot(command) {
        this.HotValue = command;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  @import '@/assets/sass/global.scss';

  .setUp_color {
    margin-right: 10px;
    @include base-fontColor();
  }

  .setUp {
    color: #fff;
    height: 38px;
    font-size: 13px;
    @include background-color-hederTop();
    width: 100%;
    display: flex;
    .setUp_L {
      width: 200px;
      display: inline-flex;
      justify-content: space-around;
      align-items: center;
      height: 100%;
      > div {
        height: 100%;
        display: inline-flex;
        align-items: center;
        img {
          height: 25px;
          width: 25px;
          margin: 1px 5px;
          cursor: pointer;
        }
      }
    }
    .setUp_C {
      flex: 1;
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      .margin-0 {
        margin: 0 0 0 8px;
      }
      .el-dropdown {
        width: 70px;
        font-size: 12px;
        cursor: pointer;
        @include base-fontColor();
        > span {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .setUp_R {
      width: 300px;
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 10px;
      i {
        font-size: 20px;
        color: #000000;
        margin-left: 10px;
      }
      .setUp_input {
        width: 110px;
        height: 25px;
        border-radius: 3px;
        background-color: #333;
        padding: 0 10px;
        border: none;
        color: #fff;
        outline: none;
        margin: 0 10px;
      }
    }
  }
</style>

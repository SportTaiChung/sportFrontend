<template>
  <div class="headerTop">
    <div class="headerTop_logo">
      <img alt="" src="@/assets/img/pc/upbet.png" />
    </div>
    <div class="headerTop_nav">
      <el-menu
        :default-active="activeIndex"
        class="color_text"
        mode="horizontal"
        text-color="#fff"
        @select="handleSelect"
      >
        <el-menu-item index="1">即時比分</el-menu-item>
        <el-menu-item index="2">賽果</el-menu-item>
        <el-menu-item index="3">規則</el-menu-item>
        <el-menu-item index="4" @click="OpenPopupCenter">投註記錄</el-menu-item>
      </el-menu>
    </div>
    <div class="headerTop_userinfo">
      <ul>
        <li>{{ userName }}</li>
        <li v-if="userCredit">$ {{ userCredit }}</li>
        <li><i class="el-icon-phone-outline"></i></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GamesHeader',
    data() {
      return {
        activeIndex: '4',
      };
    },
    created() {
      this.callUserInfoAbout();
      this.callGetUserInfoCash();
    },
    computed: {
      userName() {
        return this.$store.state.User.UserData?.Name;
      },
      userCredit() {
        return this.$store.state.User.UserCredit;
      },
    },
    methods: {
      callGetUserInfoCash() {
        this.$store.dispatch('User/GetUserInfoCash');
      },
      callUserInfoAbout() {
        this.$store.dispatch('User/UserInfoAbout');
      },
      OpenPopupCenter() {
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        var popupwidth = width * 0.6;
        var popupheight = height * 0.6;
        var top = (height - popupheight + 20) / 2;
        var left = (width - popupwidth) / 2;

        var historyRecord = this.$router.resolve({
          path: 'historyRecord',
        });

        return window.open(
          historyRecord.href,
          '111',
          'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
            popupwidth +
            ', height=' +
            popupheight +
            ', top=' +
            top +
            ', left=' +
            left
        );
      },
      handleSelect() {},
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  .headerTop {
    width: 100%;
    height: 100%;
    display: flex;
    line-height: 70px;
    color: #fff;
    .headerTop_logo {
      width: 200px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .headerTop_nav {
      flex: 1;
      display: inline-flex;
      align-items: center;
      padding-right: 100px;
      justify-content: center;
      .el-menu {
        @include base-background();
        display: inline-flex;
        border: none;
      }
    }
    .headerTop_userinfo {
      width: 300px;
      display: flex;
      justify-content: flex-end;
      padding-right: 20px;
      ul {
        display: inline-flex;
        li {
          margin-right: 15px;
        }
      }
    }
  }

  .el-menu--horizontal > .el-menu-item {
    height: 60px;
    line-height: 70px;
  }

  .el-menu--horizontal > .el-menu-item.is-active {
    color: #ffea01;
    border-bottom: 2px solid #fff;
  }
  .el-menu-item:hover {
    @include base-background();
  }
</style>

<template>
  <div class="headerTop">
    <div class="headerTop_logo">
      <img alt="" src="@/assets/img/pc/upbet.png" />
    </div>
    <div class="headerTop_nav">
      <el-menu
        :default-active="activeIndex"
        class="headerMenu"
        mode="horizontal"
        text-color="#fff"
        @select="handleSelect"
      >
        <el-menu-item index="1" @click="jumpLink('scoreLive')">即時比分</el-menu-item>
        <el-menu-item index="2">賽果</el-menu-item>
        <el-menu-item index="3" @click="jumpLink('rule')">規則</el-menu-item>
        <el-menu-item index="4" @click="OpenPopupCenter">投註記錄</el-menu-item>
      </el-menu>
    </div>
    <div class="headerTop_userinfo">
      <ul>
        <li>{{ userName }}</li>
        <li v-if="userCredit">$ {{ userCredit }}</li>
        <li
          ><img
            src="@/assets/img/common/icon_header_service.svg"
            class="icon-service"
            title="聯絡客服"
            @click="openService()"
        /></li>
        <li>
          <img
            src="@/assets/img/common/logout.svg"
            class="logoutIcon"
            title="登出"
            alt=""
            @click="logout"
          />
        </li>

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
      jumpLink(linkKey) {
        this.WindowOpen(this.$conf.JumpLink[linkKey]);
      },
      callGetUserInfoCash() {
        this.$store.dispatch('User/GetUserInfoCash');
      },
      callUserInfoAbout() {
        this.$store.dispatch('User/UserInfoAbout');
      },
      WindowOpen(href) {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const popupwidth = width * 0.6;
        const popupheight = height * 0.6;
        const top = (height - popupheight + 20) / 2;
        const left = (width - popupwidth) / 2;
        return window.open(
          href,
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
      OpenPopupCenter() {
        const historyRecord = this.$router.resolve({
          path: 'historyRecord',
        });
        this.WindowOpen(historyRecord.href);
      },
      handleSelect() {
        this.activeIndex = '1';
        setTimeout(() => {
          this.activeIndex = '4';
        }, 1);
      },
      openService() {
        this.$emit('openService');
      },
      logout() {
        this.$store.commit('SetLoading', true);
        this.$store.dispatch('User/Logout').finally(() => {
          this.$store.commit('SetLoading', false);
        });
      },
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
    .headerMenu {
      .el-menu-item {
        background-color: transparent !important;
        border-bottom: 0px !important;
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
        i {
          font-size: 20px;
          padding-top: 24px;
          cursor: pointer;
        }
        .logoutIcon {
          width: 20px;
          height: 20px;
          margin-top: 24px;
          color: white;
          cursor: pointer;
        }
        .icon-service {
          width: 20px;
          height: 20px;
          margin-top: 24px;
          color: white;
          cursor: pointer;
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

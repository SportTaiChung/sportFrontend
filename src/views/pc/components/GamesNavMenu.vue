<template>
  <div id="GamesNavMenu" :style="navHeaderStyleJudge">
    <div class="nav_header" v-show="!isNavMenuCollapse">
      <ul>
        <li
          v-for="(item, i) in showGameTypeList"
          :key="i"
          :class="gameTypeID === item.key ? 'activeState' : ''"
          @click="gameTypeClickHandler(item.key)"
        >
          {{ item.value }}
        </li>
      </ul>
      <div class="Collapse C_show">
        <i class="el-icon-arrow-left" @click="setNavMenuCollapse(!isNavMenuCollapse)"></i>
      </div>
    </div>
    <div class="nav_header nav_header1" v-show="isNavMenuCollapse">
      <div class="Collapse C_hide">
        <i class="el-icon-arrow-left" @click="setNavMenuCollapse(!isNavMenuCollapse)"></i>
      </div>
    </div>
    <el-menu
      ref="elMenu"
      class="el-menu-vertical-demo color_text"
      :default-active="menuActiveString"
      :collapse="isNavMenuCollapse"
      :unique-opened="true"
      :collapse-transition="false"
    >
      <el-submenu index="状态" class="collapse_GameType" v-show="isNavMenuCollapse">
        <template slot="title">
          <i class="Collapse_i">{{ showHiddenCollapseText }}</i>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="(item, i) in []" :key="i">{{ item.value }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu v-for="(menuData, i) in gameStore.MenuList" :key="i" :index="i + ''">
        <template slot="title">
          <i class="el-icon-basketball"></i>
          <div class="flex nav_bottom" @click.stop="menuItemClickHandler(menuData, null, i)">
            <span class="nav_text">{{ menuData.catName }}</span>
            <span class="nav_number">{{ menuData.count }}</span>
          </div>
        </template>
        <el-menu-item-group v-show="menuData.Items.length > 0">
          <el-menu-item
            v-for="(Items, y) in menuData.Items"
            :key="y"
            :index="i + '-' + y"
            @click="menuItemClickHandler(menuData, Items.WagerTypeKey, i)"
          >
            <template slot="title">
              <div class="nav_bottom_item">
                <!-- <span class="subMenuItemText">{{ Items.WagerTypeName }}</span> -->
                <span class="nav_text">{{ Items.WagerTypeName }}</span>
                <span class="nav_number">{{ Items.count }}</span>
              </div>
            </template>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'GamesNavMenu',
    props: {
      isNavMenuCollapse: {
        type: Boolean,
        require: true,
      },
    },
    data() {
      return {
        menuActiveString: '',
        intervalEvent: null,
        intervalEvent2: null,
      };
    },
    mounted() {
      if (this.gameStore.MenuList.length !== 0) {
        // 一進入頁面預設選取第一個
        this.menuItemClickHandler(this.gameStore.MenuList[0], null, 0);
      }

      // 定時更新遊戲賠率
      this.intervalEvent = setInterval(() => {
        this.$store.dispatch('Game/GetGameDetailSmall');
        this.$store.dispatch('MoreGame/GetMoreGameDetailSmall');
      }, 10000);

      // 定時更新遊戲Menu
      this.intervalEvent2 = setInterval(() => {
        this.$store.dispatch('Game/GetMenuGameCatList', false).then((menuRes) => {
          const menuIndex = this.gameStore.MenuList.findIndex((menuData) => {
            return menuData.catid === this.gameStore.selectCatID;
          });
          if (menuIndex > -1) {
            this.menuActiveString = `${menuIndex}-0`;
          } else {
            this.menuActiveString = `999-0`;
            this.hideMenuChildren();
          }
        });
      }, 20000);
    },
    beforeDestroy() {
      clearInterval(this.intervalEvent);
      clearInterval(this.intervalEvent2);
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      showGameTypeList() {
        return this.$store.getters['Game/showGameTypeList'];
      },
      gameTypeID() {
        return this.$store.state.Game.selectGameType;
      },
      showHiddenCollapseText() {
        return this.showGameTypeList.find((it) => it.key === this.gameTypeID)?.value;
      },
      navHeaderStyleJudge() {
        if (this.isNavMenuCollapse) {
          return 'width:64px;min-width:64px';
        } else {
          return 'width:200px;min-width:200px';
        }
      },
    },
    methods: {
      setNavMenuCollapse(val) {
        this.$emit('update:isNavMenuCollapse', val);
      },
      // 早盤,今日,滾球...等等切換點擊事件
      gameTypeClickHandler(gameType) {
        this.$store.commit('Game/setGameType', gameType);
        const menuData = this.gameStore.FullMenuList.find((menu) => menu.GameType === gameType);
        let catid = 1;
        if (menuData.LeftMenu.item.length !== 0) {
          catid = menuData.LeftMenu.item[0].catid;
        }
        this.menuActiveString = '0-0';
        this.callGetGameDetail(catid, null);
        this.$store.dispatch('Game/GetMenuGameCatList', true);
      },
      callGetGameDetail(CatID, WagerTypeKey = null) {
        this.$store.commit('SetLoading', true);

        let postData = null;
        postData = {
          GameType: this.gameTypeID,
          CatID,
          WagerTypeKey,
        };
        this.$store.dispatch('Game/GetGameDetail', postData).then((res) => {
          console.log(
            'getGameDetail done GameType CatID WagerTypeKey',
            this.gameTypeID,
            CatID,
            WagerTypeKey
          );
          this.$store.commit('SetLoading', false);
        });
      },
      hideMenuChildren() {
        this.$refs.elMenu.openedMenus.length = 0;
        this.$refs.elMenu.openedMenus = [];
      },
      menuItemClickHandler(catData, WagerTypeKey, catIndex, isDefaultSystemSelect = false) {
        let clickCatID = null;
        let clickWagerTypeKey = null;
        clickCatID = catData.catid;
        // 父親層級被點
        if (WagerTypeKey === null) {
          // 除了系統預設選擇的,點選單父層時,需要關閉其他球類已展開的兒子
          if (this.$refs.elMenu.openedMenus?.length && !isDefaultSystemSelect) {
            this.hideMenuChildren();
          }

          this.menuActiveString = `${catIndex}-0`;
          if (catData.Items.length === 0) {
            clickWagerTypeKey = 1;
          } else {
            clickWagerTypeKey = catData.Items[0].WagerTypeKey;
          }
        } else {
          clickWagerTypeKey = WagerTypeKey;
        }

        // 獲取遊戲detail
        this.callGetGameDetail(clickCatID, clickWagerTypeKey);
      },
    },
  };
</script>

<style lang="scss">
  @import '@/assets/sass/theme/mixin.scss';
  @import '@/assets/sass/theme/themeVariable.scss';
  //覆蓋主題
  #app[data-theme='light'] {
    #GamesNavMenu {
      background: $GamesNavMenu_BG_COLOR;
      .el-menu-item.is-active {
        .nav_text {
          color: $nav_submenu_active_text !important;
        }
      }
      .el-submenu {
        border-bottom: 1px solid $GamesNavMenu_submenu_border_bottom_color;
      }
    }
  }
  #app[data-theme='dark'] {
    #GamesNavMenu {
      background: $GamesNavMenu_BG_COLOR1;
      .el-menu-item.is-active {
        .nav_text {
          color: $nav_submenu_active_text1 !important;
        }
      }
      .el-submenu {
        border-bottom: 1px solid $GamesNavMenu_submenu_border_bottom_color1;
      }
    }
  }

  #GamesNavMenu {
    .el-menu {
      border: 0px;

      .el-menu-item {
        padding-right: 0px !important;
      }
      .el-menu-item-group__title {
        padding: 0px;
      }
      .el-submenu {
        .el-submenu__title {
          height: 35px;
          line-height: 35px;
          &:hover {
            @include hover_color();
          }
        }
        .el-menu-item {
          height: 35px;
          line-height: 35px;
          @include menu_item_bg();
        }
        &.is-active {
          @include nav_menu_active_bg();
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  .activeState {
    border-bottom: 3px solid #ffffff;
  }
  .nav_header {
    height: 35px;
    line-height: 35px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    @include nav-headrtcolor();
    @include nav-headrtBgcolor();

    .Collapse {
      display: inline-flex;
      align-items: center;

      i {
        font-size: 20px;
        cursor: pointer;
      }
      i:hover {
        color: #dadada;
        font-weight: bold;
      }
    }
    .C_show {
      width: 25%;
      justify-content: flex-end;
    }
    .C_hide {
      width: 100%;
      justify-content: center;
    }
    ul {
      display: inline-flex;
      justify-content: space-around;
      font-size: 13px;
      width: 75%;
      li {
        text-align: center;
        height: 27px;
        line-height: 27px;
        cursor: pointer;
      }
    }
  }
  .nav_header1 {
    width: 63px;
    border-bottom: 1px solid #88b4a5;
  }
  .Collapse_i {
    font-size: 13px;
    color: #ffffff;
  }

  .nav_bottom {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  .nav_bottom_item {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
    padding: 0 15px 0 25px;
  }
  .nav_text {
    @include nav-TopTextcolor();
    font-size: 13px;
  }

  .nav_number {
    @include nav-TopTextNumbercolor();
    font-size: 13px;
  }

  .el-submenu {
    border-bottom: 1px solid #bbb;
  }
  .el-submenu__title {
    font-size: 13px;
    @include nav-TopBgcolor();
    i {
      margin: 0;
    }
  }

  .el-menu {
    @include nav-TopBgcolor();
  }
</style>

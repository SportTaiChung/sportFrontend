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
      :default-active="defaultActive"
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
      <el-submenu v-for="(catData, i) in gameStore.BallTypeList" :key="i" :index="i + ''">
        <template slot="title">
          <i class="el-icon-basketball"></i>
          <div class="flex nav_bottom" @click.stop="menuItemClickHandler(catData, null, i)">
            <span class="nav_text">{{ catData.catName }}</span>
            <span class="nav_number">{{ catData.count }}</span>
          </div>
        </template>
        <el-menu-item-group v-show="catData.Items.length > 0">
          <el-menu-item
            v-for="(Items, y) in catData.Items"
            :key="y"
            :index="i + '-' + y"
            @click="menuItemClickHandler(catData, Items.WagerTypeKey, i)"
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
        defaultActive: '',
        intervalEvent: null,
      };
    },
    mounted() {
      if (this.gameStore.BallTypeList.length !== 0) {
        // 一進入頁面預設選取第一個
        this.menuItemClickHandler(this.gameStore.BallTypeList[0], null, 0);
      }

      // 10秒打一次
      // this.intervalEvent = setInterval(() => {
      //   this.$store.dispatch('Game/GetGameDetailSmall');
      // }, 10000);
    },
    beforeDestroy() {
      clearInterval(this.intervalEvent);
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      showGameTypeList() {
        return this.$store.getters['Game/showGameTypeList'];
      },
      gameTypeID() {
        return parseInt(this.$route.query.gameType);
      },
      showHiddenCollapseText() {
        return this.showGameTypeList.find((it) => it.key === this.gameTypeID).value;
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
      callGetMenuGameCatList() {
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('Game/GetMenuGameCatList', { gtype: this.gameTypeID })
          .then((res) => {
            if (res.data.item.length !== 0) {
              // 手動切換gameType時,系統預設選擇第一個球種
              this.menuItemClickHandler(this.gameStore.BallTypeList[0], null, 0, true);
            } else {
              // 如果選擇gameType,menu回傳陣列為空,那就清除gameList資料
              this.$store.dispatch('Game/ClearSelectData');
            }
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
      callGetGameDetail(CatID, WagerTypeKey) {
        let postData = null;

        //* Test 測試CODE 指定數據
        if (false) {
          postData = {
            GameType: 1,
            CatID: 102,
            WagerTypeKey: 1,
          };
        } else {
          postData = {
            GameType: this.gameTypeID,
            CatID,
            WagerTypeKey,
          };
        }
        this.$store.dispatch('Game/GetGameDetail', postData).then((res) => {
          console.log(
            'getGameDetail done GameType CatID WagerTypeKey',
            this.gameTypeID,
            CatID,
            WagerTypeKey
          );
        });
      },
      gameTypeClickHandler(key) {
        this.$router.replace({
          name: this.$route.name,
          query: { ...this.$route.query, gameType: key },
        });
        this.callGetMenuGameCatList();
      },
      menuItemClickHandler(catData, WagerTypeKey, catIndex, isDefaultSystemSelect = false) {
        let clickCatID = null;
        let clickWagerTypeKey = null;
        clickCatID = catData.catid;
        // 父親層級被點
        if (WagerTypeKey === null) {
          // 除了系統預設選擇的,點選單父層時,需要關閉其他球類已展開的兒子
          if (this.$refs.elMenu.openedMenus?.length && !isDefaultSystemSelect) {
            this.$refs.elMenu.openedMenus.length = 0;
            this.$refs.elMenu.openedMenus = [];
          }

          this.defaultActive = `${catIndex}-0`;
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

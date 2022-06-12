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
      class="el-menu-vertical-demo"
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
      <template v-for="(menuData, i) in includeFavoriteMenuList" :index="i + ''">
        <el-submenu v-if="menuData.Items.length !== 0" :key="i" :index="i.toString()">
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
                  <span class="nav_text">{{ Items.WagerTypeName }}</span>
                  <span class="nav_number">{{ Items.count }}</span>
                </div>
              </template>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :key="i.toSt" :index="i.toString()" class="singleMenuItem">
          <i class="el-icon-basketball"></i>
          <div class="flex nav_bottom" @click.stop="menuItemClickHandler(menuData, null, i)">
            <span class="nav_text">{{ menuData.catName }}</span>
            <span class="nav_number">{{ menuData.count }}</span>
          </div>
        </el-menu-item>
      </template>
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
        this.menuItemClickHandler(this.gameStore.MenuList[0], null, 1);
      }

      // 定時更新遊戲賠率
      this.intervalEvent = setInterval(() => {
        if (this.isFavoriteMode) {
          this.$store.dispatch('Game/GetFavoriteGameDetailSmall');
        } else {
          this.$store.dispatch('Game/GetGameDetailSmall');
        }
      }, 10000);

      // 定時更新遊戲Menu
      this.intervalEvent2 = setInterval(() => {
        this.$store.dispatch('Game/GetMenuGameCatList', false).then((menuRes) => {
          const menuIndex = this.gameStore.MenuList.findIndex((menuData) => {
            return menuData.catid === this.gameStore.selectCatID;
          });
          if (menuIndex === -1) {
            this.hideMenuChildren();
          }
        });
      }, 15000);
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
      selectCatID() {
        return this.$store.state.Game.selectCatID;
      },
      isCallGameDetailAPI() {
        return this.$store.state.Game.isCallGameDetailAPI;
      },
      isFavoriteMode() {
        return this.selectCatID === -999;
      },
      selectWagerTypeKey() {
        return this.$store.state.Game.selectWagerTypeKey;
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
      tableSort() {
        return this.$store.state.Setting.tableSort;
      },
      includeFavoriteMenuList() {
        return [
          {
            Items: [],
            catName: '收藏',
            count: this.$store.state.Setting.favorites.length,
            isFavorite: true,
          },
          ...this.gameStore.MenuList,
        ];
      },
    },
    watch: {
      isCallGameDetailAPI: {
        handler() {
          this.callGetGameDetail(
            this.gameStore.selectCatID,
            this.gameStore.selectWagerTypeKey,
            true
          );
        },
      },
      tableSort: {
        handler() {
          this.callGetGameDetail(this.gameStore.selectCatID, this.gameStore.selectWagerTypeKey);
        },
      },
      selectCatID: {
        handler() {
          this.$nextTick(() => {
            this.initMenuActiveString();
          });
        },
        immediate: true,
      },
      includeFavoriteMenuList() {
        this.initMenuActiveString();
      },
      selectWagerTypeKey() {
        this.initMenuActiveString();
      },
    },
    methods: {
      initMenuActiveString() {
        const menuIndex = this.includeFavoriteMenuList.findIndex(
          (it) => it.catid === this.selectCatID
        );
        if (menuIndex === -1) {
          this.hideMenuChildren();
        } else {
          if (this.includeFavoriteMenuList[menuIndex].Items.length === 0) {
            this.menuActiveString = `${menuIndex}`;
          } else {
            const wagerIndex = this.includeFavoriteMenuList[menuIndex].Items.findIndex(
              (it) => it.WagerTypeKey === this.selectWagerTypeKey
            );
            if (wagerIndex > -1) {
              this.menuActiveString = `${menuIndex}-${wagerIndex}`;
            } else {
              this.menuActiveString = `${menuIndex}-0`;
            }
          }
        }
      },
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
        // GameType切換的時候, WagerTypeKey 不用送出
        this.callGetGameDetail(catid, null);
        this.$store.dispatch('Game/GetMenuGameCatList', true);
        this.$store.commit('MoreGame/closeMoreGameList');
      },
      // updateBehind如果是true 則不會清除GameList和不會跑loading動畫
      callGetGameDetail(CatID, WagerTypeKey = null, updateBehind = false) {
        if (!updateBehind) {
          this.$store.commit('SetLoading', true);
        }

        let postData = null;
        postData = {
          GameType: this.gameTypeID,
          CatID,
          WagerTypeKey,
        };
        this.$store.dispatch('Game/GetGameDetail', { updateBehind, postData }).then((res) => {
          console.log(
            'getGameDetail done GameType CatID WagerTypeKey',
            this.gameTypeID,
            CatID,
            WagerTypeKey
          );
          if (!updateBehind) {
            this.$store.commit('SetLoading', false);
          }
        });
      },

      // 最愛
      callGetFavoriteGameDetail() {
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('Game/GetFavoriteGameDetail')
          .then((res) => {})
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
      hideMenuChildren() {
        this.$refs.elMenu.openedMenus.length = 0;
        this.$refs.elMenu.openedMenus = [];
      },
      menuItemClickHandler(catData, WagerTypeKey, catIndex, isDefaultSystemSelect = false) {
        this.$emit('ChangeCat');
        this.$store.commit('Game/changeCatReset');
        if (!catData.isFavorite) {
          let clickCatID = null;
          let clickWagerTypeKey = null;
          clickCatID = catData.catid;
          // 父親層級被點
          if (WagerTypeKey === null) {
            // 除了系統預設選擇的,點選單父層時,需要關閉其他球類已展開的兒子
            if (this.$refs.elMenu.openedMenus?.length && !isDefaultSystemSelect) {
              this.hideMenuChildren();
            }

            if (catData.Items.length === 0) {
              clickWagerTypeKey = 1;
            } else {
              clickWagerTypeKey = catData.Items[0].WagerTypeKey;
            }
          } else {
            clickWagerTypeKey = WagerTypeKey;
          }

          this.$store.commit('MoreGame/closeMoreGameList');
          // 獲取遊戲detail
          this.callGetGameDetail(clickCatID, clickWagerTypeKey);
        } else {
          // 如果點擊選單的收藏
          this.menuActiveString = '0';
          this.$store.commit('Game/setCatIDAndGameTypeAndWagerType', {
            selectGameType: this.gameTypeID,
            selectCatID: -999,
            selectWagerTypeKey: null,
          });
          this.hideMenuChildren();
          this.$store.commit('MoreGame/closeMoreGameList');
          // 最愛遊戲
          this.callGetFavoriteGameDetail();
        }
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
          .el-submenu__title {
            border-bottom: 1px solid #ccc;
          }
        }
      }
      .el-menu-item {
        height: 35px;
        line-height: 35px;
        i {
          margin-right: 0px;
        }
        &.is-active {
          @include nav_menu_active_bg();
        }
      }
      .singleMenuItem {
        border-bottom: 1px solid #bbb;
        .nav_bottom {
          width: calc(100% - 20px);
        }
        &:hover {
          @include hover_color();
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

<template>
  <div id="GamesNavMenu">
    <div class="nav_header" v-show="!isCollapse">
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
        <i class="el-icon-arrow-left" @click="isCollapse = !isCollapse"></i>
      </div>
    </div>
    <div class="nav_header nav_header1" v-show="isCollapse">
      <div class="Collapse C_hide">
        <i class="el-icon-arrow-left" @click="isCollapse = !isCollapse"></i>
      </div>
    </div>
    <el-menu
      class="el-menu-vertical-demo color_text"
      :default-active="defaultActive"
      :collapse="isCollapse"
      :unique-opened="true"
    >
      <el-submenu index="状态" class="collapse_GameType" v-show="isCollapse">
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
            @click="menuItemClickHandler(catData, Items.WagerTypeKey, i)"
            :index="i + '-' + y"
          >
            <template slot="title">
              <div class="nav_bottom_item">
                <span>{{ Items.WagerTypeName }}</span>
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
    data() {
      return {
        isCollapse: false,
        defaultActive: '',
      };
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      showGameTypeList() {
        return this.gameStore.GameTypeList.filter((it, index) => index <= 2);
      },
      gameTypeID() {
        return parseInt(this.$route.query.gameType);
      },
      showHiddenCollapseText() {
        return this.showGameTypeList.find((it) => it.key === this.gameTypeID).value;
      },
    },
    methods: {
      callGetMenuGameCatList() {
        this.$store.commit('SetLoading', true);
        this.$store.dispatch('Game/GetMenuGameCatList', { gtype: this.gameTypeID }).finally(() => {
          this.$store.commit('SetLoading', false);
        });
      },
      gameTypeClickHandler(key) {
        this.$router.replace({
          name: this.$route.name,
          query: { ...this.$route.query, gameType: key },
        });
        this.callGetMenuGameCatList();
      },
      menuItemClickHandler(catData, WagerTypeKey, catIndex) {
        let clickCatID = null;
        let clickWagerTypeKey = null;
        clickCatID = catData.catid;
        // 父親層級被點
        if (WagerTypeKey === null) {
          this.defaultActive = `${catIndex}-0`;
          if (catData.Items.length === 0) {
            clickWagerTypeKey = 1;
          } else {
            clickWagerTypeKey = catData.Items[0].WagerTypeKey;
          }
        } else {
          clickWagerTypeKey = WagerTypeKey;
        }
        console.log(clickCatID, clickWagerTypeKey);
      },
    },
  };
</script>

<style lang="scss">
  #GamesNavMenu {
    .el-menu-item {
      padding-right: 0px !important;
    }
  }
</style>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  @import '@/assets/sass/global.scss';
  .activeState {
    border-bottom: 3px solid #ffffff;
  }
  .nav_header {
    height: 35px;
    line-height: 35px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-right: 1px solid #fff;
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

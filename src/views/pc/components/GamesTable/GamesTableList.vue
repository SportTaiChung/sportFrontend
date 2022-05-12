<template>
  <div id="GameTableList" v-loading="selectCatID === null" :style="GameTableListStyleJudge()">
    <template v-if="selectCatID !== null">
      <table class="GameTableHeader" :style="GameTableHeaderStyleJudge()">
        <tbody class="GameTableBody">
          <td class="FirstCatNameBlock">
            <div class="leftArrowBlock" @click="clickArrow">
              <i :class="arrowIconJudge" />
            </div>
            {{ selectCatID | CatIDtoString }}
          </td>
          <td v-for="(it, key) in showTableHeaderList" :key="key" class="GameTableHeaderOtherTD">
            <div class="borderWhiteBlock"></div>
            {{ it.showName }}
            <div></div>
          </td>
          <td v-if="selectWagerTypeKey === 1" class="GameTableHeaderMoreTD">
            <div class="borderWhiteBlock"></div>
            更多
            <div></div>
          </td>
        </tbody>
      </table>

      <el-collapse v-model="activeCollapse">
        <virtual-list
          class="virtual-list"
          :style="GameTableHeaderStyleJudge()"
          :data-key="'uid'"
          :data-sources="GameList"
          :data-component="itemComponent"
        />
      </el-collapse>
    </template>
  </div>
</template>

<script>
  import mixin from './GamesTableMixin';
  import VirtualList from 'vue-virtual-scroll-list';
  import GameCollapse from './GameCollapse.vue';
  export default {
    mixins: [mixin],
    name: 'GameTableList',
    components: {
      VirtualList,
    },
    props: {
      isNavMenuCollapse: {
        type: Boolean,
        require: true,
      },
    },
    data() {
      return {
        itemComponent: GameCollapse,
        activeCollapse: [],
      };
    },
    computed: {
      selectCatID() {
        return this.gameStore.selectCatID;
      },
      showTableHeaderList() {
        return this.$store.getters['Game/showTableHeaderList'];
      },
      GameList() {
        if (this.gameStore.GameList.length === 0) {
          return [];
        } else {
          return this.gameStore.GameList.List.map((it, index) => {
            return { uid: index, ...it };
          });
        }
      },
      arrowIconJudge() {
        if (this.activeCollapse.length === 0) {
          return 'el-icon-arrow-down';
        } else {
          return 'el-icon-arrow-up';
        }
      },
    },
    watch: {
      GameList(newValue, oldValue) {
        this.activeAllCollapse();
      },
    },
    methods: {
      activeAllCollapse() {
        this.activeCollapse.length = 0;
        this.activeCollapse = new Array(this.GameList.length).fill(null).map((it, index) => index);
      },
      GameTableListStyleJudge() {
        // 左側選單如果關閉時
        if (this.isNavMenuCollapse) {
          // 減掉 左邊側欄 64px
          // 減掉 右邊注單 300px;
          // 加上 卷軸寬度17px;
          // 因此減掉 364px;
          return `width: calc(100% - 347px);`;
        } else {
          // 減掉 左邊側欄 200px
          // 減掉 右邊注單 300px;
          // 加上 卷軸寬度17px;
          // 因此減掉 483px;
          return `width: calc(100% - 483px);`;
        }
      },
      GameTableHeaderStyleJudge() {
        // 左側選單如果關閉時
        if (this.isNavMenuCollapse) {
          return `min-width:836px`;
        } else {
          return `min-width:696px`;
        }
      },
      clickArrow() {
        if (this.activeCollapse.length === 0) {
          this.activeAllCollapse();
        } else {
          this.activeCollapse.length = 0;
          this.activeCollapse = [];
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  @import './GameTable.scss';
  #GameTableList {
    border-left: 2px solid;
    border-right: 2px solid;
    width: fit-content;
    @include main_bg_border_color();
    .GameTableHeader {
      width: 100%;
      height: 35px;
      display: flex;
      align-items: center;
      @include nav-headrtcolor();
      @include nav-headrtBgcolor();
      .GameTableBody {
        width: 100%;
        display: flex;
        .FirstCatNameBlock {
          display: flex;
          min-width: $FirstCatNameBlockMinWidth;
          .leftArrowBlock {
            width: 50px;
            margin-right: 5px;
            display: flex;
            justify-content: center;
            .el-icon-arrow-up {
              font-size: 15px;
              margin-top: -2px;
            }
          }
        }
        .GameTableHeaderOtherTD,
        .GameTableHeaderMoreTD {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .borderWhiteBlock {
            background-color: rgba(255, 255, 255, 0.25);
            height: 15px;
            width: 1px;
          }
        }
        .GameTableHeaderMoreTD {
          width: 60px;
          min-width: 60px;
          white-space: nowrap;
        }
      }
    }

    .el-collapse {
      height: calc(100% - 35px);
      border: 0px;
      .virtual-list {
        height: 100%;
        overflow-y: auto;
        &::-webkit-scrollbar {
          /*隱藏滾輪*/
          display: none;
        }
      }
    }
  }
</style>

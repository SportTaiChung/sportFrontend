<template>
  <div
    id="GameTableList"
    v-loading="selectCatID === null && gameStore.MenuList.length !== 0"
    :style="GameTableListStyleJudge()"
  >
    <template v-if="selectCatID !== null && gameStore.MenuList.length !== 0">
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

      <DynamicScroller
        :items="GameList"
        :min-item-size="10"
        class="DynamicScroller"
        ref="virtualList"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[item.LeagueID]"
            :data-index="index"
            :data-active="active"
          >
            <GameCollapse
              :index="index"
              :source="item"
              :isCollapse="activeCollapse.indexOf(item.LeagueID) > -1"
              @collapseChange="collapseChangeHandler"
            ></GameCollapse>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </template>

    <template v-if="gameStore.MenuList.length === 0">
      <div class="EmptyGameTable">
        <div class="EmptyCenterItemBlock">
          <img alt="" src="@/assets/img/pc/icon_noGame.svg" />
          <p>暫無賽事</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import mixin from './GamesTableMixin';
  import GameCollapse from './GameCollapse.vue';
  import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
  export default {
    mixins: [mixin],
    name: 'GameTableList',
    components: {
      DynamicScroller,
      DynamicScrollerItem,
      GameCollapse,
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
        timeoutEvent: null,
        timeoutEvent2: null,
        cool: false,
      };
    },
    created() {
      window.tt = this;
    },
    computed: {
      selectCatID() {
        return this.gameStore.selectCatID;
      },
      showTableHeaderList() {
        return this.$store.getters['Game/showTableHeaderList'];
      },
      GameList() {
        return this.$store.getters['Game/gameListFinalData'];
      },
      arrowIconJudge() {
        if (this.activeCollapse.length === this.GameList.length) {
          return 'el-icon-arrow-down';
        } else {
          return 'el-icon-arrow-up';
        }
      },
    },
    methods: {
      collapseChangeHandler(LeagueID) {
        const collapseIndex = this.activeCollapse.findIndex((it) => it === LeagueID);
        if (collapseIndex > -1) {
          this.activeCollapse.splice(collapseIndex, 1);
        } else {
          this.activeCollapse.push(LeagueID);
        }
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
        // 開關大折疊面板時, scroll重新回到最上方;
        if (this.$refs?.virtualList) {
          clearTimeout(this.timeoutEvent);
          this.$nextTick(() => {
            this.$refs.virtualList.$el.scrollTop = 0;
          });
        }
        if (this.activeCollapse.length === this.GameList.length) {
          this.activeCollapse.length = 0;
          this.activeCollapse = [];
        } else {
          this.CollapseAll();
        }
      },
      CollapseAll() {
        clearTimeout(this.timeoutEvent2);
        this.activeCollapse.length = 0;
        this.activeCollapse = new Array(this.GameList.length)
          .fill(null)
          .map((it, index) => this.GameList[index].LeagueID);
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
          .leftArrowBlock {
            width: 50px;
            margin-right: 5px;
            display: flex;
            justify-content: center;
            .el-icon-arrow-up,
            .el-icon-arrow-down {
              font-size: 15px;
              margin-top: -2px;
              cursor: pointer;
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

    .DynamicScroller {
      height: calc(100% - 35px);
      background-color: #e8e8e8;
      &::-webkit-scrollbar {
        /*隱藏滾輪*/
        display: none;
      }
    }

    .EmptyGameTable {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>

<template>
  <div class="mGameTable">
    <!-- 標題 Bar -->
    <div
      class="playTypeBar"
      :style="headerColor"
      v-if="GameList.length && gameData.Items.List.length"
      @click="onToggleAllCollapseClick"
    >
      <!-- 玩法類型 -->
      <div class="playTypeBtn" @click="!isFavoriteMode && openWagerTypePopup()">
        <img class="icon" v-if="gameData.CatID" :src="getMenuIconByCatID(gameData.CatID)" alt="" />
        <template v-if="!isFavoriteMode">
          {{ gameNameWithWagerType }}
        </template>
        <template v-else>
          {{ gameData.CatName }}
        </template>
      </div>

      <img
        class="arrow"
        :class="activeCollapse.length > 0 ? 'active' : ''"
        src="@/assets/img/mobile/btn_arrow_w.svg"
      />
    </div>

    <div style="display: flex">
      <!-- 左半邊 - 隊伍資訊 -->
      <div class="left-area">
        <mGameInfo
          v-for="(source, index) in gameData.Items.List"
          :key="index"
          :source="source"
          :isExpanded="isExpanded(index)"
          :hasMoreGame="hasMoreGame"
          :dotStatus="dotStatusHandlerAll()"
          @toggleCollapse="toggleCollapse(index)"
        ></mGameInfo>
      </div>

      <!-- 右半邊 - 下注資訊-->
      <div class="right-area" ref="scrollEl" @scroll="scrollEvent">
        <mGameBetting
          v-for="(source, index) in gameData.Items.List"
          :key="index"
          :source="source"
          :bestHead="gameData.Items.BestHead"
          :isExpanded="isExpanded(index)"
          :hasMoreGame="hasMoreGame"
          @toggleCollapse="toggleCollapse(index)"
          @dotStatusChanged="(status) => dotStatusHandler(index, status)"
        ></mGameBetting>
      </div>
    </div>
  </div>
</template>

<script>
  import mGameInfo from './mGameInfo.vue';
  import mGameBetting from './mGameBetting.vue';
  export default {
    name: 'mGameTable',
    props: {
      gameData: {
        type: Object,
        default() {
          return {};
        },
      },
      hasMoreGame: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    data() {
      return {
        activeCollapse: [],
        dotStatusArr: [],
        dotStatus: {
          visible: false,
          isScrollToTheEnd: false,
        },
      };
    },
    components: {
      mGameInfo,
      mGameBetting,
    },
    mounted() {
      // this.expandAllCollapse();
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      GameList() {
        return this.gameStore.GameList;
      },
      CatMapData() {
        return this.$store.state.Game.CatMapData;
      },
      currentCatData() {
        const { selectCatID, MenuList } = this.gameStore;
        const currentCatData = MenuList.find((it) => it.catid === selectCatID);
        return currentCatData;
      },
      currentWagerType() {
        if (this.currentCatData) {
          const { selectWagerTypeKey } = this.gameStore;
          const currentWagerType = this.currentCatData.Items.find(
            (it) => it.WagerTypeKey === selectWagerTypeKey
          );
          return currentWagerType;
        }
        return null;
      },
      isFavoriteMode() {
        return this.gameStore.selectCatID === -999;
      },
      gameNameWithWagerType() {
        const gameName = this.gameData.CatName;
        const wagerTypeName = this.currentWagerType
          ? ' - ' + this.currentWagerType.WagerTypeName
          : '';
        return gameName + wagerTypeName;
      },
      headerColor() {
        const color = this.CatMapData[this.gameData.Items.List[0].CatID]?.color || '#7d9364';
        return {
          'background-color': color,
        };
      },
    },
    methods: {
      onToggleAllCollapseClick(e) {
        if (e.target !== e.currentTarget) return;
        this.toggleAllCollapse();
      },
      isExpanded(index) {
        return this.activeCollapse.includes(index);
      },
      toggleCollapse(index) {
        if (this.activeCollapse.includes(index)) {
          this.activeCollapse = this.activeCollapse.filter((it) => it !== index);
        } else {
          this.activeCollapse.push(index);
        }
        this.updateDotVisible();
      },
      toggleAllCollapse() {
        this.activeCollapse = this.activeCollapse.length > 0 ? [] : this.expandAllCollapse();
      },
      expandAllCollapse() {
        return (this.activeCollapse = new Array(this.gameData.Items.List.length)
          .fill(0)
          .map((it, index) => index));
      },
      openWagerTypePopup() {
        if (this.currentCatData.Items.length > 1) {
          this.$emit('openWagerTypePopup');
        }
      },
      getMenuIconByCatID(catId) {
        const icon = this.CatMapData[catId].icon;
        return require('@/assets/img/common/menuIcon/' + icon);
      },
      dotStatusHandler(index, status) {
        this.dotStatusArr[index] = status;
      },
      dotStatusHandlerAll() {
        return this.dotStatus;
      },
      scrollEvent(event) {
        const element = event.target;
        if (Math.floor(element.scrollWidth - element.scrollLeft) <= element.clientWidth) {
          // 滑到最右邊
          this.dotStatus.isScrollToTheEnd = true;
        } else if (element.scrollLeft === 0) {
          // 滑到最左邊
          this.dotStatus.isScrollToTheEnd = false;
        }
      },
      updateDotVisible() {
        this.$nextTick(() => {
          // 如果沒有卷軸,則不顯示小球
          const element = this.$refs.scrollEl;
          if (element) {
            console.log(element.scrollWidth, element.clientWidth);
            if (element.scrollWidth <= element.clientWidth) {
              this.dotStatus.visible = false;
            } else {
              this.dotStatus.visible = true;
            }
          }
        });
      },
    },
    watch: {
      activeCollapse() {
        this.updateDotVisible();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .mGameTable {
    overflow-x: hidden;
    overflow-y: auto;
    .left-area {
      width: 40%;
      transition: width 500ms ease;

      @media screen and(max-width: 480px) {
        width: calc(160px);
      }
    }
    .right-area {
      position: relative;
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      // box-shadow: inset 0px 0px 15px rgba(0, 0, 0, 0.1);
    }
    .playTypeBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8em;
      line-height: 1em;
      min-height: 30px;
      color: #fff;
      padding: 3px 6px;
      background-color: #7d9364;
      position: sticky;
      width: 100%;
      z-index: 10;
      top: 0;
      left: 0;

      .catName {
        font-size: 1.2rem;
      }

      .playTypeBtn {
        display: flex;
        align-items: center;
        position: relative;
        align-self: stretch;
        border: 1px solid #fff;
        border-radius: 45px;
        padding: 4px 10px 4px 30px;
        min-height: 26px;
        line-height: 1;
        background-color: rgba(255, 255, 255, 0.15);
        font-size: 1.2rem;

        &:active {
          background-color: rgba(0, 0, 0, 0.15);
        }

        img.icon {
          position: absolute;
          left: 5px;
          top: 50%;
          height: 18px;
          width: 18px;
          transform: translateY(-50%);
          filter: grayscale(1) brightness(3);
        }
      }

      img.arrow {
        width: 1.1rem;
        margin-right: 6px;
        transition: 200ms ease;
        &.active {
          transform: rotate(-90deg);
        }
      }
    }
  }
</style>

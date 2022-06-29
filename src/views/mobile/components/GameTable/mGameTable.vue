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

      <i
        class="el-collapse-item__arrow el-icon-arrow-right"
        :class="activeCollapse.length > 0 ? 'is-active' : ''"
      ></i>
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
          @toggleCollapse="toggleCollapse(index)"
        ></mGameInfo>
      </div>
      <!-- 右半邊 - 下注資訊-->
      <div class="right-area">
        <div v-for="(source, index) in gameData.Items.List" :key="index">
          <mGameBetting
            :source="source"
            :bestHead="gameData.Items.BestHead"
            :isExpanded="isExpanded(index)"
            :hasMoreGame="hasMoreGame"
            @toggleCollapse="toggleCollapse(index)"
          ></mGameBetting>
        </div>
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
      };
    },
    components: {
      mGameInfo,
      mGameBetting,
    },
    mounted() {
      this.expandAllCollapse();
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
        if (this.currentCatData.Items.length) {
          this.$emit('openWagerTypePopup');
        }
      },
      getMenuIconByCatID(catId) {
        const icon = this.CatMapData[catId].icon;
        return require('@/assets/img/common/menuIcon/' + icon);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .mGameTable {
    .left-area {
      width: 35%;
      transition: width 600ms ease-out;

      @media screen and(max-width: 480px) {
        width: calc(200px);
      }
    }
    .right-area {
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
        padding: 4px 30px;
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
    }
  }
</style>

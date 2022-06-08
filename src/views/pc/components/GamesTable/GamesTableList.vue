<template>
  <div id="GameTableList" :style="GameTableListStyleJudge()" ref="GameTableList">
    <template v-if="gameStore.MenuList.length !== 0 && GameList.length !== 0">
      <GameTableHeader
        :isCollapse="GameTableHeaderIsCollapse()"
        :isNavMenuCollapse="isNavMenuCollapse"
        :CatName="GameList[0].CatName"
        :BestHead="GameList[0].Items.BestHead"
        :isShowMoreGameEntryBtn="isShowMoreGameEntryBtn(GameList[0].CatID)"
        @ArrowClick="GameTableHeaderTopArrowClick"
      >
      </GameTableHeader>

      <div class="ScrollViewContainer">
        <div class="gameContainer" v-for="(GameData, GameIndex) in GameList" :key="GameIndex">
          <div v-for="(leagueData, leagueIndex) in GameData.Items.List" :key="leagueIndex">
            <GameCollapse
              :index="leagueIndex"
              :source="leagueData"
              :isCollapse="activeCollapse.indexOf(leagueData.LeagueID) > -1"
              :isShowMoreGameEntryBtn="isShowMoreGameEntryBtn(GameData.CatID)"
              @collapseChange="collapseChangeHandler"
              @AddToCart="$emit('AddToCart')"
            ></GameCollapse>
          </div>
        </div>
      </div>
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
  import GameTableHeader from './GameTableHeader.vue';
  export default {
    mixins: [mixin],
    name: 'GameTableList',
    components: {
      GameCollapse,
      GameTableHeader,
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
        collapseTimeoutEvent: null,
      };
    },
    created() {},
    computed: {
      selectCatID() {
        return this.gameStore.selectCatID;
      },
      isFavoriteMode() {
        return this.selectCatID === -999;
      },
      GameList() {
        return this.gameStore.GameList;
      },
      isShowMoreGame() {
        return this.$store.state.MoreGame.isShowMoreGame;
      },
    },
    watch: {
      selectCatID() {
        this.activeCollapse.length = 0;
      },
    },
    methods: {
      GameTableHeaderTopArrowClick() {
        console.log('GameTableHeaderTopArrowClick');
        // 展開所有摺疊所有
        if (this.activeCollapse.length === this.GameList[0].Items.List.length) {
          this.$store.commit('SetLoading', true);
          clearTimeout(this.collapseTimeoutEvent);
          this.collapseTimeoutEvent = setTimeout(() => {
            this.activeCollapse.length = 0;
            this.activeCollapse = [];
            this.$nextTick(() => {
              this.$store.commit('SetLoading', false);
            });
          }, 100);
        } else {
          // 摺疊所有
          this.activeCollapse.length = 0;
          this.activeCollapse = new Array(this.GameList[0].Items.List.length)
            .fill(null)
            .map((it, index) => this.GameList[0].Items.List[index].LeagueID);
        }
      },
      GameTableHeaderIsCollapse() {
        if (!this.isFavoriteMode) {
          if (this.activeCollapse.length === this.GameList[0].Items.List.length) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
      isShowMoreGameEntryBtn(CatID) {
        return this.selectWagerTypeKey === 1 && CatID !== 72 && CatID !== 83 && CatID !== 84;
      },
      collapseChangeHandler(LeagueID) {
        const collapseIndex = this.activeCollapse.findIndex((it) => it === LeagueID);
        if (collapseIndex > -1) {
          this.activeCollapse.splice(collapseIndex, 1);
        } else {
          this.activeCollapse.push(LeagueID);
        }
      },
      GameTableListStyleJudge() {
        let diffOffset = 0;
        // 左側選單如果關閉時
        if (this.isNavMenuCollapse) {
          // 減掉 左邊側欄 64px
          // 減掉 右邊注單 300px;
          // 加上 卷軸寬度17px;
          // 因此減掉 347px;
          diffOffset = 364;
          // return `width: calc(100% - 347px);`;
        } else {
          // 減掉 左邊側欄 200px
          // 減掉 右邊注單 300px;
          // 加上 卷軸寬度17px;
          // 因此減掉 483px;
          diffOffset = 500;
          // return `width: calc(100% - 483px);`;
        }
        // 更多投注 寬度370px
        if (this.isShowMoreGame) {
          diffOffset += 370;
        }
        return `width: calc(100% - ${diffOffset}px);`;
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
    background-color: #d5d5d5;

    @include main_bg_border_color();

    .ScrollViewContainer {
      overflow-y: scroll;
      height: calc(100% - 35px);
      &::-webkit-scrollbar {
        /*隱藏滾輪*/
        display: none;
      }
      .gameContainer {
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

<template>
  <table class="GameTableHeader" :style="bgColor">
    <tbody class="GameTableBody">
      <td class="FirstCatNameBlock" :style="customizedWidth" @click="clickArrow">
        <div class="leftArrowBlock">
          <i :class="arrowIconJudge" />
        </div>
        {{ CatName }}
      </td>
      <!-- 波膽 -->
      <template v-if="selectCatID === 1 && selectWagerTypeKey === 2"> </template>
      <!-- 其他 -->
      <template v-else>
        <td v-for="(it, key) in BestHeadWithFilterLimit" :key="key" class="GameTableHeaderOtherTD">
          <div class="borderWhiteBlock"></div>
          {{ it.showName }}
          <div></div>
        </td>
        <td v-if="isShowMoreGameEntryBtn" class="GameTableHeaderMoreTD">
          <div class="borderWhiteBlock"></div>
          {{ $t('Common.More') }}
          <div></div>
        </td>
      </template>
    </tbody>
  </table>
</template>

<script>
  import mixin from './GamesTableMixin';
  export default {
    mixins: [mixin],
    name: 'GameTableHeader',
    props: {
      CatID: {
        type: Number,
      },
      CatName: {
        type: String,
      },
      BestHead: {
        type: Array,
      },
      isShowMoreGameEntryBtn: {
        type: Boolean,
      },
      isNavMenuCollapse: {
        type: Boolean,
      },
      isCollapse: {
        type: Boolean,
        default: false,
      },
      color: {
        type: String,
        default: '#136146',
      },
      ColumnLimit: {
        type: Number,
        default: 10,
      },
    },
    computed: {
      BestHeadWithFilterLimit() {
        return this.BestHead.filter((it, index) => index < this.ColumnLimit);
      },
      isShowMoreGame() {
        return this.$store.state.MoreGame.isShowMoreGame;
      },
      arrowIconJudge() {
        if (this.isCollapse) {
          return 'el-icon-arrow-down';
        } else {
          return 'el-icon-arrow-up';
        }
      },
      selectCatID() {
        return this.gameStore.selectCatID;
      },
      selectGameType() {
        return this.gameStore.selectGameType;
      },
      bgColor() {
        return {
          'background-color': this.color,
        };
      },
      customizedWidth() {
        return this.$lib.customizedWidth(this.CatID);
      },
    },
    methods: {
      clickArrow() {
        this.$emit('ArrowClick');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './GameTable.scss';
  .GameTableHeader {
    .GameTableBody {
      height: 100%;
      .FirstCatNameBlock {
        height: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
    }
  }
</style>

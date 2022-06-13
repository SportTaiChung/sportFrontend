<template>
  <table class="GameTableHeader">
    <tbody class="GameTableBody">
      <td class="FirstCatNameBlock">
        <div class="leftArrowBlock" @click="clickArrow">
          <i :class="arrowIconJudge" />
        </div>
        {{ CatName }}
      </td>
      <td v-for="(it, key) in BestHead" :key="key" class="GameTableHeaderOtherTD">
        <div class="borderWhiteBlock"></div>
        {{ it.showName }}
        <div></div>
      </td>
      <td v-if="isShowMoreGameEntryBtn" class="GameTableHeaderMoreTD">
        <div class="borderWhiteBlock"></div>
        更多
        <div></div>
      </td>
    </tbody>
  </table>
</template>

<script>
  import mixin from './GamesTableMixin';
  export default {
    mixins: [mixin],
    name: 'GameTableHeader',
    props: {
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
    },
    computed: {
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
  #GameTableHeader {
  }
</style>

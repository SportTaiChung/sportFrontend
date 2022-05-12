<template>
  <div id="GameTableList" v-loading="selectCatID === null" :style="GameTableListStyleJudge()">
    <template v-if="selectCatID !== null">
      <table class="GameTableHeader" :style="GameTableHeaderStyleJudge()">
        <tbody class="GameTableBody">
          <td class="FirstCatNameBlock">
            <div class="leftArrowBlock">
              <i class="el-icon-arrow-up" />
            </div>
            {{ selectCatID | CatIDtoString }}
          </td>
          <td v-for="(it, key) in showTableHeaderList" :key="key" class="GameTableHeaderOtherTD">
            <div class="borderWhiteBlock"></div>
            {{ it.showName }}
            <div></div>
          </td>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'GameTableList',
    props: {
      isNavMenuCollapse: {
        type: Boolean,
        require: true,
      },
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      selectCatID() {
        return this.gameStore.selectCatID;
      },
      showTableHeaderList() {
        return this.$store.getters['Game/showTableHeaderList'];
      },
    },
    methods: {
      GameTableListStyleJudge() {
        // 左側選單如果關閉時
        if (this.isNavMenuCollapse) {
          // 左邊側欄 64px
          // 右邊注單 300px;
          // 因此減掉 364px;
          return `width: calc(100% - 364px);`;
        } else {
          // 左邊側欄 200px
          // 右邊注單 300px;
          // 因此減掉 500px;
          return `width: calc(100% - 500px);`;
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
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #GameTableList {
    border-left: 2px solid;
    border-right: 2px solid;
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
          min-width: 235px;
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
        .GameTableHeaderOtherTD {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .borderWhiteBlock {
            background-color: rgba(255, 255, 255, 0.25);
            height: 12px;
            width: 1px;
          }
        }
      }
    }
  }
</style>

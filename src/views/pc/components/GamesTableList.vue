<template>
  <div id="GameTableList">
    <table class="GameTableHeader">
      <tbody>
        <td class="FirstCatNameBlock">
          <div class="leftArrowBlock">
            <i class="el-icon-arrow-up" />
          </div>
          足球
        </td>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'GameTableList',
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #GameTableList {
    width: 100%;
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
      .FirstCatNameBlock {
        display: flex;
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
    }
  }
</style>

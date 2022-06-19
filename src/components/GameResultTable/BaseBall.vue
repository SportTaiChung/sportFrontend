<template>
  <!-- league 賽果 -->
  <div class="league-result">
    <div class="league-collapse" @click="isExpanded = !isExpanded">
      <i class="el-icon-arrow-down collapse-status" :class="isExpanded ? 'expanded' : ''"></i>
      <p class="league-name"> NPB 日本職棒 </p>
    </div>

    <!-- 概要 -->
    <table class="table-summary" v-show="isExpanded" @click="isShowDetails = !isShowDetails">
      <tbody>
        <tr>
          <td>
            <div class="time">
              <div class="row">06-19</div>
              <div class="row">12:00</div>
            </div>
          </td>
          <td>
            <div class="teams">
              <div class="row">東北樂天鷹</div>
              <div class="row">福岡軟銀鷹</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">0</div>
              <div class="row">1</div>
            </div>
          </td>
          <td>
            <div class="cell-detail" :class="isShowDetails ? 'active' : ''">
              <div class="row">完賽</div>
              <div class="row">14 <i class="el-icon-arrow-down"></i> </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 詳細 -->
    <table class="table-details" v-show="isExpanded && isShowDetails">
      <tbody>
        <tr>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
        </tr>
        <tr>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
          <td class="item">
            <div class="name">name1:</div>
            <div class="value">value1</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'BaseBall',
    data() {
      return {
        isExpanded: true,
        isShowDetails: false,
      };
    },
  };
</script>

<style lang="scss" scoped>
  @import './GameResultTable.scss';
</style>

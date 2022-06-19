<template>
  <!-- league 賽果 -->
  <div class="league-result" :class="isExpanded ? '' : 'closed'">
    <div class="league-collapse" @click="isExpanded = !isExpanded">
      <i class="el-icon-arrow-down collapse-status" :class="isExpanded ? 'expanded' : ''"></i>
      <p class="league-name"> {{ resultData.LeagueName }} </p>
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
              <div class="row"> {{ resultData.HomeTeam }} </div>
              <div class="row">{{ resultData.AwayTeam }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S1)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S1)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S2)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S2)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S3)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S3)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S4)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S4)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S5)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S5)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S6)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S6)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S7)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S7)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S8)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S8)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.S9)[0] }}</div>
              <div class="row">{{ parseScore(resultData.S9)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.OT)[0] }}</div>
              <div class="row">{{ parseScore(resultData.OT)[1] }}</div>
            </div>
          </td>
          <td>
            <div class="score">
              <div class="row">{{ parseScore(resultData.FH)[0] }}</div>
              <div class="row">{{ parseScore(resultData.FH)[1] }}</div>
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
    props: {
      resultData: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        isExpanded: true,
        isShowDetails: false,
      };
    },
    methods: {
      parseScore(str) {
        if (str.indexOf(':') !== -1) {
          return str.split(':');
        }
        return ['-', '-'];
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './GameResultTable.scss';
</style>

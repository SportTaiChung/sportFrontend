<template>
  <div id="StrayCount">
    <table>
      <thead>
        <tr>
          <td>關數</td>
          <td>賠率</td>
          <td>分盤</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in countData" :key="index">
          <td class="showIndex">
            {{ index + 1 }}
          </td>
          <td class="oddRow">
            <template v-if="index === 1">
              <el-input
                class="componentHeight IsError"
                v-model="data.odd"
                @input="inputHandler(index, 'odd')"
              ></el-input>
              <div class="oddEmpty"> 賠率不能為空 </div>
            </template>

            <template v-else>
              <el-input class="componentHeight" v-model="data.odd"></el-input>
            </template>
          </td>
          <td class="row">
            <div class="firstText">分盤</div>

            <el-select v-model="data.type" class="selectType" size="mini">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-input
              class="componentHeight percentInput"
              v-model="data.percent"
              type="number"
              :min="0"
              :max="100"
              :disabled="PercentDisable(data)"
              @input="inputHandler(index, 'percent')"
            ></el-input>
            <div class="lastText">%</div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="resultBlock">
      <div class="left">
        <div class="titleText">投注金額</div>
        <el-input
          class="resultInputBlock"
          v-model="betAmount"
          @input="betAmountInputHandler"
          size="mini"
        ></el-input>
      </div>
      <div class="right">
        <div class="titleText">可贏金額</div>
        <el-input class="resultInputBlock" size="mini" :disabled="true"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StrayCount',
    data() {
      const TypeEnum = Object.freeze({
        Win: 1,
        Loose: 2,
        Draw: 3,
        Plus: 4,
        Reduce: 5,
      });
      return {
        TypeEnum,
        options: [
          {
            value: TypeEnum.Win,
            label: '全贏',
          },
          {
            value: TypeEnum.Loose,
            label: '全輸',
          },
          {
            value: TypeEnum.Draw,
            label: '平',
          },
          {
            value: TypeEnum.Plus,
            label: '+',
          },
          {
            value: TypeEnum.Reduce,
            label: '-',
          },
        ],
        countData: new Array(10).fill().map((it) => {
          return { odd: '', percent: 100, type: TypeEnum.Win, isError: false };
        }),
        betAmount: '',
      };
    },
    methods: {
      PercentDisable(data) {
        console.log(data.type);
        if (data.type === this.TypeEnum.Plus || data.type === this.TypeEnum.Reduce) {
          return false;
        } else {
          return true;
        }
      },
      inputHandler(index, key) {
        let currentData = this.countData[index][key].replace(/[^\d]/g, '');
        if (parseInt(currentData) > 100) {
          currentData = 100;
        } else if (parseInt(currentData) < 0) {
          currentData = 0;
        }
        this.countData[index][key] = parseFloat(currentData);
        this.countData = this.countData.slice();
      },
      betAmountInputHandler() {
        this.betAmount = this.betAmount.replace(/[^\d]/g, '');
      },
    },
  };
</script>

<style lang="scss">
  #StrayCount {
    .componentHeight {
      height: 30px;
      input {
        height: 100%;
      }
    }
    .percentInput {
      width: 46px;
      .el-input__inner {
        width: 46px;
        padding: 0 8px;
      }
    }
    .IsError {
      .el-input__inner {
        border-color: #f56c6c !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
  #StrayCount {
    width: 100%;
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-bottom: 1px solid #bbb;
      thead {
        tr {
          background-color: #d8d8d8;
        }
        height: 30px;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
      }
      tbody {
      }
      td:first-child {
        width: 60px;
      }
      td:nth-child(2) {
        width: 109px;
      }
      td:nth-child(3) {
        width: 221px;
      }
      // .trContainer {
      //   display: flex;
      //   align-items: center;
      //   border-bottom: 1px solid black;
      .selectType {
        margin: 0 8px;
      }
      .percentInput {
        input {
          width: 30px;
        }
      }
      .showIndex {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .oddRow {
        position: relative;
        .oddEmpty {
          position: absolute;
          color: red;
          bottom: -7px;
        }
      }

      .row {
        padding: 10px;
        display: flex;
        align-items: center;
        height: 50px;
        white-space: nowrap;
        .firstText {
          margin-left: 15px;
        }
        .lastText {
          margin-left: 5px;
        }
      }
      // }
    }
    .resultBlock {
      display: flex;
      padding: 15px 10px;
      .left {
        width: 50%;
        display: flex;
      }
      .right {
        width: 50%;
        display: flex;
      }
      .titleText {
        width: 60px;
        font-size: 14px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        margin-right: 5px;
      }
      .resultInputBlock {
        width: 100px;
      }
    }
  }
</style>

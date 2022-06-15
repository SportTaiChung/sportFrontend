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
            <template>
              <el-input
                class="componentHeight"
                :class="data.errorType === 1 ? 'IsError' : ''"
                v-model="data.odd"
                @input="inputHandler(index, 'odd')"
              ></el-input>
              <div class="oddEmpty" v-if="data.errorType === 1"> 賠率不能為空 </div>
              <div class="oddEmpty" v-if="data.errorType === 2"> 百分比未填寫 </div>
            </template>
          </td>
          <td class="row">
            <div class="firstText">分盤</div>

            <el-select
              v-model="data.type"
              class="selectType"
              :class="`selectType${data.type}`"
              size="mini"
              @change="selectChangeHandler(index)"
            >
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
              :class="data.errorType === 2 ? 'IsError' : ''"
              :min="0"
              :max="100"
              :disabled="PercentDisable(data)"
              @input="percentInputHandler(index, 'percent')"
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
        <el-input
          class="resultInputBlock resultWinInputBlock"
          size="mini"
          :disabled="true"
          v-model="winAmount"
        ></el-input>
      </div>
    </div>

    <div class="formulaBlock" v-if="formulaResult !== ''">
      <div class="formulaTitle"> 計算過程 </div>
      <div> {{ formulaResult }} </div>
    </div>

    <div class="optionBlock">
      <div class="left">
        <div class="optionBtn" @click="reset">清 零</div>
      </div>
      <div class="right">
        <div class="optionBtn countBtn" @click="countStart">計 算</div>
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
          return {
            odd: '',
            percent: 100,
            type: TypeEnum.Win,
            // 0 : 沒有錯誤
            // 1 : 賠率未填寫
            // 2 : 百分比未填寫
            errorType: 0,
          };
        }),
        betAmount: 0,
        winAmount: '',
        formulaResult: '',
      };
    },
    methods: {
      PercentDisable(data) {
        if (data.type === this.TypeEnum.Plus || data.type === this.TypeEnum.Reduce) {
          return false;
        } else {
          return true;
        }
      },
      inputHandler(index, key) {
        let currentData = this.countData[index][key].toString().match(/^\d+(?:\.\d{0,2})?/);
        if (isNaN(currentData) || currentData === '') {
          currentData = 0;
        } else if (parseInt(currentData) < 0) {
          currentData = 0;
        }
        this.countData[index][key] = parseFloat(currentData);
        this.countData = this.countData.slice();
      },
      percentInputHandler(index, key) {
        let currentData = this.countData[index][key].replace(/[^\d]/g, '');
        if (isNaN(currentData) || currentData === '') {
          currentData = 0;
        } else if (parseInt(currentData) > 100) {
          currentData = 100;
        } else if (parseInt(currentData) < 0) {
          currentData = 0;
        }
        this.countData[index][key] = parseFloat(currentData);
        this.countData = this.countData.slice();
      },
      betAmountInputHandler() {
        let newBetAmount = this.betAmount.replace(/[^\d]/g, '');
        if (isNaN(newBetAmount) || newBetAmount === '') {
          newBetAmount = 0;
        }
        this.betAmount = newBetAmount;
      },
      reset() {
        this.betAmount = 0;
        this.winAmount = '';
        this.formulaResult = '';
        this.countData.forEach((it) => (it.odd = ''));
      },
      check() {
        let hasError = false;

        // 檢查投注金額
        if (this.betAmount === '') {
          this.$message({
            message: '請輸入投注金額',
            type: 'error',
          });
          hasError = true;
        }

        // 檢查第一個賠率
        if (this.countData.filter((it) => it.odd !== '').length === 0) {
          this.countData[0].errorType = 1;
          hasError = true;
        }

        // 檢查百分比
        let isFindErrorType2 = false;
        this.countData.forEach((it, index) => {
          if (it.percent === '') {
            this.countData[index].errorType = 2;
            isFindErrorType2 = true;
          }
        });
        if (isFindErrorType2) {
          hasError = true;
        }

        if (hasError) {
          this.countData = this.countData.slice();
          return false;
        }

        return true;
      },
      countStart() {
        this.countData.forEach((it) => (it.errorType = 0));
        this.countData = this.countData.slice();
        if (this.check()) {
          console.log('開始計算');
          const countList = this.countData.filter((it) => it.odd !== '');
          const newFormulaResult = `${this.betAmount}*`;
          let appendStr = '';
          let sum = parseFloat(this.betAmount);
          countList.forEach((it) => {
            if (it.type === this.TypeEnum.Win) {
              appendStr += `(1+${it.odd})`;
              const addOneNum = this.$lib.trunc(1 + parseFloat(it.odd));
              sum = this.$lib.trunc(sum * addOneNum);
            } else if (it.type === this.TypeEnum.Loose) {
              appendStr += `(1-1)`;
              sum = 0;
            } else if (it.type === this.TypeEnum.Draw) {
              appendStr += `(1+0)`;
            } else if (it.type === this.TypeEnum.Plus) {
              const num = this.$lib.trunc(parseFloat(it.odd) * it.percent);
              const percent = this.$lib.trunc(num / 100);
              const addOneNum = this.$lib.trunc(1 + percent);
              sum = this.$lib.trunc(sum * addOneNum);
              appendStr += `(1+${percent})`;
            } else if (it.type === this.TypeEnum.Reduce) {
              const num = this.$lib.trunc(it.percent / 100);
              const reduceOneNum = this.$lib.trunc(1 - num);
              sum = this.$lib.trunc(sum * reduceOneNum);
              appendStr += `(1-${num})`;
            }
          });

          sum -= parseFloat(this.betAmount);
          this.winAmount = sum;

          this.formulaResult = `${newFormulaResult}${appendStr}-${this.betAmount}=${sum}`;
        }
      },
      selectChangeHandler(changeIndex) {
        if (this.countData[changeIndex].type === this.TypeEnum.Draw) {
          this.countData[changeIndex].percent = 0;
        } else if (
          this.countData[changeIndex].type === this.TypeEnum.Plus ||
          this.countData[changeIndex].type === this.TypeEnum.Reduce
        ) {
          this.countData[changeIndex].percent = '';
        } else {
          this.countData[changeIndex].percent = '100';
        }
        this.countData = this.countData.slice();
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
    .resultWinInputBlock {
      .el-input__inner {
        color: red !important;
        font-size: 16px;
        background-color: #ccc !important;
      }
    }
    .selectType {
      margin: 0 8px;
      .el-input__inner {
        font-weight: bold !important;
        font-size: 14px !important;
      }
    }
    .selectType1 {
      .el-input__inner {
        color: #0371fe !important;
      }
    }
    .selectType2 {
      .el-input__inner {
        color: rgb(255, 0, 0) !important;
      }
    }
    .selectType3 {
      .el-input__inner {
        color: black !important;
      }
    }
    .selectType4 {
      .el-input__inner {
        color: #0371fe !important;
      }
    }
    .selectType5 {
      .el-input__inner {
        color: rgb(255, 0, 0) !important;
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

    .formulaBlock {
      font-size: 14px;
      text-align: left;
      margin: 0 12px 10px;
      border-radius: 3px;
      box-sizing: border-box;
      padding: 5px 10px 7px;
      border: 2px dashed #999;
      .formulaTitle {
      }
    }

    .optionBlock {
      display: flex;
      justify-content: center;
      .left,
      .right {
        width: 49%;
        padding: 15px 10px;
        padding-top: 0px;
        .optionBtn {
          padding: 10px 0px;
          height: 40px;
          background-color: #7e7e7e;
          color: white;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .countBtn {
          background-color: #ffff1b;
          color: black;
        }
      }
    }
  }
</style>

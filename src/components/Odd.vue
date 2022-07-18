<template>
  <div class="Odd" :class="OddCssJudge">
    {{ showOddValue }}
  </div>
</template>

<script>
  export default {
    name: 'Odd',
    props: {
      OddValue: {
        type: [Number, String],
      },
      UniqueID: {
        type: String,
      },
    },
    data() {
      return {
        AnimateEvent: null,
        ColorEvent: null,
        // 0 無狀態
        // 1 變大
        // 2 變小
        AnimateState: 0,
        // 0 無狀態
        // 1 變大
        // 2 變小
        ColorState: 0,
        // 動畫變色維持時間
        ANIMATE_MAINTAIN_TIME: 5000,
        // 文字變色維持時間
        COLOR_MAINTAIN_TIME: 8000,
      };
    },
    beforeDestroy() {
      clearTimeout(this.AnimateEvent);
      clearTimeout(this.ColorEvent);
    },
    computed: {
      OddCssJudge() {
        let resStr = '';
        if (this.ColorState === 1) {
          resStr += 'biggerColor';
        } else if (this.ColorState === 2) {
          resStr += 'smallerColor';
        }

        if (this.AnimateState === 1) {
          resStr += ' ani-value-up';
        } else if (this.AnimateState === 2) {
          resStr += ' ani-value-down';
        }
        return resStr;
      },
      includePrincipal() {
        return this.$store.state.Setting.UserSetting.includePrincipal;
      },
      showOddValue() {
        if (this.OddValue === '') return '';
        else {
          if (this.includePrincipal) {
            return this.$lib.trunc(parseFloat(this.OddValue) + 1);
          } else {
            return this.OddValue;
          }
        }
      },
    },
    watch: {
      OddValue: {
        handler(newOdd) {
          if (window.OddData.OddDataList[this.UniqueID] === undefined) {
            window.OddData.setOddData(this.UniqueID, newOdd);
          } else {
            if (window.OddData.OddDataList[this.UniqueID] !== newOdd) {
              this.changeColor(newOdd, window.OddData.OddDataList[this.UniqueID]);
              window.OddData.setOddData(this.UniqueID, newOdd);
            }
          }
        },
        immediate: true,
      },
    },
    methods: {
      changeColor(newValue, oldValue) {
        let floatNewValue;
        let floatOldValue;
        if (newValue === '') {
          floatNewValue = parseFloat(0);
        } else {
          floatNewValue = newValue;
        }
        if (oldValue === '') {
          floatOldValue = parseFloat(0);
        } else {
          floatOldValue = oldValue;
        }
        floatNewValue = parseFloat(floatNewValue);
        floatOldValue = parseFloat(floatOldValue);
        if (floatNewValue > floatOldValue) {
          this.ColorState = 1;
          this.AnimateState = 1;
        } else if (floatNewValue < floatOldValue) {
          this.ColorState = 2;
          this.AnimateState = 2;
        }
        this.regEvent();
      },
      regEvent() {
        clearTimeout(this.AnimateEvent);
        this.AnimateEvent = setTimeout(() => {
          this.AnimateState = 0;
        }, this.ANIMATE_MAINTAIN_TIME);
        this.ColorEvent = setTimeout(() => {
          this.ColorState = 0;
        }, this.COLOR_MAINTAIN_TIME);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .Odd {
    position: relative;
    color: #3fa381;
    overflow: hidden;
    font-weight: bold;
  }
  .biggerColor {
    color: red;
  }
  .smallerColor {
    color: skyblue;
  }

  .ani-value-up {
    &::after {
      content: '';
      position: absolute;
      right: 0;
      width: 3px;
      background: linear-gradient(transparent, red 20%, red 80%, transparent);
      height: 100%;
      animation: loopY 1s ease-in-out infinite;
    }
  }

  .ani-value-down {
    &::after {
      content: '';
      position: absolute;
      right: 0;
      width: 3px;
      height: 100%;
      background: linear-gradient(transparent, green 20%, green 80%, transparent);
      animation: loopY 1s ease-in-out infinite reverse;
    }
  }

  @keyframes loopY {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(-100%);
    }
  }
</style>

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
        timeEvent: null,
        // 0 無狀態
        // 1 變大
        // 2 變小
        colorState: 0,
        // 變色維持時間
        COLOR_MAINTAIN_TIME: 4000,
        OddList: {},
      };
    },
    beforeDestroy() {
      clearTimeout(this.timeEvent);
    },
    computed: {
      OddCssJudge() {
        if (this.colorState === 1) {
          return 'biggerColor';
        } else if (this.colorState === 2) {
          return 'smallerColor';
        } else {
          return '';
        }
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
          this.colorState = 1;
        } else if (floatNewValue < floatOldValue) {
          this.colorState = 2;
        }
        this.regEvent();
      },
      regEvent() {
        clearTimeout(this.timeEvent);
        this.timeEvent = setTimeout(() => {
          this.colorState = 0;
        }, this.COLOR_MAINTAIN_TIME);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .Odd {
    color: #3fa381;
  }
  .biggerColor {
    color: red;
  }
  .smallerColor {
    color: skyblue;
  }
</style>

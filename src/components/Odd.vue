<template>
  <div class="Odd" :class="OddCssJudge">
    {{ OddValue }}
  </div>
</template>

<script>
  export default {
    name: 'Odd',
    props: {
      OddValue: {
        type: [Number, String],
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
      };
    },
    beforeDestroy() {
      clearTimeout(this.timeEvent);
    },
    watch: {
      OddValue(newValue, oldValue) {
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
        // console.log('origin:', newValue, oldValue);
        // console.log(floatNewValue, floatOldValue);
        this.regEvent();
      },
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
    },
    methods: {
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

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
        type: Number,
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
        COLOR_MAINTAIN_TIME: 2000,
      };
    },
    watch: {
      OddValue(newValue, oldValue) {
        if (newValue > oldValue) {
          this.colorState = 1;
        } else if (newValue < oldValue) {
          this.colorState = 2;
        }
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
          console.log('reset');
        }, this.COLOR_MAINTAIN_TIME);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .Odd {
    color: #3fa381;
    font-size: 20px;
  }
  .biggerColor {
    color: red;
  }
  .smallerColor {
    color: skyblue;
  }
</style>

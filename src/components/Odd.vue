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
      oddDataList() {
        return this.$store.state.Odd.oddDataList;
      },
    },
    watch: {
      OddValue: {
        handler(newOdd) {
          if (this.oddDataList[this.UniqueID] === undefined) {
            this.$store.commit('Odd/update', { key: this.UniqueID, value: newOdd });
          } else {
            if (this.oddDataList[this.UniqueID] !== newOdd) {
              this.changeColor(newOdd, this.oddDataList[this.UniqueID]);
              this.$store.commit('Odd/update', { key: this.UniqueID, value: newOdd });
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

<template>
  <!-- 小籌碼 -->
  <div class="chipsBar">
    <i class="el-icon-arrow-left" @click="goPreviousChipIndex()"></i>
    <div class="chips">
      <div
        class="chip"
        v-for="(chip, index) in currentChips"
        :style="getChipImage(index)"
        @click="onChipClick(index)"
        :key="index"
      ></div>
    </div>
    <i class="el-icon-arrow-right" @click="goNextChipIndex()"></i>
  </div>
</template>

<script>
  export default {
    name: 'chipsBar',
    data() {
      return {
        chipPageIndex: 0,
        chipsNumPerPage: 3, // 一次選染幾個chip
      };
    },
    computed: {
      settings() {
        return this.$store.state.Setting.UserSetting;
      },
      chipsData() {
        const preferChips = this.settings.preferChips;
        if (preferChips.length > 0 && preferChips.length <= 6) {
          return this.$SportLib.chipsData.filter((chip) => preferChips.includes(chip.value));
        }
        return this.$SportLib.chipsData;
      },
      maxChipPage() {
        // 舊邏輯: 一次翻整頁
        // return Math.ceil(this.chipsData.length / this.chipsNumPerPage);
        // 新邏輯: 一次翻一個
        if (this.chipsData.length - this.chipsNumPerPage > 0) {
          return this.chipsData.length - this.chipsNumPerPage;
        } else {
          return 0;
        }
      },
      // 當前被渲染的籌碼
      currentChips() {
        // 舊邏輯: 一次翻整頁
        // return this.chipsData.slice(
        //   this.chipPageIndex * this.chipsNumPerPage,
        //   this.chipPageIndex * this.chipsNumPerPage + 3
        // );

        // 新邏輯: 一次翻一個
        return this.chipsData.slice(this.chipPageIndex, this.chipPageIndex + this.chipsNumPerPage);
      },
    },
    methods: {
      onChipClick(index) {
        const chip = this.currentChips[index];
        if (!chip) return;
        const value = chip.value > 0 ? chip.value : null;
        this.$emit('onChipClick', value);
      },
      goNextChipIndex() {
        const max = this.maxChipPage;
        this.chipPageIndex += this.chipPageIndex < max ? 1 : 0;
      },
      goPreviousChipIndex() {
        const min = 0;
        this.chipPageIndex -= this.chipPageIndex <= min ? 0 : 1;
      },
      getChipImage(pos) {
        const chip = this.currentChips[pos];
        const img = chip.img;
        return {
          'background-image': `url(${require('@/assets/img/pc/chips/' + img)})`,
        };
      },
    },
    watch: {
      chipsData() {
        this.chipPageIndex = 0;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chipsBar {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #888;
    padding-bottom: 5px;
    overflow: hidden;

    i {
      color: 000;
      font-size: 22px;
      font-weight: bold;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.3s ease;
      &:hover {
        opacity: 1;
      }
      &:active {
        transform: scale(1.25);
      }
    }

    .chips {
      flex: 1;
      flex-grow: 1;
      flex-shrink: 1;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      overflow: hidden;

      .chip {
        cursor: pointer;
        flex: 0 0 50px;
        background-repeat: no-repeat;
        background-size: auto 100%;
        width: 50px;
        height: 50px;
        transition: transform ease 0.1s;

        &:hover {
          transform: translateY(-4px);
        }
        &:active {
          transform: translateY(-4px) scale(1.05);
        }
      }
    }
  }
</style>

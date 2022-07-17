<!-- 籌碼 bar 組件 -->
<template>
  <div class="chipsBar">
    <i class="el-icon-arrow-left" @click="goPreviousChipIndex()"></i>
    <ul class="chips">
      <li
        class="chip"
        v-for="(chip, index) in currentChips"
        :style="getChipImage(index)"
        @click="onChipClick(chip.value)"
        :key="index"
      ></li>
    </ul>
    <i class="el-icon-arrow-right" @click="goNextChipIndex()"></i>

    <!-- the max chip -->
    <div class="chip max-chip" v-if="isShowMaxChip" @click="onChipClick(theMaxChipValue)">
      {{ theMaxChipValue }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'chipsBar',
    props: {
      // 是否顯示最大的籌碼
      isShowMaxChip: {
        type: Boolean,
        default: false,
      },
      // 最大籌碼面額
      theMaxChipValue: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        // 當前頁 index
        chipPageIndex: 0,
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
      // 一次選染幾個chip
      chipsShowPerPage() {
        return this.isShowMaxChip ? 3 : 4;
      },
      maxPages() {
        // 舊邏輯: 一次翻整頁
        // return Math.ceil(this.chipsData.length / this.chipsShowPerPage);
        // 新邏輯: 一次翻一個
        if (this.chipsData.length - this.chipsShowPerPage > 0) {
          return this.chipsData.length - this.chipsShowPerPage;
        } else {
          return 0;
        }
      },
      // 當前被渲染的籌碼
      currentChips() {
        // 舊邏輯: 一次翻整頁
        // return this.chipsData.slice(
        //   this.chipPageIndex * this.chipsShowPerPage,
        //   this.chipPageIndex * this.chipsShowPerPage + 3
        // );

        // 新邏輯: 一次翻一個
        return this.chipsData.slice(this.chipPageIndex, this.chipPageIndex + this.chipsShowPerPage);
      },
    },
    methods: {
      onChipClick(value) {
        if (value) this.$emit('onChipClick', value);
      },
      goNextChipIndex() {
        const max = this.maxPages;
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
    }

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

      &.max-chip {
        background-image: url('~@/assets/img/pc/chips/icon_chip_10.png');
        margin: 0 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        line-height: normal;
        font-size: 1rem;
        font-weight: bold;
      }
    }
  }
</style>

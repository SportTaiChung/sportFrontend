<template>
  <div id="GamesBetInfo">
    <div class="topHeader">
      <div class="topHeaderTextItemGroup">
        <div
          class="topHeaderTextItem"
          @click="
            selectGroupIndex = 0;
            selectChildIndex = 0;
          "
        >
          <div class="topHeaderTextItemChild" :class="topHeaderTextItemChildCSS(0)"> 投注資訊 </div>
          <div class="topHeaderTextItemChild SelectBorder" v-if="this.selectGroupIndex === 0"></div>
        </div>
        <div
          class="topHeaderTextItem"
          @click="
            selectGroupIndex = 1;
            selectChildIndex = 0;
          "
        >
          <div class="topHeaderTextItemChild" :class="topHeaderTextItemChildCSS(1)"> 最新注單 </div>
          <div class="topHeaderTextItemChild SelectBorder" v-if="this.selectGroupIndex === 1"></div>
        </div>
      </div>
      <div class="topHeaderIconItemGroup">
        <div class="topHeaderIconItem">
          <img src="@/assets/img/pc/btn_count.svg" alt="" />
        </div>
        <div class="topHeaderIconItem" @click="$emit('openSetup')">
          <img src="@/assets/img/pc/btn_funSet.svg" alt="" />
        </div>
      </div>
    </div>
    <div class="bottomContainer">
      <div
        class="bottomHeaderRow"
        v-if="(selectGroupIndex === 0 && showBetCartList.length !== 0) || selectGroupIndex === 1"
      >
        <div
          class="bottomHeaderRowItem"
          :class="selectChildIndex === 0 ? 'bottomHeaderRowItemActive' : ''"
          @click="selectChildIndex = 0"
        >
          {{ bottomHeaderRowItem(0) }}
        </div>
        <div
          class="bottomHeaderRowItem"
          :class="selectChildIndex === 1 ? 'bottomHeaderRowItemActive' : ''"
          @click="selectChildIndex = 1"
        >
          {{ bottomHeaderRowItem(1) }}
        </div>
      </div>

      <BetViewList :groupIndex="selectGroupIndex" :childIndex="selectChildIndex"> </BetViewList>
    </div>
  </div>
</template>

<script>
  import BetViewList from '@/components/BetViewList';
  export default {
    name: 'GamesBetInfo',
    components: {
      BetViewList,
    },
    data() {
      return {
        selectGroupIndex: 0,
        selectChildIndex: 0,
      };
    },
    computed: {
      showBetCartList() {
        return this.$store.getters['BetCart/showBetCartList'];
      },
      showBetHistoryList() {
        return this.$store.getters['BetCart/showBetHistoryList'];
      },
    },
    methods: {
      bottomHeaderRowItem(index) {
        if (this.selectGroupIndex === 0) {
          if (index === 0) {
            return '單向投注';
          } else {
            return '過關投注';
          }
        } else {
          if (index === 0) {
            return '未結算注單';
          } else {
            return '可兌現注單';
          }
        }
      },
      topHeaderTextItemChildCSS(groupIndex) {
        if (groupIndex === this.selectGroupIndex) {
          return 'ItemTextActive';
        } else {
          return '';
        }
      },
      resetGroupIndex() {
        if (this.selectGroupIndex !== 0) {
          this.selectGroupIndex = 0;
          this.selectChildIndex = 0;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  #GamesBetInfo {
    width: 300px;
    height: 100%;
    background-color: #d5d5d5;
    text-align: center;
    .topHeader {
      display: flex;
      background-color: #136146;
      border-bottom-color: #136146;
      height: 35px;
      .topHeaderTextItemGroup {
        width: 65%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 100%;
        .topHeaderTextItem {
          color: white;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          cursor: pointer;
          width: 50%;
          .topHeaderTextItemChild {
            width: 100%;
          }
          .ItemTextActive {
            margin-bottom: -12px;
          }
          .SelectBorder {
            width: 64px;
            background-color: #caffed;
            height: 3px;
          }
        }
      }
      .topHeaderIconItemGroup {
        display: flex;
        width: 35%;
        justify-content: space-around;
        align-items: center;
        height: 100%;
        .topHeaderIconItem {
          height: fit-content;
          display: flex;
          align-items: center;
          img {
            background-size: 22px;
            height: 22px;
            width: 22px;
            opacity: 0.5;
            cursor: pointer;
            &:hover {
              opacity: 1;
            }
          }
        }
      }
    }
    .bottomContainer {
      padding: 5px;
      width: 100%;
      height: calc(100% - 35px);
      margin-bottom: 5px;
      .bottomHeaderRow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        .bottomHeaderRowItem {
          background-color: #c5c5c5;
          color: #666;
          width: 49%;
          height: 30px;
          line-height: 30px;
          cursor: pointer;
        }
        .bottomHeaderRowItemActive {
          background-color: #f3f3f3;
          color: #000;
        }
      }
    }
  }
</style>

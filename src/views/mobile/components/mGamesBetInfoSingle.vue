<template>
  <div id="mGamesBetInfoSingle">
    <BetViewList></BetViewList>
  </div>
</template>

<script>
  import BetViewList from '@/components/BetViewList';
  export default {
    name: 'mGamesBetInfoSingle',
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
    },
  };
</script>

<style lang="scss" scoped>
  #mGamesBetInfoSingle {
  }
</style>

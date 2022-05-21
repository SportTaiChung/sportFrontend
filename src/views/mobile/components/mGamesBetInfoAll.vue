<template>
  <div id="mGamesBetInfoAll" @click.stop="onMaskClick">
    <div class="popup">
      <div class="header"> </div>
      <div class="body">
        <BetViewList @betCartListChanged="changeHandler"></BetViewList>
      </div>
    </div>
  </div>
</template>

<script>
  import BetViewList from '@/components/BetViewList';
  export default {
    name: 'mGamesBetInfoAll',
    components: {
      BetViewList,
    },
    data() {
      return {};
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
      onMaskClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('onCloseBetInfo');
      },
      changeHandler(betCartList) {
        if (betCartList.length === 0) {
          this.$emit('onCloseBetInfo');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  #mGamesBetInfoAll {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

    width: 100vw;
    height: 100vh;

    .popup {
      width: calc(100vw - 50px);
      max-width: 560px;
      max-height: 80%;

      .header {
        height: 45px;
        background-color: #6da9e5;
        color: #fff;
        border-radius: 4px 4px 0 0;
        font-size: 0.95em;
      }
      .body {
        max-height: 70vh;
        background-color: #d4d4d4;
        padding: 5px;
        padding-bottom: 10px;
        border-radius: 0 0 4px 4px;
        overflow: auto;
      }
    }
  }
</style>

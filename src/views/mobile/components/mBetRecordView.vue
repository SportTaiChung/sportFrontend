<template>
  <div id="mBetRecordView">
    <div class="header-container">
      <div class="title">投注紀錄</div>
      <div class="btn-close" @click="$emit('onCloseBetRecordView')"> &times; </div>
    </div>

    <ul class="navList">
      <li :class="tabIndex === 0 ? 'active' : ''" @click="onTabClick(0)">
        <div class="text">未結算</div>
      </li>
      <li :class="tabIndex === 1 ? 'active' : ''" @click="onTabClick(1)">
        <div class="text">可兌現</div>
      </li>
      <li :class="tabIndex === 2 ? 'active' : ''" @click="onTabClick(2)">
        <div class="text">已結算</div>
      </li>
      <!-- <li :class="tabIndex === 3 ? 'active' : ''" @click="onTabClick(3)">
        <div class="text">贈禮</div>
      </li> -->
    </ul>

    <div class="main-container">
      <BetViewList :groupIndex="1" :childIndex="tabIndex"></BetViewList>
    </div>
  </div>
</template>

<script>
  import BetViewList from '@/components/BetViewList';

  export default {
    name: 'mBetRecordView',
    components: {
      BetViewList,
    },
    data() {
      return {
        tabIndex: 0,
      };
    },
    computed: {},
    methods: {
      onTabClick(index) {
        if (index > 1) return; //  暫時沒有 2,3
        this.tabIndex = index;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #mBetRecordView {
    position: fixed;
    z-index: 20;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    .header-container {
      height: 45px;
      width: 100%;
      padding: 0 10px;
      @include base-background();
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #fff;

      .title {
        color: #fff;
        font-size: 1.3rem;
        text-align: center;
      }

      .btn-close {
        position: absolute;
        right: 1rem;
        font-size: 3rem;
        color: #fff;
      }
    }

    ul.navList {
      height: 40px;
      background-color: #6da9e5;
      display: flex;
      flex-shrink: 0;
      justify-content: flex-start;
      align-items: center;

      li {
        flex: 1;
        text-align: center;
        font-size: 1.25rem;
        padding: 3px;
        color: #fff;
        cursor: pointer;

        .text {
          width: 60%;
          margin: 0 auto;
        }

        &.active {
          .text {
            display: inline-block;
            border-bottom: 3px solid #fff;
            padding-bottom: 3px;
          }
        }
      }
    }

    .main-container {
      flex: auto;
      overflow: auto;
      background-color: #d8d8d8;
      padding: 10px;
    }
  }
</style>

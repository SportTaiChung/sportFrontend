<template>
  <div id="mBetRecordView">
    <div class="header-container">
      <div class="title">{{ $t('HistoryRecord.BetHistoryRecord') }}</div>
      <div class="btn-back" v-if="isShowGoBackBtn" @click="$refs.RecordHistory.goBackPage()">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="btn-close" @click="$emit('onCloseBetRecordView')"> &times; </div>
    </div>

    <ul class="navList">
      <li :class="tabIndex === 0 ? 'active' : ''" @click="onTabClick(0)">
        <div class="text">{{ $t('Common.NotCount') }}</div>
      </li>
      <li :class="tabIndex === 1 ? 'active' : ''" @click="onTabClick(1)">
        <div class="text">{{ $t('Common.IsCount') }}</div>
      </li>
    </ul>

    <div class="main-container">
      <!-- 未結算: 直接使用 PC版 BetViewList 組件 -->
      <div v-if="tabIndex === 0" style="padding: 10px">
        <BetViewList :groupIndex="1" :childIndex="tabIndex"></BetViewList>
      </div>

      <!-- 已結算 -->
      <mBetRecordHistory
        ref="RecordHistory"
        v-if="tabIndex === 1"
        @showGoBackBtn="(visible) => (isShowGoBackBtn = visible)"
      ></mBetRecordHistory>
    </div>
  </div>
</template>

<script>
  import BetViewList from '@/components/BetViewList';
  import mBetRecordHistory from './mBetRecordHistory';

  export default {
    name: 'mBetRecordView',
    components: {
      BetViewList,
      mBetRecordHistory,
    },
    data() {
      return {
        tabIndex: 0,
        isShowGoBackBtn: false,
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
    width: 100%;
    height: 100%;

    .header-container {
      height: 45px;
      width: 100%;
      padding: 0 10px;
      @include base-background();
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #8fd1bb;

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
        cursor: pointer;
      }

      .btn-back {
        position: absolute;
        left: 1rem;
        font-size: 2rem;
        color: #fff;
        cursor: pointer;
      }
    }

    ul.navList {
      height: 40px;
      background-color: #3fa381;
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
      // padding: 10px;
    }
  }
</style>

<template>
  <div class="mGameResultTable">
    <!-- 標題 Bar -->
    <div class="titleBar" :style="headerColor" @click="onToggleAllCollapseClick">
      <div class="name-wrap">
        <img class="icon" v-if="selectedCatId" :src="getMenuIconByCatID(selectedCatId)" />
        <span class="catName">{{ catName }}</span>
      </div>

      <i
        class="el-collapse-item__arrow el-icon-arrow-right"
        :class="activeCollapse.length > 0 ? 'is-active' : ''"
      ></i>
    </div>

    <div style="display: flex">
      <!-- 左半邊 - 隊伍資訊 -->
      <div class="left-area">
        <mGameResultInfo
          v-for="(source, index) in leagueList"
          :key="index"
          :source="source"
          :isExpanded="isExpanded(index)"
          @toggleCollapse="toggleCollapse(index)"
        ></mGameResultInfo>
      </div>
      <!-- 右半邊 - 詳細資料 -->
      <div class="right-area">
        <mGameResultDetail
          v-for="(source, index) in leagueList"
          :key="index"
          :source="source"
          :titles="titles"
          :isExpanded="isExpanded(index)"
          @toggleCollapse="toggleCollapse(index)"
        ></mGameResultDetail>
      </div>
    </div>
  </div>
</template>

<script>
  import mGameResultInfo from './mGameResultInfo.vue';
  import mGameResultDetail from './mGameResultDetail.vue';
  const today = new Date();
  const dateRange = 10;

  export default {
    name: 'mGameResultTable',
    components: {
      mGameResultInfo,
      mGameResultDetail,
    },
    props: {
      selectedCatId: {
        type: Number,
        default: null,
      },
    },
    mounted() {
      this.getGameResult();
    },
    data() {
      return {
        activeCollapse: [],
        rawData: {
          BestHead: [],
          List: [],
        },
        today: today,
        lastDays: new Array(dateRange).fill(0).map((it, index) => {
          const result = new Date(today);
          result.setDate(result.getDate() - index);
          return result;
        }),
        selectedDateIndex: 0,
        isShowDatePicker: false,
      };
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      CatList() {
        return this.$store.state.Game.CatList.filter((cat) => cat.CatID !== '-999');
      },
      CatMapData() {
        return this.$store.state.Game.CatMapData;
      },
      titles() {
        return this.rawData?.BestHead || [];
      },
      leagueList() {
        return this.rawData?.List || [];
      },
      selectedDate() {
        return this.lastDays[this.selectedDateIndex];
      },
      selectedDateYYYYMMDD() {
        return this.dateToYYYYMMDD(this.selectedDate);
      },
      headerColor() {
        const color = this.CatMapData[this.leagueList[0]?.CatID]?.color || '#7d9364';
        return {
          'background-color': color,
        };
      },
      catName() {
        return this.CatMapData[this.selectedCatId]?.Name;
      },
    },
    methods: {
      onToggleAllCollapseClick(e) {
        if (e.target !== e.currentTarget) return;
        this.toggleAllCollapse();
      },
      isExpanded(index) {
        return this.activeCollapse.includes(index);
      },
      toggleCollapse(index) {
        if (this.activeCollapse.includes(index)) {
          this.activeCollapse = this.activeCollapse.filter((it) => it !== index);
        } else {
          this.activeCollapse.push(index);
        }
      },
      toggleAllCollapse() {
        this.activeCollapse = this.activeCollapse.length > 0 ? [] : this.expandAllCollapse();
      },
      expandAllCollapse() {
        return (this.activeCollapse = new Array(this.leagueList.length)
          .fill(0)
          .map((it, index) => index));
      },
      getMenuIconByCatID(catId) {
        const icon = this.CatMapData[catId].icon;
        return require('@/assets/img/common/menuIcon/' + icon);
      },
      getGameResult() {
        if (!this.selectedCatId) return;
        this.rawData = {};
        const postData = {
          CatID: this.selectedCatId,
          ScheduleTime: this.selectedDateYYYYMMDD,
        };
        this.countdownSec = null;
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('Game/GetGameResult', postData)
          .then((res) => {
            console.log(res);
            this.rawData = res.data;
            this.expandAllCollapse();
          })
          .finally(() => {
            this.countdownSec = this.totalCountdownSec;
            this.$store.commit('SetLoading', false);
          });
      },
      dateToString(date) {
        let mm = date.getMonth() + 1;
        mm = mm < 10 ? '0' + mm : mm;
        let dd = date.getDate();
        dd = dd < 10 ? '0' + dd : dd;
        const day = date.getDay();
        const dayArr = [
          this.$t('Common.SunDay'),
          this.$t('Common.MonDay'),
          this.$t('Common.TuesDay'),
          this.$t('Common.WednesDay'),
          this.$t('Common.Thursday'),
          this.$t('Common.FriDay'),
          this.$t('Common.SaturDay'),
        ];
        return `${mm}-${dd} ${this.$t('Common.Week')}${dayArr[day]}`;
      },
      dateToYYYYMMDD(date) {
        const yyyy = date.getFullYear();
        let mm = date.getMonth() + 1;
        mm = mm < 10 ? '0' + mm : mm;
        let dd = date.getDate();
        dd = dd < 10 ? '0' + dd : dd;
        return `${yyyy}-${mm}-${dd}`;
      },
    },
    watch: {
      selectedCatId(newValue, oldValue) {
        this.getGameResult();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .mGameResultTable {
    .left-area {
      width: 35%;
      transition: width 600ms ease-out;

      @media screen and(max-width: 480px) {
        width: calc(200px);
      }
    }
    .right-area {
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      // box-shadow: inset 0px 0px 15px rgba(0, 0, 0, 0.1);
    }
    .titleBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8em;
      line-height: 1em;
      min-height: 30px;
      color: #fff;
      padding: 3px 6px;
      background-color: #7d9364;
      position: sticky;
      width: 100%;
      z-index: 10;
      top: 0;
      left: 0;

      .name-wrap {
        display: flex;
        align-items: center;
        position: relative;
        align-self: stretch;
        padding: 4px 37px;
        margin: 0 5px;
        min-height: 26px;
        line-height: normal;
        pointer-events: none;

        .catName {
          font-size: 1.125rem;
        }

        img.icon {
          position: absolute;
          left: 5px;
          top: 50%;
          height: 18px;
          width: 18px;
          transform: translateY(-50%);
          filter: grayscale(1) brightness(3);
        }
      }
    }
  }
</style>

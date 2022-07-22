<template>
  <div class="mGameResultTable">
    <!-- 標題 Bar -->
    <div class="titleBar" :style="headerColor" @click="onToggleAllCollapseClick">
      <div class="name-wrap">
        <img class="icon" v-if="selectedCatId" :src="getMenuIconByCatID(selectedCatId)" />
        <span class="catName">{{ catName }}</span>
      </div>

      <img
        class="arrow"
        :class="activeCollapse.length > 0 ? 'active' : ''"
        src="@/assets/img/mobile/btn_arrow_w.svg"
      />
    </div>

    <div style="display: flex">
      <!-- 左半邊 - 隊伍資訊 -->
      <div class="left-area">
        <mGameResultInfo
          v-for="(source, index) in leagueList"
          :key="index"
          :source="source"
          :isExpanded="isExpanded(index)"
          :dotStatus="dotStatusHandlerAll()"
          @toggleCollapse="toggleCollapse(index)"
        ></mGameResultInfo>
      </div>
      <!-- 右半邊 - 詳細資料 -->
      <div class="right-area" ref="scrollEl" @scroll="scrollEvent">
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

    <!-- 日期選擇 popup -->
    <div class="date-popup" v-show="isShowDatePicker" @click.stop="onMaskClick">
      <div class="popup">
        <div class="header">
          <div class="title"> {{ $t('GameResult.SelectDate') }} </div>
        </div>

        <div class="line"></div>

        <div class="body">
          <ul>
            <li
              class="btn-date"
              v-for="(date, i) in lastDays"
              :key="i"
              :class="selectedDateIndex === i ? 'active' : ''"
              @click="selectedDateIndex = i"
              >{{ dateToString(date) }}
            </li>
          </ul>
        </div>
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
      this.$emit('date', this.selectedDate);
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
        dotStatus: {
          visible: false,
          isScrollToTheEnd: false,
        },
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
        const color = this.CatMapData[this.selectedCatId]?.color || '#7d9364';
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
        this.updateDotVisible();
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
            // this.expandAllCollapse();
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
      onMaskClick(e) {
        if (e.target !== e.currentTarget) return;
        this.isShowDatePicker = false;
      },
      dotStatusHandlerAll() {
        return this.dotStatus;
      },
      scrollEvent(event) {
        const element = event.target;
        if (Math.floor(element.scrollWidth - element.scrollLeft) <= element.clientWidth) {
          // 滑到最右邊
          this.dotStatus.isScrollToTheEnd = true;
        } else if (element.scrollLeft === 0) {
          // 滑到最左邊
          this.dotStatus.isScrollToTheEnd = false;
        }
      },
      updateDotVisible() {
        this.$nextTick(() => {
          // 如果沒有卷軸,則不顯示小球
          const element = this.$refs.scrollEl;
          if (element) {
            console.log(element.scrollWidth, element.clientWidth);
            if (element.scrollWidth <= element.clientWidth) {
              this.dotStatus.visible = false;
            } else {
              this.dotStatus.visible = true;
            }
          }
        });
      },
    },
    watch: {
      selectedCatId(newValue, oldValue) {
        this.getGameResult();
        this.activeCollapse = [];
      },
      selectedDateIndex() {
        this.getGameResult();
        this.isShowDatePicker = false;
        this.$emit('date', this.selectedDate);
      },
      activeCollapse() {
        this.updateDotVisible();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .mGameResultTable {
    overflow-x: hidden;
    overflow-y: auto;
    .left-area {
      width: 40%;
      transition: width 600ms ease-out;

      @media screen and(max-width: 480px) {
        width: calc(160px);
      }
    }
    .right-area {
      position: relative;
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

      img.arrow {
        width: 1.1rem;
        margin-right: 6px;
        transition: 200ms ease;
        &.active {
          transform: rotate(-90deg);
        }
      }
    }

    .date-popup {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      width: 100%;
      height: 100%;
      z-index: 20;

      .popup {
        width: calc(100vw - 50px);
        max-width: 300px;
        max-height: 65%;
        border: 3px solid #c4ccd7;
        border-radius: 10px;
        background-color: #fff;
        display: flex;
        flex-direction: column;

        .header {
          .title {
            color: #000;
            font-size: 1.5rem;
            text-align: center;
            padding: 1.5rem;
          }
        }
        .line {
          height: 1px;
          background: #ccc;
          margin: 0 1.5rem;
        }
        .body {
          display: flex;
          flex-direction: column;
          max-height: 70%;
          padding: 1.5rem;
          overflow: auto;

          .btn-date {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            padding: 0.65rem 3rem;
            margin-bottom: 0.6rem;
            min-height: 3rem;
            font-size: 1.3rem;
            color: #000;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 9px;
            cursor: pointer;

            &:hover {
              background-color: #f0f0f0;
            }

            &.active,
            &:active {
              color: #fff;
              background-color: #5198e8;
              border-color: #5198e8;
            }
          }
        }
      }
    }
  }
</style>

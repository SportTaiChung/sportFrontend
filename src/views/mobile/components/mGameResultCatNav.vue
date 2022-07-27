<template>
  <!-- 遊戲類型 -->
  <ul class="gameCatNav">
    <li class="item date-picker" @click="$emit('openDatePicker')">
      <img src="@/assets/img/mobile/btn_date.svg" class="btn-date" />
      <span class="text">{{ showGetDate }}</span>
    </li>
    <li
      v-for="(catData, index) in dynamicCatList"
      :key="index"
      class="item"
      :class="selectedCatId == catData.CatID ? 'active' : ''"
      @click="selectedCatId = catData.CatID"
    >
      <img :src="getMenuIconByCatID(catData.CatID)" class="menu-icon" />
      {{ catData.Name }}
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'mGameResultCatNav',
    props: {
      date: {
        type: Date,
      },
    },
    data() {
      return {
        selectedCatId: null,
        cloneNum: 3,
        isOverflow: false,
      };
    },
    created() {
      if (this.CatList.length > 0) {
        this.selectedCatId = this.CatList[0].CatID;
      }
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      CatList() {
        return this.$store.state.Game.CatList.filter(
          (cat) => cat.CatID !== this.$conf.favoriteCatID
        );
      },
      CatMapData() {
        return this.$store.state.Game.CatMapData;
      },
      showGetDate() {
        return this.date?.getDate();
      },
      dynamicCatList() {
        let list = this.CatList;
        if (this.isOverflow) {
          const clone = [...list];
          for (let i = 0; i < this.cloneNum; i++) {
            list = [...list, ...clone];
          }
        }
        return list;
      },
      orgChildrenWidth() {
        const children = Array.from(this.$el.children);
        children.length = this.CatList.length;
        return children.reduce((acc, it) => (acc += it.clientWidth), 0);
      },
    },
    methods: {
      getMenuIconByCatID(catId) {
        const icon = this.CatMapData[catId].icon;
        return require('@/assets/img/common/menuIcon/' + icon);
      },
      detectIsOverflow() {
        this.isOverflow = this.orgChildrenWidth > this.$el.clientWidth;
      },
      onScroll() {
        if (this.isOverflow) {
          const { clientWidth, scrollWidth, scrollLeft } = this.$el;
          const orgScrollWidth = scrollWidth / (this.cloneNum + 1);
          const orgOverflow = orgScrollWidth - clientWidth;
          if (scrollLeft === 0) {
            this.$el.scrollLeft = orgScrollWidth;
          } else if (scrollLeft >= scrollWidth - clientWidth) {
            this.$el.scrollLeft = orgOverflow;
          }
        }
      },
    },
    mounted() {
      this.$el.addEventListener('scroll', this.onScroll);
      window.addEventListener('resize', this.detectIsOverflow);
      // init
      this.detectIsOverflow();
      this.onScroll();
    },
    beforeDestroy() {
      this.$el.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.detectIsOverflow);
    },
    watch: {
      selectedCatId(newValue) {
        this.$emit('changeGameResultCatId', newValue);
      },
      CatList() {
        // 當彩種更新時 重設overflow狀態 並更新視圖狀態
        this.isOverflow = false;
        this.detectIsOverflow();
        this.onScroll();
      },
    },
  };
</script>

<style lang="scss" scoped>
  ul.gameCatNav {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: 55px;
    padding: 0;
    width: 100%;
    background-color: #3fa381;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      display: none; // Safari and Chrome
    }

    li.item {
      display: flex;
      flex: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 6px;
      padding: 0.4rem 0;
      min-width: 5.35rem;
      text-align: center;
      font-size: 1.2rem;
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;

      &.active {
        color: #fff;
        img.menu-icon {
          filter: brightness(1.1);
        }
      }

      img.menu-icon {
        max-width: 20px;
        height: auto;
        padding-top: 4px;
        filter: grayscale(1) brightness(3);
        opacity: 0.7;
      }

      &.date-picker {
        position: sticky;
        left: 0;
        z-index: 1;
        background-color: #6da9e5;
        box-shadow: 1px 0px 6px rgb(0 0 0 / 10%);
        justify-content: center;

        img.btn-date {
          max-width: 2.769rem;
          height: auto;
          opacity: 0.7;
        }

        span.text {
          position: absolute;
          top: 45.2%;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }
</style>

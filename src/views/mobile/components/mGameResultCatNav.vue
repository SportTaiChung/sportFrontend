<template>
  <!-- 遊戲類型 -->
  <ul class="gameCatNav">
    <li class="item date-picker" @click="$emit('openDatePicker')">
      <img src="@/assets/img/mobile/btn_date.svg" class="btn-date" />
      <span class="text">{{ date.getDate() }}</span>
    </li>
    <li
      v-for="(catData, index) in CatList"
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
        default: Date.now(),
      },
    },
    data() {
      return {
        selectedCatId: null,
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
    },
    created() {
      if (this.CatList.length > 0) {
        this.selectedCatId = this.CatList[0].CatID;
      }
    },
    methods: {
      getMenuIconByCatID(catId) {
        const icon = this.CatMapData[catId].icon;
        return require('@/assets/img/common/menuIcon/' + icon);
      },
    },
    watch: {
      selectedCatId(newValue) {
        this.$emit('changeGameResultCatId', newValue);
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

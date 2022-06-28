<template>
  <!-- 遊戲類型 -->
  <ul class="gameCatNav">
    <li
      v-if="hasFavorite"
      class="item fav"
      :class="gameStore.selectCatID == -999 ? 'active' : ''"
      @click="goFav"
    >
      <img :src="getMenuIconByCatID(-999)" class="menu-icon" @click="goFav()" />
      {{ $t('Common.Collect') }}
    </li>
    <li
      v-for="(catData, index) in gameStore.MenuList"
      :key="index"
      class="item"
      :class="gameStore.selectCatID == catData.catid ? 'active' : ''"
      @click.stop="$emit('onCatTypeClick', catData, null, index)"
    >
      <img :src="getMenuIconByCatID(catData.catid)" class="menu-icon" />
      {{ catData.catName }}
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'mGameCatNav',
    data() {
      return {};
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      CatMapData() {
        return this.$store.state.Game.CatMapData;
      },
      hasFavorite() {
        return this.$store.state.Setting.UserSetting.favorites.length > 0;
      },
    },
    methods: {
      getMenuIconByCatID(catId) {
        const icon = this.CatMapData[catId].icon;
        return require('@/assets/img/common/menuIcon/' + icon);
      },
      openWagerTypePopup() {
        this.$emit('openWagerTypePopup');
      },
      goFav() {
        this.$store.commit('Game/setCatIDAndGameTypeAndWagerType', {
          selectGameType: this.$store.state.Game.selectGameType,
          selectCatID: -999,
          selectWagerTypeKey: null,
        });
        this.$emit('callGetFavoriteGameDetail');
      },
    },
  };
</script>

<style lang="scss" scoped>
  ul.gameCatNav {
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    min-height: 50px;
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
      justify-content: flex-end;
      align-items: center;
      gap: 6px;
      padding: 0.4rem 0;
      min-width: 5.35rem;
      width: fit-content;
      text-align: center;
      font-size: 1.2rem;
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.6);

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

      &.fav {
        position: sticky;
        left: 0;
        z-index: 1;
        background-color: #6da9e5;
        box-shadow: 1px 0px 6px rgb(0 0 0 / 10%);
      }
    }
  }
</style>

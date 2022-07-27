<template>
  <div id="mWagerTypePopup" @click.stop="onMaskClick">
    <div class="popup">
      <div class="header">
        <div class="title"> {{ $t('Common.ChoosePlay') }} </div>
      </div>

      <div class="line"></div>

      <div class="body">
        <div
          v-for="(item, index) in wagerTypes"
          :key="index"
          class="btn-gameType"
          :class="gameStore.selectWagerTypeKey === item.WagerTypeKey ? 'active' : ''"
          @click="onWagerTypeClick(item)"
        >
          <span class="wager-name">
            {{ item.WagerTypeName }}
          </span>
          <span class="wager-num">
            {{ item.count }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mWagerTypePopup',
    data() {
      return {};
    },
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
      gameTypeID() {
        return this.$store.state.Game.selectGameType;
      },
      currentCatData() {
        const { selectCatID, MenuList } = this.gameStore;
        const currentCatData = MenuList.find((it) => it.catid === selectCatID);
        return currentCatData;
      },
      wagerTypes() {
        if (this.currentCatData) {
          return this.currentCatData.Items;
        }
        return [];
      },
    },
    methods: {
      onWagerTypeClick(catData) {
        this.$store.commit('SetLoading', true);
        this.$emit('closeWagerTypePopup');

        const postData = {
          GameType: this.gameTypeID,
          CatID: this.gameStore.selectCatID,
          WagerTypeKey: catData.WagerTypeKey,
        };

        this.$store.dispatch('Game/GetGameDetail', { postData }).then((res) => {
          console.log(
            'getGameDetail by popup',
            this.gameTypeID,
            this.gameStore.selectCatID,
            catData.WagerTypeKey
          );
          this.$store.commit('SetLoading', false);
        });
      },
      onMaskClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('closeWagerTypePopup');
      },
    },
  };
</script>

<style lang="scss" scoped>
  #mWagerTypePopup {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

    width: 100%;
    height: 100%;

    .popup {
      width: calc(100vw - 50px);
      max-width: 560px;
      max-height: 80%;
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
        gap: 1rem;
        max-height: 70%;
        padding: 1.5rem;
        overflow: auto;

        .btn-gameType {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 0.65rem 3rem;
          min-height: 3.5rem;
          font-size: 1.3rem;
          color: #000;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 9px;
          cursor: pointer;

          &.active,
          &:active {
            color: #fff;
            background-color: #5198e8;
            border-color: #5198e8;
          }

          .wager-name {
            line-height: 1;
          }
          .wager-num {
            position: absolute;
            right: 1.5rem;
            top: 50%;
            transform: translateY(-50%);
            line-height: 1;
          }
        }
      }
    }
  }
</style>

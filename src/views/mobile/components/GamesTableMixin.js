const GamesTableMixin = {
  computed: {
    gameStore() {
      return this.$store.state.Game;
    },
    selectWagerTypeKey() {
      return this.gameStore.selectWagerTypeKey;
    },
  },
};

export default GamesTableMixin;

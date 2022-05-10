<template>
  <div id="Init"> </div>
</template>

<script>
  export default {
    name: 'Init',
    created() {
      this.$store.commit('SetLoading', true);
      this.$store
        .dispatch('User/GetUserInfoCash')
        .then(async () => {
          this.$store.commit('SetIsInit', true);
          await this.callGetAllMenuData();
          this.$router.replace({ name: 'Games', query: { gameType: this.gameTypeID } });
        })
        .finally(() => {
          this.$store.commit('SetLoading', false);
        });
    },
    computed: {
      gameTypeID() {
        if (this.$route.query?.gameType) {
          return parseInt(this.$route.query.gameType);
        } else {
          return 0;
        }
      },
    },
    methods: {
      callGetAllMenuData() {
        return Promise.all([
          this.$store.dispatch('Game/GetMenuGameType'),
          this.$store.dispatch('Game/GetMenuGameCatList', { gtype: this.gameTypeID }),
        ]);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #Init {
    background-color: white;
    width: 100%;
    height: 100%;
  }
</style>

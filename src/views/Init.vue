<template>
  <div id="Init"> </div>
</template>

<script>
  export default {
    name: 'Init',
    created() {
      // 從未登入過,導回login頁面
      if (localStorage.getItem('Token') === null && localStorage.getItem('MBID') === null) {
        this.$router.replace({ name: 'Login' });
      } else {
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('User/GetUserInfoCash')
          .then(async () => {
            this.$store.commit('SetIsInit', true);
            await this.callGetAllMenuData();
            this.$router.replace({ name: 'Games' });
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      }
    },
    methods: {
      callGetAllMenuData() {
        return Promise.all([
          this.$store.dispatch('Game/GetMenuGameType'),
          this.$store.dispatch('Game/GetMenuGameCatList'),
        ]);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #Init {
    background-color: #1a2b3c;
    width: 100%;
    height: 100%;
  }
</style>

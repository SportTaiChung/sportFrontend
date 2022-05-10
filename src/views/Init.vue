<template>
  <div id="Init"> </div>
</template>

<script>
  export default {
    name: 'Init',
    created() {
      this.$store.commit('SetLoading', true);
      this.$store
        .dispatch('User/UserInfoAbout')
        .then(() => {
          this.$store.commit('SetIsInit', true);
          if (this.$store.state.FirstInWebSiteURL === '') {
            this.$router.replace({ name: 'Games' });
          } else {
            location.href = this.$store.state.FirstInWebSiteURL;
          }
        })
        .finally(() => {
          this.$store.commit('SetLoading', false);
        });
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

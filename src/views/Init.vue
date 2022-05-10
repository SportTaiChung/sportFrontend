<template>
  <div id="Init"> </div>
</template>

<script>
  export default {
    name: 'Init',
    async created() {
      this.$store.commit('SetLoading', true);

      setTimeout(() => {
        this.$store.commit('SetLoading', false);
        this.$store.commit('SetIsInit', true);
        if (this.$store.state.FirstInWebSiteURL === '') {
          this.$router.replace({ name: 'Games' });
        } else {
          location.href = this.$store.state.FirstInWebSiteURL;
        }
      }, 500);
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

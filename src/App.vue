<template>
  <div
    id="app"
    v-loading.fullscreen.lock="isLoading"
    :data-theme="nowThemeInfo"
    :style="appStyleJudge()"
  >
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    components: {},
    data() {
      return {};
    },
    created() {
      this.resizeEvent();
      window.addEventListener('resize', this.resizeEvent);
    },
    watch: {
      $route: {
        handler: function (to) {
          if (to.matched.find((it) => it.name === 'Console' || it.name === 'Init')) {
            this.isShowHeaderFooter = true;
          } else {
            this.isShowHeaderFooter = false;
          }
        },
      },
    },
    methods: {
      resizeEvent() {
        if (window.innerWidth < 768) {
          this.$store.commit('SetIsMobile', true);
        } else {
          this.$store.commit('SetIsMobile', false);
        }
      },
      appStyleJudge() {
        if (process.env.VUE_APP_UI === 'pc') {
          return 'min-width:1200px;';
        } else {
          return '';
        }
      },
    },
    computed: {
      nowThemeInfo() {
        return this.$store.state.nowThemeInfo;
      },
      isLoading() {
        return this.$store.state.isLoading;
      },
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeEvent);
    },
  };
</script>

<style lang="scss">
  html {
    font-family: Arial, ReviseText, Microsoft JhengHei, Microsoft YaHei, sans-serif;
    font-size: 13px;
  }

  html,
  body,
  #app {
    height: 100%;
  }
</style>

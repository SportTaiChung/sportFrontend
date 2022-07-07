<template>
  <div
    id="app"
    v-loading.fullscreen.lock="isLoading"
    :data-theme="nowThemeInfo"
    :style="appStyleJudge()"
  >
    <router-view />

    <QuickBetPanel v-if="quickBetData.isShow"></QuickBetPanel>
  </div>
</template>

<script>
  import QuickBetPanel from '@/components/QuickBetPanel';
  export default {
    name: 'App',
    components: {
      QuickBetPanel,
    },
    data() {
      return {};
    },
    created() {
      this.resizeEvent();
      window.addEventListener('resize', this.resizeEvent);
      window.lib = this.$lib;
    },
    mounted() {
      this.$store.commit('SetScreenWidth', window.innerWidth);
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
    computed: {
      nowThemeInfo() {
        return this.$store.state.nowThemeInfo;
      },
      isLoading() {
        return this.$store.state.isLoading;
      },
      quickBetData() {
        return this.$store.state.BetCart.quickBetData;
      },
    },
    methods: {
      resizeEvent() {
        this.$store.commit('SetScreenWidth', window.innerWidth);
        if (window.innerWidth < 768) {
          this.$store.commit('SetIsMobile', true);
        } else {
          this.$store.commit('SetIsMobile', false);
        }
      },
      appStyleJudge() {
        if (
          process.env.VUE_APP_UI === 'pc' &&
          this.$route.name !== 'HistoryRecord' &&
          this.$route.name !== 'GameResult' &&
          this.$route.name !== 'Ann' &&
          this.$route.name !== 'Login'
        ) {
          return 'min-width:1400px;';
        } else {
          return '';
        }
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
    width: 100%;
  }
</style>

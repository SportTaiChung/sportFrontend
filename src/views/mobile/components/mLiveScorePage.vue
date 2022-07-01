<template>
  <div id="mLiveScorePage">
    <iframe :src="src"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'mLiveScorePage',
    computed: {
      src() {
        return this.$conf.JumpLink.scoreLive;
      },
    },
  };
</script>

<style lang="scss" scoped>
  #mLiveScorePage {
    flex: 1;
    iframe {
      height: 100%;
      width: 100%;
      border: none;
    }
  }
</style>

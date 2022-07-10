<template>
  <div id="mStrayCounter">
    <StrayCount></StrayCount>
  </div>
</template>

<script>
  import StrayCount from '@/components/StrayCount';

  export default {
    name: 'mStrayCounter',
    components: {
      StrayCount,
    },
  };
</script>

<style lang="scss" scoped>
  #mStrayCounter {
    height: 100%;
    overflow-y: auto;
  }
</style>

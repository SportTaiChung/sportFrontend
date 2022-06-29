<template>
  <div id="Ann">
    <div class="main-title">
      <h3>{{ $t('GamesHeader.GameResult') }}</h3>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Ann',
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #Ann {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    min-width: 980px;

    .main-title {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      height: 70px;
      @include base-background();
      // background-color: #30679e;
      h3 {
        margin: 0;
        color: #fff;
        font-size: 21px;
        line-height: normal;
        margin-left: 2rem;
      }
    }
  }
</style>

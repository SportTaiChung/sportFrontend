<script>
  import { PopperWrapper } from 'floating-vue';

  export default {
    ...PopperWrapper,
    name: 'NavMenuGameType',
    vPopperTheme: 'nav-menu-game-type',
  };
</script>

<style lang="scss">
  .v-popper--theme-nav-menu-game-type {
    .v-popper__arrow-inner {
      border-color: #e8e8e8 !important;
    }
  }
</style>

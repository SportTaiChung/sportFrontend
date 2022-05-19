<template>
  <div id="mobileFooter">
    <ul class="footer-container">
      <li class="footer-item">
        <i class="el-icon-basketball"></i>
        <span>快速轉帳</span>
      </li>
      <li class="footer-item">
        <i class="el-icon-basketball"></i>
        <span>其他聯盟</span>
      </li>
      <li class="footer-item">
        <i class="el-icon-basketball"></i>
        <span>點此投注</span>
      </li>
      <li class="footer-item">
        <i class="el-icon-basketball"></i>
        <span>投注紀錄</span>
      </li>
      <li class="footer-item">
        <i class="el-icon-basketball"></i>
        <span>更多</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'mobileFooter',
    computed: {
      gameStore() {
        return this.$store.state.Game;
      },
    },
    methods: {
      routerGoBack() {
        this.$router.push(-1);
      },
      callGetMenuGameCatList() {
        this.$store.commit('SetLoading', true);
        this.$store.dispatch('Game/GetMenuGameCatList').finally(() => {
          // 手動切換gameType時,預設要選取第一個
          // this.menuItemClickHandler(this.gameStore.MenuList[0], null, 0);
          this.$store.commit('SetLoading', false);
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #mobileFooter {
    ul.footer-container {
      width: 100%;
      height: 4.8rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: #eee;
      border-top: 1px solid #ccc;
      box-shadow: 0 -3px 6px rgba(0, 0, 0, 0.1);

      li.footer-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 1.125rem;
        padding: 3px;

        &:active {
          background-color: #ddd;
        }
        i {
          font-size: 180%;
          margin-bottom: 5px;
        }
      }
    }
  }
</style>

<template>
  <div id="mobileFooter">
    <ul class="footer-container">
      <li class="footer-item">
        <img class="icon" src="@/assets/img/mobile/icon_footer_transfer.svg" alt="" />
        <span>快速轉帳</span>
      </li>
      <li class="footer-item">
        <img class="icon" src="@/assets/img/mobile/icon_footer_league.svg" alt="" />
        <span>其他聯盟</span>
      </li>
      <li class="footer-item" @click="onBetViewClick">
        <!-- <i class="el-icon-basketball"></i> -->
        <div class="icon circle-bets" :class="hasBetItem ? 'hasBetItem' : ''">
          <span class="num">{{ this.betCartStore.betCartList.length }}</span>
        </div>
        <span>點此投注</span>
      </li>
      <li class="footer-item" @click="onBetRecordViewClick">
        <img class="icon" src="@/assets/img/mobile/icon_footer_record.svg" alt="" />
        <span>投注紀錄</span>
      </li>
      <li class="footer-item">
        <img class="icon" src="@/assets/img/mobile/icon_footer_more.svg" alt="" />
        <span>更 多</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'mobileFooter',
    computed: {
      betCartStore() {
        return this.$store.state.BetCart;
      },
      hasBetItem() {
        return this.betCartStore.betCartList.length > 0;
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
          this.$store.commit('SetLoading', false);
        });
      },
      onBetViewClick() {
        this.hasBetItem && this.$emit('onOpenBetInfoPopup');
      },
      onBetRecordViewClick() {
        this.$emit('onOpenBetRecordView');
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
        justify-content: flex-end;
        align-items: center;
        height: 100%;
        font-size: 1.125rem;
        padding: 3px;
        color: #5f5f5f;

        &:active {
          background-color: #ddd;
        }
        .icon {
          margin-bottom: 5px;
          width: 2.1rem;
          height: auto;
        }
        .circle-bets {
          width: 2.1rem;
          height: 2.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #5f5f5f;
          border-radius: 50%;
          text-align: center;
          span.num {
            color: #5f5f5f;
            font-size: 1.45rem;
            font-weight: bold;
          }
          &.hasBetItem {
            border: 2px solid #ff9600;
            span.num {
              color: #ff9600;
            }
          }
        }
      }
    }
  }
</style>

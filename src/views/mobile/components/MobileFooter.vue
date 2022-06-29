<template>
  <div id="mobileFooter">
    <ul class="footer-container">
      <li class="footer-item" @click="openLive()">
        <img class="icon" src="@/assets/img/mobile/icon_footer_palysvg.svg" alt="" />
        <span>{{ $t('Common.Live') }}</span>
      </li>
      <li class="footer-item" @click="openLeaguesPanel()">
        <img
          class="icon"
          :src="
            require(`@/assets/img/mobile/icon_footer_league${hasLeagueFiltered ? '_on' : ''}.svg`)
          "
          alt=""
        />
        <span>{{ $t('Common.OtherLeague') }}</span>
      </li>
      <li class="footer-item" @click="onBetViewClick">
        <div class="icon circle-bets" :class="hasBetItem ? 'hasBetItem' : ''">
          <span class="num">{{ this.betCartStore.betCartList.length }}</span>
        </div>
        <span :style="hasStrayStyle"> {{ strayOdd || $t('Common.ClickBet') }}</span>
      </li>
      <li class="footer-item" @click="onBetRecordViewClick">
        <img class="icon" src="@/assets/img/mobile/icon_footer_record.svg" alt="" />
        <span>{{ $t('HistoryRecord.BetHistoryRecord') }}</span>
      </li>
      <li class="footer-item" @click="openMenuPanel">
        <img class="icon" src="@/assets/img/mobile/icon_footer_more.svg" alt="" />
        <span>{{ $t('Common.MoreSpace') }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'mobileFooter',
    props: {
      hasLeagueFiltered: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      betCartStore() {
        return this.$store.state.BetCart;
      },
      hasBetItem() {
        return this.betCartStore.betCartList.length > 0;
      },
      strayOdd() {
        return this.betCartStore.strayOdd;
      },
      hasStrayStyle() {
        return {
          color: this.strayOdd ? '#ff9600' : '#000000',
        };
      },
    },
    methods: {
      onBetViewClick() {
        this.hasBetItem && this.$emit('openBetInfoPopup');
      },
      onBetRecordViewClick() {
        this.$emit('openBetRecordView');
      },
      openMenuPanel() {
        this.$emit('openMenuPanel');
      },
      openLive() {
        const safariWindow = window.open();
        safariWindow.opener = null;
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('Game/GetLiveURL')
          .then((res) => {
            safariWindow.location.href = res.data;
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
      openLeaguesPanel() {
        this.$emit('openLeaguesPanel');
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
      z-index: 87;

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
          margin-bottom: 6px;
          width: 1.825rem;
          height: auto;
        }
        .circle-bets {
          width: 2.2rem;
          height: 2.2rem;
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
            line-height: normal;
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

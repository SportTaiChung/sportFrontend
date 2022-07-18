<template>
  <div
    id="mFloatingBetCart"
    @mousedown="start()"
    @touchstart="start()"
    @mouseup="stop()"
    @touchend="stop()"
    @click="moveCount == 0 && $emit('openBetInfoPopup')"
    :style="toCSSPosAndScale"
  >
    <div class="itemLength">{{ this.betCartStore.betCartList.length }}</div>
    <div class="odds">{{ $lib.trunc(strayOdd, 2) || $t('Common.Bet') }}</div>
  </div>
</template>

<script>
  export default {
    name: 'mFloatingBetCart',
    data() {
      return {
        isDragging: false,
        moveCount: 0,
        x: window.innerWidth - 80,
        y: window.innerHeight - 150,
      };
    },
    computed: {
      toCSSPosAndScale() {
        const { x, y } = this;
        const scale = this.isDragging ? 1.2 : 1;

        return {
          position: 'fixed',
          top: y + 'px',
          left: x + 'px',
          zIndex: 10,
          transform: `translate(-50%, -50%) scale(${scale})`,
        };
      },
      betCartStore() {
        return this.$store.state.BetCart;
      },
      betCartLength() {
        return this.betCartStore.betCartList.length;
      },
      hasBetItem() {
        return this.betCartStore.betCartList.length > 0;
      },
      strayOdd() {
        return this.betCartStore.strayOdd;
      },
    },
    methods: {
      start() {
        this.isDragging = true;
        this.moveCount = 0;
      },
      stop() {
        this.isDragging = false;
      },
      move(x = this.x, y = this.y) {
        const minX = this.$el.clientWidth / 2;
        const minY = this.$el.clientHeight / 2;
        const maxX = window.innerWidth - this.$el.clientWidth / 2;
        const maxY = window.innerHeight - this.$el.clientHeight / 2;
        this.x = x > maxX ? maxX : x < minX ? minX : x;
        this.y = y > maxY ? maxY : y < minY ? minY : y;
      },
      _disposerOnMove(e) {
        if (this.isDragging) {
          e = e.touches ? e.touches[0] : e;
          this.move(e.clientX, e.clientY);
          this.moveCount++;
        }
      },
      _disposerOnResize() {
        this.move();
      },
    },
    mounted() {
      this.move();
      ['touchmove', 'mousemove'].forEach((evtName) => {
        window.addEventListener(evtName, this._disposerOnMove);
      });
      window.addEventListener('resize', this._disposerOnResize);
    },
    beforeDestroy() {
      ['touchmove', 'mousemove'].forEach((evtName) => {
        window.removeEventListener(evtName, this._disposerOnMove);
      });
      window.removeEventListener('resize', this._disposerOnResize);
    },
  };
</script>

<style lang="scss" scoped>
  #mFloatingBetCart {
    position: fixed;
    z-index: 6;
    width: 55px !important;
    height: 55px !important;
    border-radius: 50%;
    background-color: #ffcc00;
    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    transform: translate(-50%, -50%);
    transition: transform 150ms ease;
    box-shadow: 2px 2px 6px rgb(0 0 0 / 30%);

    .itemLength {
      font-size: 1.8rem;
      font-weight: 700;
    }

    .odds {
      font-size: 1.12rem;
      font-weight: 400;
    }

    &:hover {
      background-color: #ffda44;
    }

    &:active {
      background-color: #ffcc00;
    }
  }
</style>

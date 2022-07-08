<template>
  <div class="marquee" ref="container" @mouseover="speedFactor = 1" @mouseleave="speedFactor = 1">
    <div class="content" ref="content" :style="translateX">{{ playText }}</div>
  </div>
</template>

<script>
  export default {
    name: 'Marquee',
    props: {
      speed: {
        type: Number,
        default() {
          return 0.8;
        },
      },
    },
    data() {
      return {
        totalX: 0,
        offsetX: 0,
        isPlaying: false,
        raf: null,
        speedFactor: 1, // 0 ~ 1 float
        playText: '',
        stackText: [],
      };
    },
    mounted() {
      const updateFunc = (timestamp) => {
        if (this.isPlaying) {
          const { container, content } = this.$refs;
          this.totalX = container.clientWidth + content.clientWidth;
          this.offsetX -= this.speed * this.speedFactor;
          if (this.offsetX < -this.totalX) {
            this.offsetX = 0;

            this.stackText[0].shift();
            if (this.stackText[0].length === 0) {
              this.stackText.shift();
            }
            this.updatePlayMarquee();
          }
        }
        this.raf = requestAnimationFrame(updateFunc);
      };
      requestAnimationFrame(updateFunc);
    },
    beforeDestroy() {
      cancelAnimationFrame(this.raf);
    },
    computed: {
      translateX() {
        return {
          transform: `translateX(${this.offsetX}px)`,
        };
      },
    },
    watch: {
      stackText: {
        handler() {
          if (!this.isPlaying) {
            this.updatePlayMarquee();
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      play() {
        this.isPlaying = true;
      },
      pause() {
        this.isPlaying = false;
      },
      stop() {
        this.isPlaying = false;
        this.offsetX = 0;
      },
      pushStack(data) {
        this.stackText.push(data);
      },
      updatePlayMarquee() {
        if (this.stackText.length !== 0) {
          this.stop();
          this.play();
          if (this.stackText[0][0].length !== 0) {
            this.playText = this.stackText[0][0];
          }
        } else {
          this.isPlaying = false;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .marquee {
    width: 100%;
    overflow: hidden;
    position: relative;

    color: #000;
    font-size: 1rem;
    line-height: normal;
    white-space: nowrap;

    .content {
      display: inline-block !important;
      position: relative;
      left: 100%;
      transform: translateX(0%);
    }
  }
</style>

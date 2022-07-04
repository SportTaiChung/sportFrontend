<template>
  <div class="marquee" ref="container" @mouseover="speedFactor = 1" @mouseleave="speedFactor = 1">
    <div class="content" ref="content" :style="translateX">{{ text }}</div>
  </div>
</template>

<script>
  export default {
    name: 'Marquee',
    props: {
      text: {
        type: String,
        default() {
          return '';
        },
      },
      speed: {
        type: Number,
        default() {
          return 0.5;
        },
      },
    },
    data() {
      return {
        totalX: 0,
        offsetX: 0,
        isPlaying: true,
        raf: null,
        speedFactor: 1, // 0 ~ 1 float
      };
    },
    computed: {
      translateX() {
        return {
          transform: `translateX(${this.offsetX}px)`,
        };
      },
    },
    watch: {
      text() {
        this.stop();
        this.play();
      },
    },
    mounted() {
      const updateFunc = (timestamp) => {
        if (this.isPlaying) {
          const { container, content } = this.$refs;
          this.totalX = container.clientWidth + content.clientWidth;
          this.offsetX -= this.speed * this.speedFactor;
          if (this.offsetX < -this.totalX) {
            this.offsetX = 0;
          }
        }
        this.raf = requestAnimationFrame(updateFunc);
      };
      requestAnimationFrame(updateFunc);
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
    },
    beforeDestroy() {
      cancelAnimationFrame(this.raf);
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

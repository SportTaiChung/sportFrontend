<template>
  <div id="mAnnouncement">
    <div class="card-list">
      <div
        class="card"
        v-for="(it, i) in AnnData"
        :key="i"
        :class="activeIndex === i ? 'active' : ''"
        @click="activeIndex = i"
      >
        <div class="title">
          <div class="text"> {{ $t('Ann.System') }} </div>
          <div class="date"> {{ $lib.timeFormatWithOutMMss(it.CreateTimeStr) }} </div>
          <i class="arrow el-icon-arrow-down"></i>
        </div>
        <div class="content">
          <div class="text"> {{ it.content }} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mAnnouncement',
    data() {
      return {
        AnnData: [],
        activeIndex: 0,
      };
    },
    created() {
      this.getAnnouncement();
    },
    methods: {
      getAnnouncement() {
        this.$store.dispatch('Game/GetAnnouncement').then((res) => {
          if (res.data && res.data.length) {
            this.AnnData = res.data.reverse();
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  #mAnnouncement {
    height: 100%;
    background-color: #e4e4e4;

    .card-list {
      height: 100%;
      padding: 10px;
      overflow: auto;
      .card {
        font-size: 1.125rem;
        letter-spacing: 0.05rem;
        background-color: #f3f3f3;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 1rem;
        transition: 250ms ease;

        .title {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #dfdfdf;
          position: relative;
          min-height: 2.6rem;
          padding: 3px 1rem;

          .text {
            line-height: normal;
          }
          .date {
            flex-grow: 0;
            flex-shrink: 0;
            color: #999;
            font-size: 1rem;
            margin-left: auto;
            margin-right: 2.5rem;
            line-height: normal;
          }
          i.arrow {
            position: absolute;
            right: 1rem;
            color: #aaa;
            font-size: 1.6rem;
            font-weight: bold;
            transition: 250ms ease;
          }
        }

        .content {
          min-height: 2.6rem;
          padding: 6px 1rem;
          display: flex;
          align-items: center;
          overflow: hidden;
          .text {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            line-height: 20px;
            color: #666;
          }
        }

        &.active {
          background-color: #fff;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);

          .title i.arrow {
            transform: scaleY(-1);
          }

          .content {
            .text {
              white-space: normal;
              overflow: inherit;
              word-break: break-all;
              word-wrap: break-word;
              color: #000;
            }
          }
        }
      }
    }
  }
</style>

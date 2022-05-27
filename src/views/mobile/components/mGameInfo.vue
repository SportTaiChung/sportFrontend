<template>
  <div class="mGameInfo">
    <div
      ref="collapseContainer"
      class="collapse-container"
      :class="isExpanded ? 'on' : ''"
      :style="maxHeight"
    >
      <table>
        <thead ref="thead" @click="$emit('toggleCollapse')">
          <tr>
            <th>
              <span class="title">{{ source.LeagueNameStr }}</span>
              <img
                src="@/assets/img/mobile/btn_arrow_w.svg"
                class="arrow"
                :class="isExpanded ? 'isExpanded' : ''"
              />
            </th>
          </tr>
        </thead>

        <tbody ref="collapseTarget" class="collapse-target">
          <template v-for="(teamData, teamIndex) in source.Team">
            <template v-if="teamData.EvtStatus === 1">
              <tr
                v-for="(teamDataRowNum, rowIndex) in teamData.Row"
                :key="`${teamIndex}-${rowIndex}`"
                :set="(hasTie = teamData.hasDrewOdds && rowIndex === 0)"
              >
                <!-- 賽事 -->
                <td class="round-block" :class="hasTie ? 'height-lv2' : 'height-lv1'">
                  <div class="team-block">
                    <!-- 判斷主客場對調 -->
                    <template v-if="$SportLib.isHomeAwayReverse(source.CatID)">
                      <div>
                        <div class="team">{{ teamData.AwayTeamStr }}</div>
                        <div class="team">{{ teamData.HomeTeamStr }}</div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="team">{{ teamData.HomeTeamStr }}</div>
                      <div class="team">{{ teamData.AwayTeamStr }}</div>
                    </template>

                    <!-- 是否顯示和局 -->
                    <div class="team" v-if="teamData.hasDrewOdds && rowIndex === 0"> 和局 </div>
                  </div>

                  <!-- 時間 -->
                  <div class="time" v-if="rowIndex === 0">
                    {{ $lib.timeFormatMMDD(teamData.ScheduleTimeStr) }}
                    {{ $lib.timeFormatHHmm(teamData.ScheduleTimeStr) }}
                  </div>

                  <!-- 收藏 -->
                  <div class="rightFavoriteBlock">
                    <div class="star"></div>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import mixin from './GamesTableMixin';
  export default {
    mixins: [mixin],
    name: 'mGameInfo',
    components: {},
    props: {
      index: {
        type: Number,
      },
      source: {
        type: Object,
        default() {
          return {};
        },
      },
      isExpanded: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    data() {
      return {
        isMounted: false,
      };
    },
    methods: {
      getCurrentHeight() {
        const { thead, collapseTarget } = this.$refs;
        return thead.offsetHeight + collapseTarget.offsetHeight;
      },
    },
    computed: {
      maxHeight() {
        if (!this.isMounted) return;
        if (!this.isExpanded) return;
        return {
          height: this.getCurrentHeight() + 'px',
        };
      },

      hasMoreGame() {
        return this.selectWagerTypeKey === 1;
      },
    },
    mounted() {
      this.isMounted = true;
      this.$refs.collapseContainer.addEventListener('transitionstart', (e) => {
        if (e.propertyName === 'height') {
          // console.log('start');
        }
      });
      this.$refs.collapseContainer.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'height') {
          // console.log('end');
          if (!this.isExpanded) {
            this.$refs.collapseTarget.style.display = 'none';
          } else {
            // this.$refs.collapseContainer.style.height = 'auto';
          }
        }
      });
      if (!this.isExpanded) {
        this.$refs.collapseTarget.style.display = 'none';
      }
    },
    watch: {
      isExpanded(isExpanded) {
        if (isExpanded) {
          this.$refs.collapseTarget.style.display = '';
        }
      },
    },
  };
</script>

<style lang="scss">
  $row-height: 2.4rem;
  $font-size: 1rem;

  .mGameInfo {
    position: relative;
    z-index: 1;

    .collapse-container {
      position: relative;
      overflow: hidden;
      width: fit-content;
      min-width: 100%;
      transition: height 300ms ease-out;
      height: $row-height;
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: #ccc;
      }

      .collapse-target {
        transition: 350ms ease;
        opacity: 0;
      }

      &.on {
        &::after {
          content: '';
          display: none;
        }
        .collapse-target {
          opacity: 1;
        }
      }
    }

    table {
      position: relative;
      table-layout: fixed;
      border-spacing: 0;
      width: 100%;
      font-size: $font-size;

      th {
        display: flex;
        align-items: center;
        height: $row-height;
        position: relative;
        background-color: #e8e8e8;
        text-align: left;
        padding-left: 0.8rem;
        overflow: hidden;
        font-weight: normal;
        color: #444;
        cursor: pointer;

        .title {
          width: calc(100% - 2.2rem);
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          height: 70%;
          width: 1px;
          background-color: #888;
        }

        img.arrow {
          width: 1.1rem;
          float: right;
          margin-right: 1rem;
          filter: invert(30%);
          transform: rotate(-90deg);
          transition: 350ms ease;
          &.isExpanded {
            transform: rotate(0);
          }
        }
      }

      td.round-block {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
        padding-left: 0.8rem;
        height: $row-height * 2;

        &.height-lv1 {
          height: $row-height * 2;
        }

        &.height-lv2 {
          height: $row-height * 3;
        }

        .team-block {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          flex: auto;
          .team {
            color: #000;
            font-size: $font-size;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .time {
          color: #888888;
          font-size: $font-size * 0.75;
          line-height: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin: 0.2rem 0;
        }
      }
    }
  }
</style>

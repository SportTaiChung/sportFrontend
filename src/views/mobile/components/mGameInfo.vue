<template>
  <div ref="root" class="mGameInfo" :style="maxHeight" :class="isExpanded ? '' : 'closed'">
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

      <tbody ref="tbody">
        <template v-for="(teamData, teamIndex) in source.Team">
          <template v-if="teamData.EvtStatus === 1">
            <tr
              v-for="(teamDataRowNum, rowIndex) in teamData.Row"
              :key="`${teamIndex}-${rowIndex}`"
              :set="(hasTie = teamData.hasDrewOdds && rowIndex === 0)"
            >
              <!-- 賽事 -->
              <td class="round-block" :class="hasTie ? 'height-big' : 'height-normal'">
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
    computed: {
      maxHeight() {
        if (!this.isMounted) return;
        if (!this.isExpanded) return;
        const { thead, tbody } = this.$refs;
        return {
          height: thead.offsetHeight + tbody.offsetHeight + 'px',
        };
      },
    },
    mounted() {
      this.isMounted = true;
      this.$refs.root.addEventListener(
        'transitionend',
        (e) => {
          if (!this.isExpanded && e.propertyName === 'height') {
            this.$refs.tbody.style.display = 'none';
          }
        },
        { once: true }
      );
      if (!this.isExpanded) {
        this.$refs.tbody.style.display = 'none';
      }
    },
    watch: {
      isExpanded(isExpanded) {
        if (isExpanded) {
          this.$refs.tbody.style.display = '';
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
    overflow: hidden;
    width: fit-content;
    min-width: 100%;
    transition: height 300ms ease-out;

    &.closed {
      height: $row-height !important;
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

      tbody {
        transition: 350ms ease;
        opacity: 0;
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

        &.height-normal {
          height: $row-height * 2;
        }

        &.height-big {
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

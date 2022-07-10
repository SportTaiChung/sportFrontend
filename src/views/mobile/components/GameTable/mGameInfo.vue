<template>
  <div class="mGameInfo" :class="isExpanded ? '' : 'closed'">
    <table>
      <thead @click="$emit('toggleCollapse')">
        <tr>
          <th>
            <span class="title">{{ source.LeagueNameStr }}</span>
            <img class="arrow" src="@/assets/img/mobile/btn_arrow_w.svg" />
          </th>
        </tr>
      </thead>

      <tbody v-show="isExpanded">
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
                  <!-- 顯示雙打1 -->
                  <template v-if="teamData.HomePtAndNation.length !== 0">
                    <div
                      class="team"
                      :title="`${teamData.HomePtAndNation[0]}-${teamData.HomePtAndNation[1]} / ${teamData.HomePtAndNation[2]}-${teamData.HomePtAndNation[3]}`"
                    >
                      {{ teamData.HomePtAndNation[0] }}
                      <span class="teamPt">-{{ teamData.HomePtAndNation[1] }}</span>
                      <span> /</span>
                      {{ teamData.HomePtAndNation[2] }}
                      <span class="teamPt">-{{ teamData.HomePtAndNation[3] }}</span>
                    </div>
                  </template>
                  <!-- 顯示雙打2 -->
                  <template v-if="teamData.AwayPtAndNation.length !== 0">
                    <div
                      class="team"
                      :title="`${teamData.AwayPtAndNation[0]}-${teamData.AwayPtAndNation[1]} / ${teamData.AwayPtAndNation[2]}-${teamData.AwayPtAndNation[3]}`"
                    >
                      {{ teamData.AwayPtAndNation[0] }}
                      <span class="teamPt">-{{ teamData.AwayPtAndNation[1] }}</span>
                      <span> /</span>
                      {{ teamData.AwayPtAndNation[2] }}
                      <span class="teamPt">-{{ teamData.AwayPtAndNation[3] }}</span>
                    </div>
                  </template>
                  <!-- 只需要顯示一個隊伍 -->
                  <template v-if="teamData.AwayTeamStr === '.'">
                    <div>
                      <div class="team"
                        >{{ teamData.HomeTeamStr }}

                        <span class="teamPt" v-if="teamData.HomePtNameStr !== ''">
                          -{{ teamData.HomePtNameStr }}</span
                        >
                      </div>
                    </div>
                  </template>
                  <template v-else-if="teamData.HomeTeamStr === '.'">
                    <div class="team"
                      >{{ teamData.AwayTeamStr }}
                      <span class="teamPt" v-if="teamData.AwayPtNameStr !== ''">
                        -{{ teamData.AwayPtNameStr }}</span
                      >
                    </div>
                  </template>
                  <template v-else>
                    <!-- 判斷主客場對調 -->
                    <template v-if="!teamData.SetFlag">
                      <div class="team"
                        >{{ teamData.AwayTeamStr }}
                        <span class="teamPt" v-if="teamData.AwayPtNameStr !== ''">
                          -{{ teamData.AwayPtNameStr }}</span
                        >
                      </div>
                      <div class="team"
                        >{{ teamData.HomeTeamStr }}
                        <span class="teamPt" v-if="teamData.HomePtNameStr !== ''">
                          -{{ teamData.HomePtNameStr }}</span
                        >
                      </div>
                    </template>
                    <template v-else>
                      <div class="team"
                        >{{ teamData.HomeTeamStr }}
                        <span class="teamPt" v-if="teamData.HomePtNameStr !== ''">
                          -{{ teamData.HomePtNameStr }}</span
                        >
                      </div>
                      <div class="team"
                        >{{ teamData.AwayTeamStr }}
                        <span class="teamPt" v-if="teamData.AwayPtNameStr !== ''">
                          -{{ teamData.AwayPtNameStr }}</span
                        >
                      </div>
                    </template>
                  </template>

                  <!-- 是否顯示和局 -->
                  <div class="team" v-if="teamData.hasDrewOdds && rowIndex === 0">
                    {{ $t('Common.DrewOdd') }}
                  </div>

                  <!-- 時間 & 收藏按鈕 -->
                  <div class="info-timeStarRow" v-if="rowIndex === 0">
                    <!-- 時間 -->
                    <div class="time">
                      {{ $lib.timeFormatMMDD(teamData.ScheduleTimeStr) }}
                      {{ $lib.timeFormatHHmm(teamData.ScheduleTimeStr) }}
                    </div>
                    <!-- 收藏 -->
                    <div
                      class="star"
                      :class="starCSSJudge(teamData.EvtID)"
                      @click="addFavoriteHandler(teamData.EvtID)"
                    >
                    </div>
                  </div>
                </div>
              </td>

              <!-- 小圓點 滾動指示 -->
              <div class="dot-wrap" v-show="dotStatus.visible">
                <div class="dot left" :class="!dotStatus.isScrollToTheEnd ? 'active' : ''"></div>
                <div class="dot right" :class="dotStatus.isScrollToTheEnd ? 'active' : ''"></div>
              </div>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'mGameInfo',
    components: {},
    props: {
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
      hasMoreGame: {
        type: Boolean,
        default() {
          return false;
        },
      },

      // 小圓點狀態
      dotStatus: {
        type: Object,
        default() {
          return {
            visible: false,
            isScrollToTheEnd: false,
          };
        },
      },
    },
    methods: {
      starCSSJudge(EvtID) {
        if (this.$store.state.Setting.UserSetting.favorites.indexOf(EvtID) > -1) {
          return 'active';
        } else {
          return '';
        }
      },
      addFavoriteHandler(EvtID) {
        this.$store.commit('Setting/addFavorites', EvtID);
      },
    },
  };
</script>

<style lang="scss">
  $row-height: 2.4rem;
  $font-size: 1rem;

  .mGameInfo {
    position: relative;
    min-width: 100%;

    &.closed {
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
      th::after,
      th .arrow {
        transform: rotate(0deg);
      }
    }

    table {
      position: relative;
      table-layout: fixed;
      border-spacing: 0;
      width: 100%;
      font-size: $font-size;
      background-color: #fff;

      tr {
        position: relative;

        // 小圓點
        .dot-wrap {
          position: absolute;
          right: -80%;
          // bottom: 3px; // https://github.com/w3c/csswg-drafts/issues/1899
          z-index: 9;
          display: flex;
          transform: translateY(-8px);

          .dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #ddd;
            margin-right: 5px;
            &.active {
              background-color: #a3d3c3;
            }
          }
        }
      }

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
          display: none; // 因新UI需求先隱藏
        }

        img.arrow {
          width: 1.1rem;
          float: right;
          margin-right: 1rem;
          filter: invert(30%);
          transform: rotate(-90deg);
          transition: 200ms ease;
          display: none; // 因新UI需求先隱藏
        }
      }

      td.round-block {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
        padding-left: 0.8rem;
        height: $row-height * 2;
        background-color: #fff;

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
          .teamPt {
            color: gray;
          }
          .info-timeStarRow {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;

            .time {
              color: #888888;
              font-size: 0.75rem;
              line-height: normal;
            }
            .star {
              width: $font-size * 1.25;
              height: $font-size * 1.25;
              background: url('~@/assets/img/common/icon_star.svg') no-repeat center bottom;
              background-size: 100% auto;
              background-position: center bottom;
              background-repeat: no-repeat;
              margin: auto 15px auto auto;
              display: block;
              cursor: pointer;

              &:active,
              &.active {
                background-position: center top;
              }
            }
          }
        }
      }
    }
  }
</style>

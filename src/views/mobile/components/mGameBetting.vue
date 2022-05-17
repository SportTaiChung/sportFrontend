<template>
  <div id="mGameBetting">
    <table class="betting-table">
      <thead>
        <tr>
          <th v-for="(it, i) in showTableHeaderList" :key="i"> {{ it.showName }}</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(teamData, teamIndex) in gameData.Team">
          <template v-if="teamData.EvtStatus === 1">
            <tr
              v-for="(teamDataRowNum, rowIndex) in teamData.Row"
              :key="`${teamIndex}-${rowIndex}`"
            >
              <td
                class="wager-container"
                v-for="(wagerData, wagerIndex) in teamData.Wager"
                :key="wagerIndex"
              >
                <ul
                  class="wager-group"
                  :set="
                    ((sportData = $SportLib.WagerDataToShowData(
                      gameData.CatID,
                      wagerData,
                      rowIndex
                    )),
                    (isShowDrewOdd = teamData.hasDrewOdds && rowIndex === 0))
                  "
                >
                  <template v-if="wagerData.isNoData">
                    <!-- 如果有和 -->
                    <template v-if="isShowDrewOdd">
                      <li class="wager-cell"> </li>
                      <li class="wager-cell"> </li>
                      <li class="wager-cell"> </li>
                    </template>
                    <template v-else>
                      <li class="wager-cell"> </li>
                      <li class="wager-cell"> </li>
                    </template>
                  </template>

                  <template v-else>
                    <!-- 只有單一個Odd Layout -->
                    <template v-if="sportData.layoutType === 'single'">
                      <li class="wager-cell">
                        <Odd :OddValue="sportData.topPlayOdd" />
                      </li>
                      <li class="wager-cell">
                        <Odd :OddValue="sportData.bottomPlayOdd" />
                      </li>
                    </template>
                    <!-- 其他正常Layout -->
                    <template v-else>
                      <li class="wager-cell">
                        <div class="cell-left"> {{ sportData.topPlayMethod }} </div>
                        <div class="cell-right"> <Odd :OddValue="sportData.topPlayOdd" /> </div>
                      </li>
                      <li class="wager-cell">
                        <div class="cell-left"> {{ sportData.bottomPlayMethod }} </div>
                        <div class="cell-right"> <Odd :OddValue="sportData.bottomPlayOdd" /></div>
                      </li>
                    </template>

                    <!-- '和' 玩法顯示 -->
                    <template v-if="isShowDrewOdd">
                      <template
                        v-if="
                          wagerData.Odds[0].DrewOdds === '0' ||
                          wagerData.Odds[0].DrewOdds === '0.00'
                        "
                      >
                        <li class="wager-cell"> </li>
                      </template>
                      <template v-else>
                        <li class="wager-cell">
                          <Odd :OddValue="wagerData.Odds[0].DrewOdds" />
                        </li>
                      </template>
                    </template>
                  </template>
                </ul>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
  import Odd from '@/components/Odd';

  export default {
    name: 'mGameBetting',
    components: {
      Odd,
    },
    props: {
      gameData: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    computed: {
      showTableHeaderList() {
        return this.$store.getters['Game/showTableHeaderList'];
      },
    },
  };
</script>

<style lang="scss" scoped>
  #mGameBetting {
    table.betting-table {
      width: 100%;
      border-spacing: 0;
      font-size: 1.15rem;

      th {
        min-width: 100px;
        height: 33px;
        background-color: #e8e8e8;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: normal;
      }
      td {
        min-width: 100px;
        height: 33px;
      }

      td.wager-container {
        .wager-cell {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          height: 35px;
          border-style: solid;
          border-color: #e8e8e8;
          border-width: 0 1px 1px 0;

          .cell-left {
            flex: 1;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .cell-right {
            flex: 1;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
</style>

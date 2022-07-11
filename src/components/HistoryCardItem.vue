<template>
  <div class="listCardItem">
    <!-- 一般投注 -->
    <template v-if="historyItem.BetType === 1">
      <div class="cardHeaderRow">
        <div class="playMethodName"> {{ historyItem.dataBet[0].WagerPosName }}</div>
        <div class="playMethodNameSupport">
          {{ historyItem.dataBet[0].CutLine }}
        </div>
        <div class="at"> @ </div>
        <div class="playBetOdd">
          {{ showOddValue(historyItem.dataBet[0].PayoutOddsStr) }}
        </div>
      </div>
      <div class="cardContentBlock">
        <div class="cardContentBlockRow">
          {{ `${historyItem.catName} - [${historyItem.dataBet[0].WagerGrpName}]` }}
        </div>
        <div class="cardContentBlockRow"> {{ historyItem.dataBet[0].LeagueName }} </div>
        <div class="cardContentBlockRow">
          <template v-if="historyItem.dataBet[0].AwayTeam === '.'">
            <div class="teamRow">{{ historyItem.dataBet[0].HomeTeam }}</div>
          </template>
          <template v-else-if="historyItem.dataBet[0].HomeTeam === '.'">
            <div class="teamRow">{{ historyItem.dataBet[0].AwayTeam }}</div>
          </template>
          <template v-else>
            <div class="ScoreColor" v-if="isSettlement && historyItem.dataBet[0].HomeScore !== ''">
              [{{ historyItem.dataBet[0].HomeScore }}]
            </div>
            <div class="cardContentBlockRowText">{{ historyItem.dataBet[0].HomeTeam }}</div>
            <div class="cardContentBlockRowText HomeTeamSign">({{ $t('Common.Home') }})</div>
            <div class="cardContentBlockRowText">
              <div class="vs"> v </div>
              <div
                class="ScoreColor"
                v-if="isSettlement && historyItem.dataBet[0].AwayScore !== ''"
              >
                [{{ historyItem.dataBet[0].AwayScore }}]
              </div>
              {{ historyItem.dataBet[0].AwayTeam }}
            </div>
          </template>
        </div>

        <div class="cardContentBlockRow">
          <div class="cardContentBlockWithHalfRow">
            {{ $t('Common.Bet') }}: {{ historyItem.Amount }}
          </div>

          <div class="cardContentBlockWithHalfRow" v-if="isSettlement">
            {{ $t('Common.Result') }}:
            <span class="resultText">{{ historyItem.ResultAmount }}</span>
          </div>
          <div class="cardContentBlockWithHalfRow" v-else>
            {{ $t('BetViewList.HighBack') }}:
            {{
              $lib.truncFloor(
                historyItem.Amount * (parseFloat(historyItem.dataBet[0].PayoutOddsStr) + 1)
              )
            }}
          </div>
        </div>
      </div>
    </template>

    <template v-if="historyItem.BetType === 99">
      <div class="strayContentBlock" @click="historyItem.isCollapse = !historyItem.isCollapse">
        <div class="strayContentBlockRow">
          <div>{{ $t('Common.Stray') }}</div>
          <div class="strayTitleInfoText">{{ historyItem.dataBet.length }}串1 x 1</div>
        </div>
        <div class="strayContentBlockRow">
          {{
            `${$t('Common.EachZu')}${historyItem.Amount}${$t('Common.Dollar')} x 1${$t(
              'Common.Group'
            )}) = ${historyItem.Amount}`
          }}
        </div>

        <!-- 過關詳細注單 -->

        <template v-if="historyItem.isCollapse">
          <div
            class="strayDetailBlock"
            v-for="(dataBet, dataBetIndex) in historyItem.dataBet"
            :key="dataBetIndex"
          >
            <div class="strayDetailTitle">
              <span class="betPosName">{{ dataBet.WagerPosName }} </span>
              <span class="cutLine"> {{ dataBet.CutLine }}</span> @
              <span class="cutLine">{{ dataBet.PayoutOddsStr }}</span>
            </div>
            <div class="strayDetailLine"> </div>
            <div class="strayDetailContentBlock">
              <div class="strayDetailContentBlockRow">
                {{ `${historyItem.catName} - [${dataBet.WagerGrpName}]` }}
              </div>
              <div class="strayDetailContentBlockRow">
                {{ dataBet.LeagueName }}
              </div>

              <div class="strayDetailContentBlockRow">
                <template v-if="dataBet.AwayTeam === '.'">
                  <div class="">{{ dataBet.HomeTeam }}</div>
                </template>
                <template v-else-if="dataBet.HomeTeam === '.'">
                  <div class="">{{ dataBet.AwayTeam }}</div>
                </template>
                <template v-else>
                  <div class="">{{ dataBet.HomeTeam }} </div>
                  <div class="HomeTeamSign">({{ $t('Common.Home') }}) </div>
                  <div class="strayDetailContentBlockRowTeam"> v {{ dataBet.AwayTeam }}</div>
                </template>
              </div>
            </div>
          </div>
        </template>

        <div class="rightArrowBlock">
          <i :class="arrowIconJudge(historyItem.isCollapse)" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'ListCardItem',
    components: {},
    props: {
      historyItem: {
        type: Object,
        default: () => {},
      },
      isSettlement: {
        type: Boolean,
      },
    },
    methods: {
      showOddValue(oddValue) {
        if (this.includePrincipal) {
          return this.$lib.trunc(parseFloat(oddValue) + 1);
        } else {
          return oddValue;
        }
      },
      arrowIconJudge(isCollapse) {
        if (isCollapse) {
          return 'el-icon-arrow-up';
        } else {
          return 'el-icon-arrow-down';
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './ListCardItem.scss';
</style>

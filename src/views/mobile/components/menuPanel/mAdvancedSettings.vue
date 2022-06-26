<template>
  <div id="mAdvancedSettings">
    <ul class="list">
      <li class="item">
        <div class="title">{{ $t('Common.OddType') }}</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="includePrincipal"
                v-bind:value="true"
                v-model="model.mIncludePrincipal"
              />
              <span> {{ $t('GamesSetup.IncludePrincipal') }} </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="includePrincipal"
                v-bind:value="false"
                v-model="model.mIncludePrincipal"
              />
              <span> {{ $t('GamesSetup.NotIncludePrincipal') }} </span>
            </label>
          </div>
        </div>
      </li>

      <li class="item">
        <div class="title">{{ $t('Common.GameSort') }}</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" name="tableSort" v-bind:value="0" v-model="model.mTableSort" />
              <span> {{ $t('Common.Hot') }} </span>
            </label>
            <label class="radio-item">
              <input type="radio" name="tableSort" v-bind:value="1" v-model="model.mTableSort" />
              <span> {{ $t('Common.Time') }} </span>
            </label>
          </div>
        </div>
      </li>

      <li class="item">
        <div class="title">{{ $t('GamesSettingDialog.BetConfirmMessage') }}</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="showBetConfirm"
                v-bind:value="true"
                v-model="model.mShowBetConfirm"
              />
              <span> {{ $t('Common.Visible') }} </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="showBetConfirm"
                v-bind:value="false"
                v-model="model.mShowBetConfirm"
              />
              <span> {{ $t('Common.InVisible') }} </span>
            </label>
          </div>
        </div>
      </li>

      <li class="item">
        <div class="title">{{ $t('GamesSettingDialog.DefaultMount') }}</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="defaultAmountType"
                v-bind:value="0"
                v-model="model.mDefaultAmountType"
              />
              <span> {{ $t('Common.Close') }} </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="defaultAmountType"
                v-bind:value="1"
                v-model="model.mDefaultAmountType"
              />
              <span> {{ $t('Common.LastBet') }} </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="defaultAmountType"
                v-bind:value="2"
                v-model="model.mDefaultAmountType"
              />
              <span> {{ $t('Common.CustomMoney') }} </span>
            </label>
          </div>
          <input
            v-show="model.mDefaultAmountType == 2"
            class="amount-input"
            type="number"
            v-model="model.mDefaultAmountValue"
          />
        </div>
      </li>

      <li class="item">
        <div class="title">{{ $t('GamesSettingDialog.DefaultStrayBet') }}</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="defaultStrayAmountType"
                v-bind:value="0"
                v-model="model.mDefaultStrayAmountType"
              />
              <span> {{ $t('Common.Close') }} </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="defaultStrayAmountType"
                v-bind:value="1"
                v-model="model.mDefaultStrayAmountType"
              />
              <span> {{ $t('Common.LastBet') }} </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="defaultStrayAmountType"
                v-bind:value="2"
                v-model="model.mDefaultStrayAmountType"
              />
              <span> {{ $t('Common.CustomMoney') }} </span>
            </label>
          </div>
          <input
            v-show="model.mDefaultStrayAmountType == 2"
            class="amount-input"
            type="number"
            v-model="model.mDefaultStrayAmountValue"
          />
        </div>
      </li>

      <li class="item">
        <div class="title">{{ $t('GamesSetup.AcceptBetter') }}</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="acceptBetter"
                v-bind:value="true"
                v-model="model.mAcceptBetter"
              />
              <span> {{ $t('Common.Yes') }} </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="acceptBetter"
                v-bind:value="false"
                v-model="model.mAcceptBetter"
              />
              <span> {{ $t('Common.No') }} </span>
            </label>
          </div>
        </div>
      </li>

      <li class="item">
        <div class="title">
          {{ $t('Common.CustomBet') }}
          <span class="redTip">
            {{ $t('Common.MostSet') }} {{ maxChips }} {{ $t('Common.Indivual') }}
          </span>
        </div>
        <div class="content" style="padding: 1rem 0.8rem">
          <ul class="chips">
            <li
              v-for="(chip, index) in chipsData"
              class="chip"
              :class="activeChips.includes(chip.value) ? 'active' : ''"
              :key="index"
              @click="chipClickHandler(chip.value)"
            >
              + {{ chip.value }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'mAdvancedSettings',
    data() {
      return {
        chipsData: this.$SportLib.chipsData,
        maxChips: 4,

        // models
        model: {
          mAcceptBetter: null,
          mIncludePrincipal: null,
          mTableSort: null,
          mShowBetConfirm: false,
          mDefaultAmountType: 0,
          mDefaultAmountValue: 0,
          mDefaultStrayAmountType: 0,
          mDefaultStrayAmountValue: 0,
        },
        activeChips: [],
      };
    },
    computed: {
      settings() {
        return this.$store.state.Setting.UserSetting;
      },
    },
    methods: {
      // 讀取設定
      loadSettings() {
        this.model.mAcceptBetter = this.settings.acceptBetter;
        this.model.mIncludePrincipal = this.settings.includePrincipal;
        this.model.mTableSort = this.settings.tableSort;
        this.model.mShowBetConfirm = this.settings.showBetConfirm;
        this.model.mDefaultAmountType = this.settings.defaultAmount.type;
        this.model.mDefaultAmountValue = this.settings.defaultAmount.amount;
        this.model.mDefaultStrayAmountType = this.settings.defaultStrayAmount.type;
        this.model.mDefaultStrayAmountValue = this.settings.defaultStrayAmount.amount;
        this.activeChips = Array.from(new Set(this.settings.preferChips))
          .sort((a, b) => a - b)
          .slice(0, this.maxChips);
      },
      // 保存設定
      saveSettings() {
        const newSettings = {
          acceptBetter: this.model.mAcceptBetter,
          includePrincipal: this.model.mIncludePrincipal,
          tableSort: this.model.mTableSort,
          showBetConfirm: this.model.mShowBetConfirm,
          defaultAmount: {
            type: Number(this.model.mDefaultAmountType),
            amount: this.model.mDefaultAmountValue,
          },
          defaultStrayAmount: {
            type: Number(this.model.mDefaultStrayAmountType),
            amount: this.model.mDefaultStrayAmountValue,
          },
          preferChips: this.chipsData
            .map((it) => it.value)
            .filter((v) => this.activeChips.includes(v)),
        };

        console.log('saved', newSettings);
        this.$store.commit('Setting/setSettings', newSettings);
      },
      // 籌碼點擊
      chipClickHandler(value) {
        if (this.activeChips.includes(value)) {
          if (this.activeChips.length > 1) {
            this.activeChips = this.activeChips.filter((it) => it !== value);
          }
        } else {
          if (this.activeChips.length < this.maxChips) {
            this.activeChips.push(value);
          }
        }
      },
    },
    mounted() {
      this.loadSettings();
    },
    watch: {
      model: {
        handler() {
          // 值有變動, 直接保存
          this.saveSettings();
        },
        deep: true,
      },
      activeChips() {
        this.saveSettings();
      },
      'model.mTableSort': {
        handler() {
          this.$emit('updateGameDetail');
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  #mAdvancedSettings {
    ul.list {
      li.item {
        .title {
          height: 2.5rem;
          background: #bbb;
          line-height: normal;
          font-size: 1.2rem;
          font-weight: bold;
          padding: 0 15px;
          display: flex;
          align-items: center;
        }
        .content {
          padding: 0.8rem 2rem;
        }
      }
    }

    .radio-group {
      label.radio-item {
        $size: 1.2rem;
        display: block;
        position: relative;
        margin-bottom: 0.8rem;
        font-size: $size;
        cursor: pointer;
        &:last-child {
          margin-bottom: 0;
        }

        input:where([type='checkbox'], [type='radio']) {
          position: absolute;
          right: 0;
          appearance: none;
          width: $size;
          height: $size;
          &:checked {
            background-repeat: no-repeat;
            background-position: center center;
            background-image: url('~@/assets/img/mobile/icon_check_blue.svg');
            background-size: contain;
            & + span {
              color: #0169ff;
              //   font-weight: bold;
            }
          }

          &:focus {
            border: none !important; // override global
          }
        }
      }
    }

    ul.chips {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 0.5rem;

      li.chip {
        height: 30px;
        border: 1px solid transparent;
        border-radius: 3px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        line-height: normal;
        &:active,
        &.active {
          border: 1px solid #0169ff;
        }
      }
    }

    .amount-input {
      width: calc(100%);
      font-size: 1.2rem;
      line-height: normal;
      text-align: center;
      margin-top: 5px;
      padding: 3px;
      border-radius: 3px;
      border: 1px solid #3a8ee6;
    }

    .redTip {
      color: #ed0000;
      font-size: 80%;
      margin-left: 1rem;
    }
  }
</style>

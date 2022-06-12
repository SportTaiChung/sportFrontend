<template>
  <div id="mAdvancedSettings">
    <ul class="list">
      <li class="item">
        <div class="title">賠率類型</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="includePrincipal"
                v-bind:value="true"
                v-model="model.mIncludePrincipal"
              />
              <span> 含本金 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="includePrincipal"
                v-bind:value="false"
                v-model="model.mIncludePrincipal"
              />
              <span> 不含本金 </span>
            </label>
          </div>
        </div>
      </li>

      <li class="item">
        <div class="title">賽事排序</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" name="tableSort" v-bind:value="0" v-model="model.mTableSort" />
              <span> 熱門 </span>
            </label>
            <label class="radio-item">
              <input type="radio" name="tableSort" v-bind:value="1" v-model="model.mTableSort" />
              <span> 時間 </span>
            </label>
          </div>
        </div>
      </li>

      <li class="item">
        <div class="title">下注確認信息</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="showBetConfirm"
                v-bind:value="true"
                v-model="model.mShowBetConfirm"
              />
              <span> 顯示 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="showBetConfirm"
                v-bind:value="false"
                v-model="model.mShowBetConfirm"
              />
              <span> 隱藏 </span>
            </label>
          </div>
        </div>
      </li>

      <li class="item">
        <div class="title">默認金額</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="defaultAmountType"
                v-bind:value="0"
                v-model="model.mDefaultAmountType"
              />
              <span> 關閉 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="defaultAmountType"
                v-bind:value="1"
                v-model="model.mDefaultAmountType"
              />
              <span> 最後投注 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="defaultAmountType"
                v-bind:value="2"
                v-model="model.mDefaultAmountType"
              />
              <span> 自訂金額 </span>
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
        <div class="title">默認過關投注</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="defaultStrayAmountType"
                v-bind:value="0"
                v-model="model.mDefaultStrayAmountType"
              />
              <span> 關閉 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="defaultStrayAmountType"
                v-bind:value="1"
                v-model="model.mDefaultStrayAmountType"
              />
              <span> 最後投注 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="defaultStrayAmountType"
                v-bind:value="2"
                v-model="model.mDefaultStrayAmountType"
              />
              <span> 自訂金額 </span>
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
        <div class="title">自動接收最佳賠率</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                name="acceptBetter"
                v-bind:value="true"
                v-model="model.mAcceptBetter"
              />
              <span> 是 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="acceptBetter"
                v-bind:value="false"
                v-model="model.mAcceptBetter"
              />
              <span> 否 </span>
            </label>
          </div>
        </div>
      </li>

      <li class="item">
        <div class="title">
          自訂籌碼
          <br />
          <span class="redTip"> 最多設置6個 </span>
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
        this.activeChips = Array.from(new Set(this.settings.preferChips));
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
          if (this.activeChips.length < 6) {
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
  }
</style>

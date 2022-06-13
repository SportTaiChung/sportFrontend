<template>
  <div id="GamesSetupNew" @click.stop="onMaskClick">
    <div class="popup">
      <div class="header">
        <div class="title"> 功能設定 </div>
        <div class="btn-close" @click.stop="onMaskClick"></div>
        <div class="btn-help"> ? </div>
      </div>

      <div class="body">
        <ul class="list">
          <!-- <li class="item">
            <div class="title">賠率類型</div>
            <div class="content">
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    type="radio"
                    name="includePrincipal"
                    v-bind:value="true"
                    v-model="mIncludePrincipal"
                  />
                  <span> 含本金 </span>
                </label>
                <label class="radio-item">
                  <input
                    type="radio"
                    name="includePrincipal"
                    v-bind:value="false"
                    v-model="mIncludePrincipal"
                  />
                  <span> 不含本金 </span>
                </label>
              </div>
            </div>
          </li> -->

          <!-- <li class="item">
            <div class="title">賽事排序</div>
            <div class="content">
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" name="tableSort" v-bind:value="0" v-model="mTableSort" />
                  <span> 熱門 </span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="tableSort" v-bind:value="1" v-model="mTableSort" />
                  <span> 時間 </span>
                </label>
              </div>
            </div>
          </li> -->

          <li class="item">
            <div class="title">下注確認信息</div>
            <div class="content">
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    type="radio"
                    name="showBetConfirm"
                    v-bind:value="true"
                    v-model="mShowBetConfirm"
                  />
                  <span> 顯示 </span>
                </label>
                <label class="radio-item">
                  <input
                    type="radio"
                    name="showBetConfirm"
                    v-bind:value="false"
                    v-model="mShowBetConfirm"
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
                    v-model="mDefaultAmountType"
                  />
                  <span> 關閉 </span>
                </label>
                <label class="radio-item">
                  <input
                    type="radio"
                    name="defaultAmountType"
                    v-bind:value="1"
                    v-model="mDefaultAmountType"
                  />
                  <span> 最後投注 </span>
                </label>
                <label class="radio-item">
                  <input
                    type="radio"
                    name="defaultAmountType"
                    v-bind:value="2"
                    v-model="mDefaultAmountType"
                  />
                  <span> 自訂金額 </span>
                </label>
              </div>
              <input
                v-show="mDefaultAmountType == 2"
                class="amount-input"
                type="number"
                v-model="mDefaultAmountValue"
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
                    v-model="mDefaultStrayAmountType"
                  />
                  <span> 關閉 </span>
                </label>
                <label class="radio-item">
                  <input
                    type="radio"
                    name="defaultStrayAmountType"
                    v-bind:value="1"
                    v-model="mDefaultStrayAmountType"
                  />
                  <span> 最後投注 </span>
                </label>
                <label class="radio-item">
                  <input
                    type="radio"
                    name="defaultStrayAmountType"
                    v-bind:value="2"
                    v-model="mDefaultStrayAmountType"
                  />
                  <span> 自訂金額 </span>
                </label>
              </div>
              <input
                v-show="mDefaultStrayAmountType == 2"
                class="amount-input"
                type="number"
                v-model="mDefaultStrayAmountValue"
              />
            </div>
          </li>

          <!-- <li class="item">
            <div class="title">自動接收最佳賠率</div>
            <div class="content">
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" name="acceptBetter" v-bind:value="true" v-model="mAcceptBetter" />
                  <span> 是 </span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="acceptBetter" v-bind:value="false" v-model="mAcceptBetter" />
                  <span> 否 </span>
                </label>
              </div>
            </div>
          </li> -->

          <li class="item">
            <div class="title">
              自訂籌碼
              <br />
              <span class="redTip"> 最多設置6個 </span>
            </div>
            <div class="content">
              <ul class="chips">
                <li
                  v-for="(chip, index) in chipsData"
                  class="chip"
                  :class="activeChips.includes(chip.value) ? 'active' : ''"
                  :key="index"
                  @click="chipClickHandler(chip.value)"
                >
                  <img :src="require('@/assets/img/pc/chips/' + chip.img)" />
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <div class="btn-save" @click="saveSettings">確認修改</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GamesSetupNew',
    data() {
      return {
        chipsData: this.$SportLib.chipsData,

        // models
        mAcceptBetter: null,
        mIncludePrincipal: null,
        mTableSort: null,
        mShowBetConfirm: false,
        mDefaultAmountType: 0,
        mDefaultAmountValue: 0,
        mDefaultStrayAmountType: 0,
        mDefaultStrayAmountValue: 0,

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
        this.mAcceptBetter = this.settings.acceptBetter;
        this.mIncludePrincipal = this.settings.includePrincipal;
        this.mTableSort = this.settings.tableSort;
        this.mShowBetConfirm = this.settings.showBetConfirm;
        this.mDefaultAmountType = this.settings.defaultAmount.type;
        this.mDefaultAmountValue = this.settings.defaultAmount.amount;
        this.mDefaultStrayAmountType = this.settings.defaultStrayAmount.type;
        this.mDefaultStrayAmountValue = this.settings.defaultStrayAmount.amount;
        this.activeChips = Array.from(new Set(this.settings.preferChips));
      },
      // 保存設定
      saveSettings() {
        this.$store.commit('SetLoading', true);

        const newSettings = {
          acceptBetter: this.mAcceptBetter,
          includePrincipal: this.mIncludePrincipal,
          tableSort: this.mTableSort,
          showBetConfirm: this.mShowBetConfirm,
          defaultAmount: {
            type: Number(this.mDefaultAmountType),
            amount: this.mDefaultAmountValue,
          },
          defaultStrayAmount: {
            type: Number(this.mDefaultStrayAmountType),
            amount: this.mDefaultStrayAmountValue,
          },
          preferChips: this.chipsData
            .map((it) => it.value)
            .filter((v) => this.activeChips.includes(v)),
        };
        this.$store.commit('Setting/setSettings', newSettings);

        setTimeout(() => {
          this.$notify.success({
            message: '修改成功',
          });
          this.$store.commit('SetLoading', false);
          this.$emit('closeMe');
        }, 100);
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
      // 離開
      onMaskClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('closeMe');
        this.loadSettings();
      },
    },
    mounted() {
      this.loadSettings();
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #GamesSetupNew {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);

    .popup {
      width: calc(100vw - 50px);
      max-width: 390px;
      max-height: 80%;
      background-color: #eee;
      overflow: hidden;

      .header {
        @include base-background();
        position: relative;
        .title {
          color: #fff;
          font-size: 1.2rem;
          text-align: center;
          height: 40px;
          line-height: 40px;
        }
        .btn-close {
          position: absolute;
          top: 0;
          right: 0;
          height: 40px;
          width: 40px;
          background: url('~@/assets/img/pc/btn_close_w.svg') no-repeat center;
          background-size: 13px;
          opacity: 0.5;
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        }
        .btn-help {
          cursor: pointer;
          font-family: Arial;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto 8px;
          border-radius: 50%;
          color: #fff;
          background-color: #136146;
          height: 25px;
          width: 25px;
          line-height: 26px;
          text-align: center;
          font-size: 17px;
          font-weight: bold;
        }
      }
      .line {
        height: 1px;
        background: #ccc;
        margin: 0 1.5rem;
      }
      .body {
        display: flex;
        flex-direction: column;
        max-height: 70vh;
        overflow: overlay;

        ul.list {
          li.item {
            display: flex;
            flex-flow: row nowrap;
            padding: 10px;
            border-bottom: 1px solid #ccc;
            .title {
              flex: 0 0 125px;
              line-height: normal;
              font-size: 1.1rem;
              display: flex;
              flex-flow: column;
              align-items: flex-start;
              padding-left: 15px;
              margin: auto;

              span.redTip {
                color: #f00;
              }
            }
            .content {
              padding: 0;
              flex: 1;
            }
          }
        }

        .radio-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, 75px);
          grid-gap: 5px;

          label.radio-item {
            $size: 1.1rem;
            span {
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              height: 35px;
              min-width: 75px;
              padding: 0 8px;
              font-size: $size;
              background-color: #fff;
              border-radius: 5px;
              &:hover {
                background-color: #dbe8f1;
              }
            }
            &:last-child {
              margin-bottom: 0;
            }

            input:where([type='checkbox'], [type='radio']) {
              appearance: none;
              display: none;
              &:checked {
                background-color: #fff;
                & + span {
                  background-color: #bbb;
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
          grid-template-columns: repeat(auto-fit, 75px);
          grid-gap: 5px;

          li.chip {
            text-align: center;
            cursor: pointer;
            opacity: 0.3;
            &:hover {
              opacity: 0.7;
            }
            &:active {
              transform: scale(1.1);
              opacity: 1;
            }
            &.active {
              opacity: 1;
            }
          }
        }

        input.amount-input {
          width: calc(100% - 10px);
          height: 35px;
          margin-top: 5px;
          border-radius: 3px;
          border: 1px solid transparent;
          text-align: center;
        }

        .btn-save {
          background-color: #ffdf1b;
          border-radius: 5px;
          text-align: center;
          font-size: 16px;
          line-height: normal;
          height: 35px;
          width: 160px;
          line-height: 35px;
          margin: 10px auto;
          cursor: pointer;

          &:hover {
            background-color: rgba(255, 225, 27, 0.7);
          }
          &:active {
            background-color: #e1c300;
          }
        }
      }
    }
  }
</style>

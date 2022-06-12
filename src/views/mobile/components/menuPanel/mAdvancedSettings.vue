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
                :checked="includePrincipal"
                @change="includePrincipalChangeHandler(true)"
              />
              <span> 含本金 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="includePrincipal"
                :checked="!includePrincipal"
                @change="includePrincipalChangeHandler(false)"
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
              <input
                type="radio"
                name="tableSort"
                :checked="tableSort == 0"
                @change="tableSortChangeHandler(0)"
              />
              <span> 熱門 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="tableSort"
                :checked="tableSort == 1"
                @change="tableSortChangeHandler(1)"
              />
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
              <input type="radio" name="c" />
              <span> 顯示 </span>
            </label>
            <label class="radio-item">
              <input type="radio" name="c" />
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
              <input type="radio" name="d" />
              <span> 關閉 </span>
            </label>
            <label class="radio-item">
              <input type="radio" name="d" />
              <span> 最後投注金額 </span>
            </label>
            <label class="radio-item">
              <input type="radio" name="d" />
              <span> 自訂金額 </span>
            </label>
          </div>
        </div>
      </li>
      <li class="item">
        <div class="title">默認過關投注</div>
        <div class="content">
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" name="e" />
              <span> 關閉 </span>
            </label>
            <label class="radio-item">
              <input type="radio" name="e" />
              <span> 最後投注金額 </span>
            </label>
            <label class="radio-item">
              <input type="radio" name="e" />
              <span> 自訂金額 </span>
            </label>
          </div>
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
                :checked="acceptBetter"
                @change="acceptBetterChangeHandler(true)"
              />
              <span> 是 </span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                name="acceptBetter"
                :checked="!acceptBetter"
                @change="acceptBetterChangeHandler(false)"
              />
              <span> 否 </span>
            </label>
          </div>
        </div>
      </li>
      <li class="item">
        <div class="title">自訂籌碼</div>
        <div class="content" style="padding: 1rem 0.8rem">
          <ul class="chips">
            <li class="chip">+1</li>
            <li class="chip">+5</li>
            <li class="chip">+10</li>
            <li class="chip">+100</li>
            <li class="chip">+500</li>
            <li class="chip">+1000</li>
            <li class="chip">+2000</li>
            <li class="chip">+5000</li>
            <li class="chip">+10000</li>
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
        acceptBetter: null,
        includePrincipal: null,
        tableSort: null,
      };
    },
    computed: {
      settings() {
        return this.$store.state.Setting.UserSetting;
      },
      isIncludePrincipal() {
        return this.settings.includePrincipal;
      },
      tableSortMode() {
        return this.settings.tableSort;
      },
      isAcceptBetter() {
        return this.settings.acceptBetter;
      },
    },
    watch: {
      isIncludePrincipal: {
        handler(newVal, old) {
          this.includePrincipal = newVal;
        },
        immediate: true,
      },
      tableSortMode: {
        handler(newVal, old) {
          this.tableSort = newVal;
        },
        immediate: true,
      },
      isAcceptBetter: {
        handler(newVal, old) {
          this.acceptBetter = newVal;
        },
        immediate: true,
      },
    },
    methods: {
      acceptBetterChangeHandler(val) {
        this.$store.commit('Setting/setAcceptBetter', val);
      },
      includePrincipalChangeHandler(val) {
        this.$store.commit('Setting/setIncludePrincipal', val);
      },
      tableSortChangeHandler(val) {
        this.$store.commit('Setting/setTableSort', val);
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

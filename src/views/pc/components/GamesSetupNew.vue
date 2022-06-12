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
          </li> -->
          <!-- <li class="item">
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
          </li> -->
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
                  <span> 最後投注 </span>
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
                  <span> 最後投注 </span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="e" />
                  <span> 自訂金額 </span>
                </label>
              </div>
            </div>
          </li>
          <!-- <li class="item">
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
          </li> -->
          <li class="item">
            <div class="title">自訂籌碼</div>
            <div class="content">
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
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GamesSetupNew',
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
      onMaskClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('closeMe');
      },
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
        gap: 1rem;
        max-height: 70vh;
        // padding: 10px;
        overflow: auto;

        ul.list {
          li.item {
            display: flex;
            flex-flow: row nowrap;
            padding: 10px;
            border-bottom: 1px solid #ccc;
            .title {
              flex: 0 0 125px;
              height: 2.5rem;
              line-height: normal;
              font-size: 1.1rem;
              display: flex;
              align-items: center;
              padding-left: 15px;
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
            cursor: pointer;
            &:active,
            &.active {
              border: 1px solid #0169ff;
            }
          }
        }
      }
    }
  }
</style>

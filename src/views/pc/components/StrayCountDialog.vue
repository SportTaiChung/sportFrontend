<template>
  <div id="StrayCountDialog" @click.stop="onMaskClick">
    <div class="popup">
      <div class="header">
        <div class="title"> {{ $t('GamesBetInfo.StrayCount') }} </div>
        <div class="btn-close" @click.stop="onMaskClick"></div>
        <el-popover popper-class="calculator-help-popper" placement="bottom-start" trigger="hover">
          <div class="help-title">{{ $t('Common.OperateInfo') }}</div>
          <div class="help-detail">
            <table>
              <tbody>
                <tr>
                  <td> {{ $t('Common.Note') }} : </td>
                  <td> {{ $t('StrayCountDialog.MiddleInput') }} </td>
                </tr>
                <tr>
                  <td> {{ $t('Common.Ex') }} : </td>
                  <td>
                    <p> {{ $t('StrayCountDialog.Ex1') }} </p>
                    <p> {{ $t('StrayCountDialog.Ex2') }} </p>
                    <p> {{ $t('StrayCountDialog.Ex3') }} </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="btn-help" slot="reference"> ? </div>
        </el-popover>
      </div>

      <div class="body">
        <StrayCount></StrayCount>
      </div>
    </div>
  </div>
</template>

<script>
  import StrayCount from '@/components/StrayCount';
  export default {
    name: 'StrayCountDialog',
    components: {
      StrayCount,
    },
    data() {
      return {};
    },
    computed: {},
    methods: {
      // 離開
      onMaskClick(e) {
        if (e.target !== e.currentTarget) return;
        this.$emit('closeMe');
      },
    },
    mounted() {},
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #StrayCountDialog {
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
      display: flex;
      flex-direction: column;
      width: calc(100vw - 50px);
      max-width: 390px;
      max-height: 80%;
      background-color: #eee;
      overflow: hidden;

      .header {
        flex-shrink: 0;
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
      .body {
        display: flex;
        flex-direction: column;
        overflow: auto;
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

<style lang="scss">
  .calculator-help-popper {
    padding: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    .help-title {
      color: #000;
      font-size: 14px;
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding: 6px;
    }
    .help-detail {
      font-size: 13px;
      padding: 10px;
      table {
        td:nth-child(1) {
          min-width: 2rem;
          vertical-align: top;
        }
        tr:nth-child(1) {
          color: blue;
        }

        p {
          margin: 0;
          margin-bottom: 0;
        }
      }
    }
  }
</style>

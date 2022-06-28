<template>
  <div
    class="betResultBlock"
    v-if="panelMode === PanelModeEnum.result && cartData.betResult !== null"
  >
    <div class="success" v-if="cartData.betResult.code === 200">
      <img class="betResultImgIcon" src="@/assets/img/common/betView/ok.png" alt="" />
      {{ cartData.betResult.Message }}
    </div>
    <div class="info" v-else-if="cartData.betResult.code === 201 && cartData.betResultCount > 2">
      <img class="betResultImgIcon" src="@/assets/img/common/betView/info.png" alt="" />
      {{ cartData.betResult.Message }}
    </div>
    <div class="error" v-else>
      <img class="betResultImgIcon" src="@/assets/img/common/betView/error.png" alt="" />
      {{ cartData.betResult.Message }}
    </div>
  </div>
</template>

<script>
  import { PanelModeEnum } from '@/enum/BetPanelMode';
  export default {
    name: 'BetResultBlock',
    props: {
      panelMode: {
        type: Number,
      },
      cartData: {
        type: Object,
      },
    },
    data() {
      return {
        PanelModeEnum,
      };
    },
    created() {},
  };
</script>

<style lang="scss" scoped>
  .betResultBlock {
    display: flex;
    align-items: center;
    margin-top: 8px;
    .betResultImgIcon {
      display: block;
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    .success,
    .info,
    .error {
      display: flex;
      align-items: center;
    }
    .success {
      color: green;
    }
    .info {
      color: blue;
    }
    .error {
      color: red;
    }
  }
</style>

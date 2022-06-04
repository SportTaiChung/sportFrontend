<template>
  <div id="mBetKeyboard">
    <!-- 快選 -->
    <ul class="quick-add">
      <li class="btn-quick-add">+10</li>
      <li class="btn-quick-add">+100</li>
      <li class="btn-quick-add">+500</li>
      <li class="btn-quick-add">+1000</li>

      <!-- <li class="max-num-tip">999999</li> -->
    </ul>

    <!-- 數字鍵盤 -->
    <div class="num-input-pad">
      <div class="input-item">1</div>
      <div class="input-item">2</div>
      <div class="input-item">3</div>
      <div class="input-item">4</div>
      <div class="input-item">5</div>
      <div class="input-item">🠔</div>
      <div class="input-item">6</div>
      <div class="input-item">7</div>
      <div class="input-item">8</div>
      <div class="input-item">9</div>
      <div class="input-item">0</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mBetKeyboard',
  };
</script>

<style lang="scss" scoped>
  #mBetKeyboard {
    ul.quick-add {
      width: 100%;
      display: table;
      table-layout: fixed;
      overflow: hidden;
      border: 1px solid #bbb;
      border-radius: 5px;
      li.btn-quick-add {
        display: table-cell;
        height: 44px;
        text-align: center;
        vertical-align: middle;
        color: #666;
        font-size: 1.5rem;
        font-weight: bold;
        line-height: 1;
        border-right: 1px solid #ccc;
        background-color: #fff;
        &:last-child {
          border: none;
        }
        &:active {
          background-color: #ddd;
        }
      }
    }

    .num-input-pad {
      width: 100%;
      height: 88px;
      display: flex;
      flex-wrap: wrap;
      margin-top: 6px;
      border: 1px solid #2682d5;
      border-radius: 5px;
      overflow: hidden;

      .input-item {
        flex: 0 0 16.666%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border: 1px solid #2682d5;
        border-width: 0 1px 1px 0;
        color: #2682d5;
        font-size: 2.36rem;
        line-height: 1;
        &:nth-child(6) {
          border-right: 0;
        }
        &:nth-child(11) {
          border-right: 0;
        }
        &:nth-child(-n + 11):nth-child(n + 7) {
          border-bottom: 0;
        }
        &:last-child {
          flex-grow: 1;
        }
        &:active {
          background-color: #ddd;
        }
      }
    }
  }
</style>

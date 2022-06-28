<template>
  <div id="TestI18n">
    <label v-for="(item, index) in optionsLang" v-bind:key="index">
      <input
        type="radio"
        v-model="$store.state.lang"
        :value="item.value"
        v-on:change="setLang(item.value)"
      />
      {{ item.text }}
    </label>
    <div>
      <!-- 使用 $t(key) 即可依所選用的語系顯示對應的語言 -->
      <h1>{{ $t('test') }}</h1>
      <el-popconfirm title="这是一段内容确定删除吗？">
        <el-button slot="reference">删除</el-button>
      </el-popconfirm>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TestI18n',
    data() {
      return {
        optionsLang: [
          { text: '中文', value: 'tw' },
          { text: '簡體中文', value: 'cn' },
        ],
      };
    },
    methods: {
      setLang(val) {
        console.log('val:', val);
        this.$store.commit('SetLang', val);
      },
    },
  };
</script>

<style lang="scss" scoped>
  #TestI18n {
    padding: 50px;
  }
</style>

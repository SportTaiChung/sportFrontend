<template>
  <div id="TestOddData">
    <div v-html="htmlJudge()">
      <!-- <Odd :OddValue="odd" /> -->
    </div>

    <Odd :OddValue="odd" />

    <input type="button" value="min" @click="min()" />
    <input type="button" value="add" @click="add()" />
    <input type="button" value="same" @click="same()" />
  </div>
</template>

<script>
  import Odd from '@/components/Odd';
  export default {
    name: 'TestOddData',
    components: {
      Odd,
    },
    data() {
      return {
        odd: 1,
      };
    },
    methods: {
      htmlJudge() {
        return `
          <div>測試</div>
          <Odd>
        `;
      },
      add() {
        this.odd += 0.1;
      },
      min() {
        this.odd -= 0.1;
      },
      same() {
        this.odd = this.odd;
      },
    },
  };
</script>

<style lang="scss" scoped>
  #TestOddData {
    padding: 50px;
    input {
      margin-right: 10px;
    }
  }
</style>

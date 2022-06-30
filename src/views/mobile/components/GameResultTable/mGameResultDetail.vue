<template>
  <div class="mGameResultDetail" :class="isExpanded ? '' : 'closed'">
    <table>
      <thead @click="$emit('toggleCollapse')">
        <tr>
          <th v-for="(title, i) in titles" :key="i"> {{ title.Value }}</th>
        </tr>
      </thead>
      <tbody v-show="isExpanded">
        <template v-for="(teamData, teamIndex) in source.List">
          <tr :key="teamIndex">
            <!-- 分數 -->
            <td v-for="(title, index) in titles" :key="index">
              <ul class="score-group" v-if="title.Key !== 'Remarks'">
                <li>{{ parseScore(teamData, title.Key)[0] }}</li>
                <li>{{ parseScore(teamData, title.Key)[1] }}</li>
              </ul>
              <div class="remarks" v-else>{{ teamData.Remarks || '-' }}</div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'mGameResultDetail',
    components: {},
    props: {
      source: {
        type: Object,
        default() {
          return {};
        },
      },
      titles: {
        type: Array,
        default() {
          return [];
        },
      },
      isExpanded: {
        type: Boolean,
        default() {
          return false;
        },
      },
      hasMoreGame: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    computed: {
      betCartList() {
        return this.$store.state.BetCart.betCartList;
      },
      hasMoreGameStyle() {
        return this.hasMoreGame ? 'hasMoreGame' : '';
      },
    },
    mounted() {},
    watch: {},
    methods: {
      parseScore(teamData, key) {
        const str = teamData?.[key];
        if (str && str.indexOf(':') !== -1) {
          return str.split(':');
        }
        return ['-', '-'];
      },
      parseDate(str) {
        const d = new Date(str);
        if (d instanceof Date && !isNaN(d)) {
          const date =
            (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
            '-' +
            (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());

          const time =
            (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
            ':' +
            (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
          return [date, time];
        }
        return ['-', '-'];
      },
    },
  };
</script>

<style lang="scss" scoped>
  $row-height: 2.8rem;
  $font-size: 1rem;

  .mGameResultDetail {
    position: relative;
    // overflow: hidden;
    width: fit-content;
    min-width: 100%;
    transition: height 300ms ease-out;

    &.closed {
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: #ccc;
      }
    }

    table {
      position: relative;
      width: 100%;
      border-spacing: 0;
      font-size: $font-size;
      background-color: #fff;

      tr {
        position: relative;
      }

      th {
        min-width: 6.666rem;
        height: 2.4rem;
        background-color: #e8e8e8;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: normal;
        color: #444;
        cursor: pointer;
      }

      tbody {
        tr {
          border-bottom: 1px solid #e8e8e8;
          border-right: 1px solid;
        }
      }

      td {
        min-width: 6.666rem;
        height: $row-height * 2;

        ul.score-group {
          li {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            height: $row-height;
            border-style: solid;
            border-color: #e8e8e8;
            border-width: 0 1px 1px 0;
          }
        }

        .remarks {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid #e8e8e8;
        }
      }
    }
  }
</style>

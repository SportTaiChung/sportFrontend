<template>
  <div id="Ann">
    <div class="main-title">
      <h3>{{ $t('Ann.Title') }}</h3>
    </div>
    <table class="AnnTable">
      <tr class="tableHeader">
        <th class="time">{{ $t('Ann.Time') }}</th>
        <th class="type">{{ $t('Ann.Type') }}</th>
        <th class="content">{{ $t('Ann.Message') }}</th>
      </tr>
      <tr class="AnnTBodyTr" v-for="(it, index) in AnnData" :key="index">
        <td class="centerText">
          {{ $lib.timeFormatWithOutMMss(it.CreateTimeStr) }}
        </td>
        <td class="centerText"> {{ $t('Ann.System') }} </td>
        <td class="TBody">
          {{ it.content }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'Ann',
    data() {
      return {
        AnnData: [],
      };
    },
    created() {
      this.getAnnouncement();
    },
    methods: {
      getAnnouncement() {
        this.$store.dispatch('Game/GetAnnouncement').then((res) => {
          if (res.data) {
            this.AnnData = res.data;
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';
  #Ann {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    min-width: 980px;
    background-color: #e5e5e5;

    .main-title {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      height: 70px;
      @include base-background();
      h3 {
        margin: 0;
        color: #fff;
        font-size: 21px;
        line-height: normal;
        margin-left: 2rem;
      }
    }
    .AnnTable {
      width: 100%;
      border-collapse: collapse;
      .tableHeader {
        height: 45px;
        font-size: 16px;
        background-color: #d8d8d8;
        .time {
          width: 100px;
        }
        .type {
          width: 150px;
        }
      }
      .AnnTBodyTr {
        font-size: 14px;
        background-color: white;
        border-bottom: 1px solid #b8b8b8;
        .centerText {
          text-align: center;
        }
        td {
          height: 60px;
          border-right: 1px solid #b8b8b8;
        }
        .TBody {
          padding: 0 10px;
        }
      }
    }
  }
</style>

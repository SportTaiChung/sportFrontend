<template>
  <div id="mLeaguesPanel" :class="isOpen ? 'open' : ''">
    <div class="overlay" @click="close()"></div>

    <div class="panel">
      <div class="header-container">
        <h5 class="title"> {{ $t('GamesSetup.LeagueSelect') }} </h5>
      </div>

      <div class="main-container">
        <div class="opts-wrapper">
          <label>
            <input type="checkbox" v-model="options.selectAll" />
            {{ $t('GamesSetup.SelectAll') }}
          </label>
          <label>
            <input type="checkbox" v-model="options.onlyShowCheck" />
            {{ $t('GamesSetup.SelectCheck') }}
          </label>
        </div>
        <ul class="leagueList">
          <li
            class="leagueItem"
            v-for="leagueData in leagueListDataFiltered"
            :key="leagueData.LeagueID"
          >
            <label>
              <input type="checkbox" v-model="leagueData.isSelect" @change="onLeagueChanged" />
              {{ leagueData.LeagueName }}
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'mLeaguesPanel',
    components: {},
    props: {
      isOpen: {
        type: Boolean,
      },
    },
    data() {
      return {
        LeagueListData: [],
        options: {
          selectAll: true,
          onlyShowCheck: false,
        },
      };
    },
    watch: {
      selectedLeagues() {
        // this.saveLeaguesSetting();
      },
      isOpen(newVal) {
        if (newVal) {
          this.getGameResultLeagues();
        }
      },
      'options.selectAll': {
        handler(isChecked) {
          this.LeagueListData.forEach((it) => (it.isSelect = isChecked));
          this.saveLeaguesSetting();
        },
        immediate: true,
      },
      hasLeagueFiltered(val) {
        this.$emit('hasLeagueFiltered', val);
      },
    },
    computed: {
      selectedLeagues() {
        return this.LeagueListData.filter((it) => it.isSelect);
      },
      leagueListDataFiltered() {
        if (this.options.onlyShowCheck) {
          return this.selectedLeagues;
        } else {
          return this.LeagueListData;
        }
      },
      hasLeagueFiltered() {
        return (
          this.selectedLeagues.length > 0 &&
          this.selectedLeagues.length < this.LeagueListData.length
        );
      },
    },
    methods: {
      close() {
        this.$emit('closeMe');
        this.isSecondaryPanelOpened = false;
      },
      getGameResultLeagues() {
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('Game/GetGameResultLeagues')
          .then((res) => {
            this.LeagueListData = res.data.map((it) => {
              const findIndex = this.$store.state.Game.selectLeagueIDs.findIndex(
                (id) => id === it.LeagueID
              );
              let isSelect = false;
              if (findIndex > -1) {
                isSelect = true;
              }
              return { ...it, isSelect };
            });
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
      saveLeaguesSetting() {
        console.log('saveLeaguesSetting');
        this.$store.commit(
          'Game/setSelectLeagueIDs',
          this.selectedLeagues.map((it) => it.LeagueID)
        );
        this.$emit('onLeaguesListChanged');
      },
      clearLeagueList() {
        this.options = {
          selectAll: false,
          onlyShowCheck: false,
        };
        this.LeagueListData = [];
      },
      onLeagueChanged() {
        this.saveLeaguesSetting();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';

  #mLeaguesPanel {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    pointer-events: none;
    overflow: hidden;

    &.open {
      pointer-events: auto;
      .overlay {
        opacity: 1;
      }
      .panel {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      opacity: 0;
      transition: 350ms ease;
    }

    .panel {
      position: relative;
      width: 70%;
      height: 100%;
      max-width: 300px;
      min-width: 180px;
      float: right;
      display: flex;
      flex-direction: column;
      background-color: #e4e4e4;
      overflow: hidden;
      transform: translateX(100%);
      opacity: 0;
      transition: 350ms ease;

      .header-container {
        height: 3.5rem;
        width: 100%;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        border-bottom: 3px solid #ccc;
        background-color: #e4e4e4;

        .title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          line-height: normal;
          white-space: nowrap;
          margin: 0;
        }
      }

      .main-container {
        flex: auto;
        overflow: auto;
        padding: 0.714rem 1rem;
        font-size: 1.2rem;

        .opts-wrapper {
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          gap: 1.3rem;
          padding: 5px 1rem 10px 1rem;
          border-bottom: 2px solid #ccc;

          label {
            font-size: 1.3rem;
          }
        }

        ul.leagueList {
          display: flex;
          flex-flow: column;

          li {
            border-bottom: 1px solid #ccc;
            padding: 0.8rem 1rem;
            font-size: 1.3rem;
          }
        }

        label {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          line-height: normal;
          input[type='checkbox'] {
            flex-shrink: 0;
            width: 1.5rem;
            height: 1.5rem;
            margin: 0 8px 0 0;
          }
        }
      }
    }
  }
</style>

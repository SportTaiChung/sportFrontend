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
            <input
              type="checkbox"
              :checked="!hasLeagueFiltered"
              @click="
                (e) => {
                  LeagueListData = LeagueListData.map((it) => {
                    return { ...it, isSelect: hasLeagueFiltered };
                  });
                }
              "
            />
            {{ $t('GamesSetup.SelectAll') }}
          </label>
          <label>
            <input type="checkbox" v-model="options.showSelectedOnly" />
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
              <input type="checkbox" v-model="leagueData.isSelect" />
              {{ leagueData.LeagueName }}
            </label>
          </li>
        </ul>
      </div>

      <div class="footer-container">
        <div class="btn-cancel" @click="close()"> {{ $t('GamesSetup.Cancel') }} </div>
        <div class="btn-submit" @click="saveLeaguesSetting()"> {{ $t('GamesSetup.Submit') }} </div>
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
          showSelectedOnly: false,
        },
      };
    },
    watch: {
      isOpen(newVal) {
        if (newVal) {
          this.getGameResultLeagues();
        }
      },
      hasLeagueFiltered() {},
    },
    computed: {
      selectedLeagues() {
        return this.LeagueListData.filter((it) => it.isSelect);
      },
      leagueListDataFiltered() {
        if (this.options.showSelectedOnly) {
          return this.selectedLeagues;
        } else {
          return this.LeagueListData;
        }
      },
      hasLeagueFiltered() {
        return this.selectedLeagues.length !== this.LeagueListData.length;
      },
      gameStore() {
        return this.$store.state.Game;
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
            const localIDs = this.gameStore.selectLeagueIDs;
            if (localIDs.length) {
              this.LeagueListData = res.data.map((it) => ({
                ...it,
                isSelect: localIDs.includes(it.LeagueID),
              }));
            } else {
              this.LeagueListData = res.data.map((it) => ({ ...it, isSelect: true }));
            }
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
      saveLeaguesSetting() {
        if (this.selectedLeagues.length === 0) {
          return;
        }
        this.$store.commit(
          'Game/setSelectLeagueIDs',
          this.selectedLeagues.map((it) => it.LeagueID)
        );
        this.$emit('onLeaguesListChanged');
        this.$emit('hasLeagueFiltered', this.hasLeagueFiltered);
        this.close();
      },
      clearLeagueList() {
        this.options = {
          showSelectedOnly: false,
        };
        this.LeagueListData = [];
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
        display: flex;
        flex-flow: column nowrap;

        .opts-wrapper {
          flex-shrink: 0;
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
          flex-grow: 1;
          display: flex;
          flex-flow: column;
          overflow-y: auto;

          li {
            border-bottom: 1px solid #ccc;
            padding: 0.75rem 1rem;
            font-size: 1.2rem;
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

      .footer-container {
        display: flex;
        flex-shrink: 0;
        padding: 0.5rem;
        .btn-cancel,
        .btn-submit {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.2rem;
          text-align: center;
          min-height: 2.75rem;
          margin-right: 15px;
          padding: 0.5rem 1rem;
          border-radius: 3px;
          background-color: #929292;
          &:active {
            filter: brightness(0.8);
          }
          &:last-child {
            margin-right: 0;
          }
        }
        .btn-submit {
          background-color: #3a86de;
        }
      }
    }
  }
</style>

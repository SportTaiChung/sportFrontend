<template>
  <div id="mMenuPanel" :class="isOpen ? 'open' : ''">
    <div class="overlay" @click="close()"></div>

    <div class="panel">
      <div class="header-container">
        <img class="level" src="@/assets/img/mobile/icon_level1.svg" />
        <div class="player-id"
          >{{ userID }} <span class="more-id">{{ nickName }}</span>
        </div>
        <div class="btn-announcement" @click="$emit('callAnnouncement')"> </div>
      </div>

      <!-- 一級選單面板區 -->
      <div class="main-container">
        <ul class="feature-list">
          <li class="feature-item" @click="openLive()">
            <img class="icon" src="@/assets/img/mobile/icon_live.svg" />
            <div class="text"> {{ $t('Common.LivePlay') }} </div>
          </li>
          <li class="feature-item" @click="jumpLink('scoreLive')">
            <img class="icon" src="@/assets/img/mobile/icon_score.svg" />
            <div class="text"> {{ $t('GamesHeader.LiveScore') }} </div>
          </li>
          <li class="feature-item" @click="$emit('openStrayCount')">
            <img class="icon" src="@/assets/img/mobile/icon_count.svg" />
            <div class="text"> {{ $t('GamesBetInfo.StrayCount') }} </div>
          </li>
          <li class="feature-item" @click="OpenGameResultWindow()">
            <img class="icon" src="@/assets/img/mobile/icon_result.svg" />
            <div class="text"> {{ $t('GamesHeader.GameResult') }} </div>
          </li>
          <li class="feature-item" @click="jumpLink('rule')">
            <img class="icon" src="@/assets/img/mobile/icon_rule.svg" />
            <div class="text"> {{ $t('GamesHeader.GameRule') }} </div>
          </li>
          <li class="feature-item" @click="openSecondaryPanel('功能設定')">
            <img class="icon" src="@/assets/img/mobile/icon_funSet.svg" />
            <div class="text"> {{ $t('GamesBetInfo.Setting') }} </div>
          </li>
          <li class="feature-item" @click="openPersonal()">
            <!-- <img class="icon" src="@/assets/img/mobile/icon_funSet.svg" /> -->
            <div class="text"> {{ $t('GamesHeader.PersonalSetting') }} </div>
          </li>
        </ul>

        <!-- theme -->
        <!-- <div class="theme-bar">
          <img class="icon" src="@/assets/img/mobile/icon_exterior.svg" />
          <div class="text">色調</div>
        </div>
        <ul class="theme-list">
          <li :class="isThemeActive('dark')" @click="onThemeSelect('dark')">深色</li>
          <li :class="isThemeActive('light')" @click="onThemeSelect('light')">淺色</li>
        </ul> -->
      </div>

      <!-- 二級選單面板區 -->
      <div class="secondaryPanel" :class="isSecondaryPanelOpened ? 'open' : ''">
        <div class="secondaryPanel-header">
          <img
            src="@/assets/img/mobile/btn_arrow_w.svg"
            class="btn-back"
            @click="closeSecondaryPanel"
          />
          <div class="title">{{ secondaryPanelTitle }}</div>
        </div>
        <div class="secondaryPanel-body">
          <mAdvancedSettings
            v-if="isShowAdvancedSettings"
            @updateGameDetail="$emit('updateGameDetail')"
          ></mAdvancedSettings>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mAdvancedSettings from './mAdvancedSettings.vue';

  export default {
    name: 'mMenuPanel',
    components: {
      mAdvancedSettings,
    },
    props: {
      isOpen: {
        type: Boolean,
      },
    },
    data() {
      return {
        isSecondaryPanelOpened: false,
        isShowAdvancedSettings: true,
        secondaryPanelTitle: 'title',
      };
    },
    computed: {
      userStore() {
        return this.$store.state.User;
      },
      userName() {
        return this.userStore.UserData?.Name;
      },
      userID() {
        return this.userStore.MBID;
      },
      nickName() {
        return this.userStore.UserData?.RealName;
      },
    },
    methods: {
      close() {
        this.$emit('closeMe');
        this.isSecondaryPanelOpened = false;
      },
      onThemeSelect(themeName) {
        this.$store.commit('SetThemeInfo', themeName);
      },
      isThemeActive(themeName) {
        return this.$store.state.nowThemeInfo === themeName ? 'active' : '';
      },
      openSecondaryPanel(title) {
        this.isSecondaryPanelOpened = true;
        this.secondaryPanelTitle = title;
      },
      closeSecondaryPanel() {
        this.isSecondaryPanelOpened = false;
      },
      OpenGameResultWindow() {
        const historyRecord = this.$router.resolve({
          path: 'GameResult',
        });
        this.$lib.WindowOpen(historyRecord.href);
      },
      jumpLink(linkKey) {
        this.$lib.WindowOpen(this.$conf.JumpLink[linkKey]);
      },
      openLive() {
        const safariWindow = window.open();
        safariWindow.opener = null;
        this.$store.commit('SetLoading', true);
        this.$store
          .dispatch('Game/GetLiveURL')
          .then((res) => {
            safariWindow.location.href = res.data;
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
      openPersonal() {
        this.$emit('openPersonal');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';

  #mMenuPanel {
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
        justify-content: space-between;
        align-items: center;
        border-bottom: 3px solid #ccc;
        background-color: #e4e4e4;

        .level {
          width: 50px;
          height: 22px;
          flex-shrink: 0;
        }
        .player-id {
          color: #000;
          font-size: 1.25rem;
          text-align: left;
          flex-grow: 1;
          padding: 0 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          .more-id {
            padding-left: 5px;
            color: #0169ff;
          }
        }

        .btn-announcement {
          position: relative;
          flex-shrink: 0;
          width: 50px;
          height: 100%;
          background-image: url('~@/assets/img/mobile/btn_announcement.svg');
          background-size: 24px;
          background-position: center center;
          background-repeat: no-repeat;
          cursor: pointer;
          &:active {
            background-color: #fff;
          }

          &.point {
            &:after {
              content: '';
              background-color: #f00;
              border-radius: 50%;
              position: absolute;
              width: 7px;
              height: 7px;
              top: 0;
              bottom: 50%;
              left: 18px;
              right: 0;
              margin: auto;
            }
          }
        }
      }

      .main-container {
        flex: auto;
        overflow: auto;
        padding: 0.714rem 0;

        ul.feature-list {
          margin-bottom: 10px;
          li.feature-item {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            background-color: transparent;
            cursor: pointer;
            position: relative;
            width: 100%;
            height: 35px;

            img.icon {
              width: 21px;
              margin: 0 15px;
              align-self: center;
            }

            .text {
              position: absolute;
              margin-left: 50px;
              width: calc(100% - 50px);
              flex: 1;
              font-size: 1.2rem;
              line-height: 35px;
              text-align: left;
              color: #000;
              padding: 0 5px;
              border-bottom: 1px solid #ccc;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            &:active {
              background-color: #f1f2f3;
            }
          }
        }

        .theme-bar {
          display: flex;
          align-items: center;
          padding: 5px 0;
          font-size: 1.2rem;
          background: #ccc;
          min-height: 30px;

          .text {
            padding-left: 5px;
            line-height: normal;
          }

          img.icon {
            width: 21px;
            margin: 0 15px;
          }
        }

        ul.theme-list {
          padding-left: 52px;

          li {
            position: relative;
            font-size: 1.2rem;
            padding-left: 5px;
            // margin-bottom: 1rem;
            line-height: 30px;
            height: 30px;

            &:last-child {
              margin-bottom: 0px;
            }

            &:active {
              // background-color: #fff;
            }

            &.active {
              &:after {
                content: '';
                background-image: url('~@/assets/img/mobile/icon_check_blue.svg');
                background-position: center center;
                background-repeat: no-repeat;
                position: absolute;
                width: 20px;
                height: 100%;
                top: 0;
                right: 0;
                margin-right: 10px;
              }
            }
          }
        }
      }

      .secondaryPanel {
        display: flex;
        flex-flow: column nowrap;
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        background: #e4e4e4;
        transform: translateX(100%);
        transition: 350ms ease;

        &.open {
          opacity: 1;
          transform: translateX(0);
          box-shadow: 0 0 100px rgba(0, 0, 0, 0.8);
        }

        .secondaryPanel-header {
          flex-shrink: 0;
          height: 3.5rem;
          width: 100%;
          // background: #ccc;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          border: 1px solid #aaa;
          box-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
          z-index: 1;

          .title {
            font-size: 1.5rem;
            font-weight: bold;
            line-height: normal;
            white-space: nowrap;
          }

          .btn-back {
            width: 1.5rem;
            height: 1.5rem;
            margin: 0.6rem;
            transform: rotate(90deg);
            filter: contrast(0);
          }
        }

        .secondaryPanel-body {
          flex-grow: 1;
          background: #e4e4e4;
          overflow: auto;
        }
      }
    }
  }
</style>

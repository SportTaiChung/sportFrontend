<template>
  <div id="GamesSetup">
    <div class="setUp_L">
      <span class="timeBlockContainer">
        <div class="dayBlock">{{ TimeCountDown.day }}</div>
        <div class="timeBlock">{{ TimeCountDown.time }}</div>
      </span>
      <div>
        <!-- <img alt="" class="icon" src="@/assets/img/pc/sun1.svg" @click="changeTheme('light')" /> -->
        <!-- <img alt="" class="icon" src="@/assets/img/pc/yue.svg" @click="changeTheme('dark')" /> -->
      </div>
    </div>

    <div class="setUp_C">
      <!-- 公告跑馬燈 -->
      <div class="marquee-wrapper">
        <div class="icon"></div>
        <Marquee :text="marqueeText" />
      </div>

      <div class="options-wrapper">
        <span>
          {{ $t('GamesSetup.AcceptBetter') }}
          <el-checkbox v-model="isAcceptBetter" @change="checkboxChangeHandler"></el-checkbox
        ></span>
        <el-divider direction="vertical"></el-divider>
        <span class="selectLeague" @click="showLeagueSelectDialog">
          {{ $t('GamesSetup.LeagueSelect') }}
        </span>
        <el-divider direction="vertical"></el-divider>
        <el-dropdown @command="handleIsIncludePrincipal" trigger="click" class="dropDown">
          <span class="el-dropdown-link">
            {{ principalOption.find((it) => it.value === isIncludePrincipal).label }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, key) in principalOption"
              :key="key"
              :command="item.value"
              :class="item.value === isIncludePrincipal ? 'DefaultFocus' : ''"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-divider direction="vertical"></el-divider>
        <el-dropdown @command="handleSort" trigger="click" class="dropDown">
          <span class="el-dropdown-link">
            {{ sortList.find((it) => it.value === sortValue).label }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, key) in sortList"
              :key="key"
              :command="item.value"
              :class="item.value === sortValue ? 'DefaultFocus' : ''"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-divider direction="vertical" class="margin-0"></el-divider>
      </div>
    </div>

    <div class="setUp_R">
      <span class="setUp_color">{{ $t('GamesSetup.QuickBet') }}</span>
      <input
        v-model="quickBetAmount"
        v-show="quickBetEnable"
        :placeholder="$t('GamesSetup.PlzInputAmount')"
        class="setUp_input"
        @input="quickBetAmountChangeHandler"
      />
      <el-switch
        v-model="quickBetEnable"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="quickBetEnableChangeHandler"
      >
      </el-switch>
      <el-popover
        class="popover"
        popper-class="fastBet-help-popper"
        placement="bottom-start"
        trigger="hover"
      >
        <div class="help-title">{{ $t('GamesSetup.QuickBetInfo') }}</div>
        <div class="help-detail">
          {{ $t('GamesSetup.QuickBetInfo1') }}
          <br />
          {{ $t('GamesSetup.QuickBetInfo2') }}
          <br />
          {{ $t('GamesSetup.QuickBetInfo3') }}
        </div>
        <i class="el-icon-question" slot="reference"></i>
      </el-popover>

      <div class="cartBtn" @click="cartBtnClick">
        <i :class="isShowGameBet ? 'el-icon-arrow-right' : 'el-icon-shopping-cart-2'"></i>
      </div>
    </div>

    <el-dialog
      class="LeagueSelectDialog"
      :title="$t('GamesSetup.LeagueSelect')"
      width="80%"
      center
      :visible.sync="isShowLeagueSelectDialog"
    >
      <div class="LeagueSelectDialogContent">
        <div class="ContentHeader">
          <el-checkbox size="medium" v-model="dialogData.selectAll" @change="dialogSelectAll">
            {{ $t('GamesSetup.SelectAll') }}
          </el-checkbox>
          <el-checkbox size="medium" v-model="dialogData.onlyShowCheck">
            {{ $t('GamesSetup.SelectCheck') }}
          </el-checkbox>
        </div>
        <div class="leagueItemContentList">
          <div class="leagueItem" v-for="(leagueData, index) in LeagueListDataFilter" :key="index">
            <el-checkbox size="medium" v-model="leagueData.isSelect">
              {{ leagueData.LeagueName }}
            </el-checkbox>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="cancelBtn" @click="isShowLeagueSelectDialog = false">
          {{ $t('GamesSetup.Cancel') }}
        </div>
        <div class="submitBtn" type="primary" @click="leagueChooseSelectHandler">
          {{ $t('GamesSetup.Submit') }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Marquee from './Marquee.vue';
  export default {
    name: 'GamesSetup',
    props: {
      isShowGameBet: {
        type: Boolean,
      },
    },
    components: {
      Marquee,
    },
    data() {
      return {
        quickBetEnable: false, // 快速投注开关
        quickBetAmount: 0,
        listValue: this.$t('GamesSetup.IncludePrincipal'),
        isAcceptBetter: null,
        sortValue: null,
        sortList: [
          { value: 1, label: this.$t('GamesSetup.TimeSort') },
          { value: 0, label: this.$t('GamesSetup.HotSort') },
        ],
        isIncludePrincipal: null,
        principalOption: [
          { value: false, label: this.$t('GamesSetup.NotIncludePrincipal') },
          { value: true, label: this.$t('GamesSetup.IncludePrincipal') },
        ],
        currentTime: null,
        countInterval: null,
        announcementInterval: null,
        isShowLeagueSelectDialog: false,
        dialogData: {
          selectAll: false,
          onlyShowCheck: false,
        },
        LeagueListData: [],
        marqueeText: '',
      };
    },
    mounted() {
      this.countInterval = setInterval(() => {
        if (this.currentTime !== null) {
          this.currentTime += 1000;
        }
      }, 1000);
      this.initTimeAPI();
      document.addEventListener('visibilitychange', this.visibilitychangeEvent);

      // 輪詢 公告 API
      this.announcementInterval = setInterval(() => {
        this.getAnnouncement();
      }, 10000);
      this.getAnnouncement();
    },
    beforeDestroy() {
      document.removeEventListener('visibilitychange', this.visibilitychangeEvent);
      clearInterval(this.countInterval);
      clearInterval(this.announcementInterval);
    },
    computed: {
      TimeCountDown() {
        return this.$lib.timeFormatWithOutYY(this.currentTime);
      },
      tableSort() {
        return this.$store.state.Setting.UserSetting.tableSort;
      },
      includePrincipal() {
        return this.$store.state.Setting.UserSetting.includePrincipal;
      },
      acceptBetter() {
        return this.$store.state.Setting.UserSetting.acceptBetter;
      },
      LeagueListDataFilter() {
        if (this.dialogData.onlyShowCheck) {
          return this.LeagueListData.filter((it) => it.isSelect);
        } else {
          return this.LeagueListData;
        }
      },
      isQuickBet() {
        return this.$store.state.Game.isQuickBet;
      },
      UserCredit() {
        return this.$store.state.User.UserCredit;
      },
    },
    watch: {
      isQuickBet: {
        handler(val) {
          this.quickBetEnable = val.isEnable;
          this.quickBetAmount = val.amount;
        },
        immediate: true,
      },
      TimeCountDown() {
        const dateTime = this.TimeCountDown.time;
        if (dateTime === '12:00:10') {
          location.reload();
        }
      },
      tableSort: {
        handler() {
          this.sortValue = this.tableSort;
        },
        immediate: true,
      },
      includePrincipal: {
        handler() {
          this.isIncludePrincipal = this.includePrincipal;
        },
        immediate: true,
      },
      acceptBetter: {
        handler() {
          this.isAcceptBetter = this.acceptBetter;
        },
        immediate: true,
      },
    },
    methods: {
      quickBetAmountChangeHandler() {
        this.quickBetAmount = parseFloat(this.quickBetAmount.replace(/[^\d]/g, ''));
        if (isNaN(this.quickBetAmount)) {
          this.quickBetAmount = 0;
        }
        if (this.quickBetAmount > this.UserCredit) {
          this.quickBetAmount = this.UserCredit;
        }
        this.$store.commit('Game/setQuickBetAmount', this.quickBetAmount);
      },
      quickBetEnableChangeHandler() {
        this.$store.commit('Game/setQuickBetEnable', this.quickBetEnable);
      },
      visibilitychangeEvent() {
        if (document.visibilityState === 'visible') {
          this.initTimeAPI();
        }
      },
      initTimeAPI() {
        this.$store.dispatch('getSystemTime').then((res) => {
          this.currentTime = new Date(res.data.replace(/-/g, '/')).getTime();
        });
      },
      clearLeagueList() {
        this.isShowLeagueSelectDialog = false;
        this.dialogData = {
          selectAll: false,
          onlyShowCheck: false,
        };
        this.LeagueListData = [];
      },
      changeTheme(value) {
        this.$store.commit('SetThemeInfo', value);
      },
      closeProject(value) {
        this.listValue = value.label;
      },
      handleCommand(command) {
        this.listValue = command;
      },
      handleSort(val) {
        this.$store.commit('Setting/setTableSort', val);
      },
      handleIsIncludePrincipal(val) {
        this.$store.commit('Setting/setIncludePrincipal', val);
      },
      checkboxChangeHandler(val) {
        this.$store.commit('Setting/setAcceptBetter', val);
      },
      showLeagueSelectDialog() {
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

            this.isShowLeagueSelectDialog = true;
          })
          .finally(() => {
            this.$store.commit('SetLoading', false);
          });
      },
      dialogSelectAll(newVal) {
        this.LeagueListData.forEach((it) => (it.isSelect = newVal));
      },
      leagueChooseSelectHandler() {
        this.$store.commit(
          'Game/setSelectLeagueIDs',
          this.LeagueListData.filter((it) => it.isSelect).map((it) => it.LeagueID)
        );
        this.$emit('SelectLeague');
        this.isShowLeagueSelectDialog = false;
      },
      getAnnouncement() {
        this.$store.dispatch('Game/GetAnnouncement').then((res) => {
          console.log('res:', res);
          if (res.data) {
            this.marqueeText = res.data.content;
          }
        });
      },
      cartBtnClick() {
        this.$emit('ClickShowGameBet', !this.isShowGameBet);
      },
    },
  };
</script>

<style lang="scss">
  #GamesSetup {
    .LeagueSelectDialog {
      .el-dialog {
        max-width: 980px;
        .el-dialog__header {
          background-color: #3fa381;
          padding: 8px;
          .el-dialog__title {
            color: white !important;
            font-size: 15px;
          }
          .el-dialog__headerbtn {
            right: 12px;
            top: 10px;
            .el-dialog__close {
              font-size: 20px;
              color: white;
            }
          }
        }
        .el-dialog__body {
          min-height: 300px;
          .el-checkbox {
            display: flex;
            align-items: center;
            font-size: 19px;

            .el-checkbox__input.is-checked + .el-checkbox__label {
              color: #606266;
            }
          }
          .ContentHeader {
            margin-bottom: 25px;
          }
        }
        .el-dialog__body,
        .el-dialog__footer {
          background-color: #eee;
        }
        .dialog-footer {
          display: flex;
          justify-content: center;
          .cancelBtn,
          .submitBtn {
            width: 160px;
            line-height: 40px;
            height: 40px;
            font-size: 15px;
            text-align: center;
            cursor: pointer;
          }
          .submitBtn {
            background-color: #2f8be6;
            &:hover {
              background-color: #3a9dff;
            }
          }
          .cancelBtn {
            background-color: #929292;
            margin-right: 10px;
            &:hover {
              background-color: #aaa;
            }
          }
        }
        .LeagueSelectDialogContent {
          .ContentHeader {
            display: flex;
            justify-content: flex-end;
          }
          .leagueItemContentList {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            .leagueItem {
              width: 32%;
              margin: 0 2px;
              border: 1px solid #bebebe;
              padding: 5px;
              margin-bottom: 2px;
            }
          }
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  @import '@/assets/sass/theme/mixin.scss';

  .setUp_color {
    @include base-fontColor();
    margin-right: 8px;
  }

  #GamesSetup {
    color: #fff;
    height: 38px;
    font-size: 13px;
    @include background-color-hederTop();
    width: 100%;
    display: flex;
    .el-divider {
      height: 22px;
      background-color: #81f0ca;
      margin: 0 15px;
    }
    .setUp_L {
      flex-shrink: 0;
      width: 180px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      > div {
        height: 100%;
        display: inline-flex;
        align-items: center;
        img {
          height: 25px;
          width: 25px;
          margin: 1px 5px;
          cursor: pointer;
        }
      }
      .timeBlockContainer {
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #81f0ca;
        white-space: nowrap;
        .dayBlock {
          margin-right: 10px;
        }
      }
    }
    .setUp_C {
      flex-grow: 1;
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      width: calc(100% - 480px);

      .marquee-wrapper {
        flex-grow: 1;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        padding: 0 1rem;
        margin: 0 1rem;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 6px;
        overflow: hidden;

        .icon {
          flex-shrink: 0;
          width: 25px;
          height: 25px;
          margin-right: 0.5rem;
          background-image: url('~@/assets/img/common/megaphone.png');
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
      }

      .options-wrapper {
        flex-shrink: 0;

        .margin-0 {
          margin: 0 0 0 8px;
        }
        .el-dropdown {
          font-size: 12px;
          cursor: pointer;
          @include base-fontColor();
          > span {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          i {
            margin-left: 5px;
          }
        }
        .selectLeague {
          color: white;
          cursor: pointer;
        }
      }
    }
    .setUp_R {
      flex-shrink: 0;
      width: 300px;
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      .popover {
        width: 20px;
        display: flex;
        justify-content: center;
        margin: 0 5px;
      }
      i {
        font-size: 20px;
        color: #000000;
      }
      .setUp_input {
        width: 110px;
        height: 25px;
        border-radius: 3px;
        background-color: #333;
        padding: 0 10px;
        border: none;
        color: #fff;
        outline: none;
        margin-right: 8px;
      }
      .cartBtn {
        background: #ffdf1b;
        display: flex;
        justify-content: center;
        border-radius: 10px;
        margin-right: 5px;
        cursor: pointer;
        i {
          display: block;
          margin: 0;
          padding: 2px 8px;
        }
      }
    }
  }
</style>

<style lang="scss">
  .fastBet-help-popper {
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
      color: #000;
      font-size: 13px;
      padding: 10px 20px;
    }
  }
</style>

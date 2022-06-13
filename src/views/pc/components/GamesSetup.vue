<template>
  <div id="GamesSetup">
    <div class="setUp_L">
      <span class="timeBlockContainer">
        <div class="dayBlock">{{ TimeCountDown.day }}</div>
        <div class="timeBlock">{{ TimeCountDown.time }}</div>
      </span>
      <!-- 切換主題色 -->
      <div>
        <!-- <img alt="" class="icon" src="@/assets/img/pc/sun1.svg" @click="changeTheme('light')" /> -->
        <!-- <img alt="" class="icon" src="@/assets/img/pc/yue.svg" @click="changeTheme('dark')" /> -->
      </div>
    </div>
    <div class="setUp_C">
      <span>
        自動接收最佳賠率
        <el-checkbox v-model="isAcceptBetter" @change="checkboxChangeHandler"></el-checkbox
      ></span>
      <el-divider direction="vertical"></el-divider>
      <span class="selectLeague" @click="showLeagueSelectDialog">聯盟選擇</span>
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
    <div class="setUp_R">
      <span class="setUp_color">快速投註</span>
      <input v-model="input" v-show="quick_bet" placeholder="請輸入金額" class="setUp_input" />
      <el-switch v-model="quick_bet" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
      <i class="el-icon-question"></i>
    </div>

    <el-dialog
      class="LeagueSelectDialog"
      title="聯盟選擇"
      width="80%"
      center
      :visible.sync="isShowLeagueSelectDialog"
    >
      <div class="LeagueSelectDialogContent">
        <div class="ContentHeader">
          <el-checkbox size="medium" v-model="dialogData.selectAll" @change="dialogSelectAll">
            全選
          </el-checkbox>
          <el-checkbox size="medium" v-model="dialogData.onlyShowCheck">只顯示已勾選</el-checkbox>
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
        <div class="cancelBtn" @click="isShowLeagueSelectDialog = false">取 消</div>
        <div class="submitBtn" type="primary" @click="leagueChooseSelectHandler">提 交</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'GamesSetup',
    data() {
      return {
        quick_bet: false, // 快速投注开关
        listValue: '含本金',
        input: '',
        isAcceptBetter: null,
        sortValue: null,
        sortList: [
          { value: 1, label: '時間排序' },
          { value: 0, label: '熱門排序' },
        ],
        isIncludePrincipal: null,
        principalOption: [
          { value: false, label: '不含本金' },
          { value: true, label: '含本金' },
        ],
        currentTime: null,
        countInterval: null,
        isShowLeagueSelectDialog: false,
        dialogData: {
          selectAll: false,
          onlyShowCheck: false,
        },
        LeagueListData: [],
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
    },
    beforeDestroy() {
      document.removeEventListener('visibilitychange', this.visibilitychangeEvent);
      clearInterval(this.countInterval);
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
    },
    watch: {
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
    margin-right: 10px;
    @include base-fontColor();
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
      width: 200px;
      display: inline-flex;
      justify-content: space-around;
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
        display: flex;
        align-items: center;
        width: 120px;
        color: #81f0ca;
        white-space: nowrap;
        margin-left: 20px;
        .dayBlock {
          margin-right: 10px;
        }
      }
    }
    .setUp_C {
      flex: 1;
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
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
        color: #ffea01;
        cursor: pointer;
      }
    }
    .setUp_R {
      width: 300px;
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 10px;
      i {
        font-size: 20px;
        color: #000000;
        margin-left: 10px;
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
        margin: 0 10px;
      }
    }
  }
</style>

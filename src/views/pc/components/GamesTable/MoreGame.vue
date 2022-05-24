<template>
  <div id="MoreGame">
    <div class="MoreGameHeader">
      <div class="teamName">{{ getTeamData.home }}</div>
      <div class="teamVS">vs</div>
      <div class="teamName">{{ getTeamData.away }}</div>
      <img
        class="closeBtn"
        src="@/assets/img/pc/btn_close_w.svg"
        @click="$store.commit('MoreGame/closeMoreGameList')"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MoreGame',
    computed: {
      moreGameData() {
        return this.$store.state.MoreGame.moreGameData;
      },
      teamData() {
        return this.moreGameData.TeamData;
      },
      CatID() {
        return this.moreGameData.CatID;
      },
      getTeamData() {
        let home = '';
        let away = '';
        if (this.$SportLib.isHomeAwayReverse(this.CatID)) {
          home = this.teamData.AwayTeamStr;
          away = this.teamData.HomeTeamStr;
        } else {
          home = this.teamData.HomeTeamStr;
          away = this.teamData.AwayTeamStr;
        }
        return {
          home,
          away,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  #MoreGame {
    height: 100%;
    width: 370px;
    border-right: 2px solid #bbb;
    background-color: #eeeeee;
    .MoreGameHeader {
      background-color: #136146;
      border-bottom-color: #136146;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 35px;
      width: 100%;
      position: relative;
      .teamName {
        color: #fff;
      }
      .teamVS {
        color: #ffdf1b;
        font-size: 15px;
        padding: 0 8px;
      }
      .closeBtn {
        width: 13px;
        height: 13px;
        position: absolute;
        right: 10px;
        opacity: 0.5;
        top: 10px;

        cursor: pointer;
      }
    }
  }
</style>

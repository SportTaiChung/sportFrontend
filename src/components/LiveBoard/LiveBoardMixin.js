const LiveBoardMixin = {
  props: {
    // 後端說資料面不確定會不會有多資料,所以統一先用array
    // 所以目前資料面都直接取得array 第一個
    gameScoreData: {
      type: Array,
    },
    teamData: {
      type: Object,
    },
  },
  computed: {
    CatMapData() {
      return this.$store.state.Game.CatMapData;
    },
  },
  methods: {
    // 背景圖
    background(catId) {
      const board = this.CatMapData[catId].background;
      const url = require('@/assets/img/common/liveBoard/boards/' + board);
      return {
        'background-image': `url(${url})`,
      };
    },
    keyNameToShow(key, renderType) {
      const scoreData = this.gameScoreData[0];
      if (scoreData) {
        if (!scoreData[key]) {
          return '';
        } else {
          if (renderType === 0) {
            return scoreData[key].split(':')[0];
          } else {
            return scoreData[key].split(':')[1];
          }
        }
      }
    },
  },
};

export default LiveBoardMixin;

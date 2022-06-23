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
};

export default LiveBoardMixin;

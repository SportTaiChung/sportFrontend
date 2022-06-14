/**
 * Wager 轉 文本
 * @param {Empty} val
 * @param {Array} WagerTypeIDs WagerTypeIDs
 * @param {Number} grpId WagerGrpID
 * @returns { String } 用來顯示的文本
 */
export function WagerTypeIDandWagerGrpIDtoString(WagerTypeIDs, grpId, isMoreGameMode = false) {
  let WagerGrp = '';
  let WagerType = '';
  let text = '';
  if (grpId === 0 || grpId === 10 || grpId === 20) {
    WagerGrp = '全場';
  } else if (grpId === 1 || grpId === 11 || grpId === 21) {
    WagerGrp = '上半';
  } else {
    WagerGrp = '';
  }
  if ([101, 103].find((typeID) => WagerTypeIDs.includes(typeID))) {
    WagerType = '讓球';
    if (isMoreGameMode) {
      text = WagerType;
    } else {
      text = WagerGrp + WagerType;
    }
  } else if ([102, 104, 109].find((typeID) => WagerTypeIDs.includes(typeID))) {
    WagerType = '大小';
    if (isMoreGameMode) {
      text = WagerType;
    } else {
      text = WagerGrp + WagerType;
    }
  } else if ([111, 110].find((typeID) => WagerTypeIDs.includes(typeID))) {
    WagerType = '獨贏';
    if (isMoreGameMode) {
      text = WagerType;
    } else {
      text = WagerGrp + WagerType;
    }
  } else if ([105, 113].find((typeID) => WagerTypeIDs.includes(typeID))) {
    WagerType = '單雙';
    if (isMoreGameMode) {
      text = WagerType;
    } else {
      text = WagerGrp + WagerType;
    }
  } else if ([106].find((typeID) => WagerTypeIDs.includes(typeID))) {
    WagerType = '一输';
    if (isMoreGameMode) {
      text = WagerType;
    } else {
      text = WagerGrp + WagerType;
    }
  } else if ([121].find((typeID) => WagerTypeIDs.includes(typeID))) {
    text = '局數讓球';
  } else if ([122].find((typeID) => WagerTypeIDs.includes(typeID))) {
    text = '局數大小';
  } else if ([128].find((typeID) => WagerTypeIDs.includes(typeID))) {
    text = '總分讓球';
  } else if ([129].find((typeID) => WagerTypeIDs.includes(typeID))) {
    text = '總分單雙';
  } else if ([126].find((typeID) => WagerTypeIDs.includes(typeID))) {
    text = '局數單雙';
  } else if ([127].find((typeID) => WagerTypeIDs.includes(typeID))) {
    text = '局數獨贏';
  } else if ([125].find((typeID) => WagerTypeIDs.includes(typeID))) {
    text = '總分大小';
  } else if ([123].find((typeID) => WagerTypeIDs.includes(typeID))) {
    text = '盤數獨贏';
  } else if ([124].find((typeID) => WagerTypeIDs.includes(typeID))) {
    text = '盤數讓球';
  } else {
    console.error(`SportLib error ${WagerTypeIDs} not found`);
  }
  return text;
}

/**
 * 所有玩法數據的資料
 * WagerPos : 1主 2客 3和 4大 5小 4單 5雙
 *  name: 'HandiCap',
 *?  玩法名
 *  typeIdList: [101, 103],
 *?  有哪些typeIdList 是在此分類下
 *  wagerPos: [1, 2],
 *?  對應API的WagerPos
 *  showMethod: ['topPlayMethod', 'bottomPlayMethod'],
 *?  顯示method的key
 *  showOdd: ['topPlayOdd', 'bottomPlayOdd'],
 *?  顯示Odd的key
 *  betCutLineDealFunc:
 *?  下注送出時組成CutLine所需的資料
 */
export const PlayMethodData = {
  // 讓分
  HandiCap: {
    name: 'HandiCap',
    typeIdList: [101, 103, 121],
    betCutLineDealFunc: function (oddData) {
      return oddData.HomeHdp !== '' ? oddData.HomeHdp : oddData.AwayHdp;
    },
  },
  // 大小
  BigSmall: {
    name: 'BigSmall',
    typeIdList: [102, 104, 109, 122, 125],
    betCutLineDealFunc: function (oddData) {
      return oddData.OULine;
    },
  },
  // 獨贏
  SoloWin: {
    name: 'SoloWin',
    typeIdList: [110, 111, 127],
    betCutLineDealFunc: function () {
      return 0;
    },
  },
  // 單雙
  OddEven: {
    name: 'OddEven',
    typeIdList: [105, 113, 126, 129],
    betCutLineDealFunc: function () {
      return 0;
    },
  },
  // 其他:
  Other: {
    name: 'Other',
    typeIdList: [106],
    betCutLineDealFunc: function () {
      return 0;
    },
  },
};

export function oddDataToMorePlayData(SetFlag, wagerTypeID = null, oddData = null) {
  if (SetFlag === undefined) {
    console.error('SetFlag is undefined');
  }
  if (PlayMethodData.HandiCap.typeIdList.indexOf(wagerTypeID) !== -1) {
    // 讓分
    const showHdp = oddData.HomeHdp === '' ? oddData.AwayHdp : oddData.HomeHdp;
    let homeShow = '';
    let awayShow = '';
    if (oddData.HomeHdp === '') {
      if (!SetFlag) {
        homeShow = '-' + showHdp;
        awayShow = '+' + showHdp;
      } else {
        homeShow = '+' + showHdp;
        awayShow = '-' + showHdp;
      }
    } else {
      if (!SetFlag) {
        homeShow = '+' + showHdp;
        awayShow = '-' + showHdp;
      } else {
        homeShow = '-' + showHdp;
        awayShow = '+' + showHdp;
      }
    }
    if (Number(showHdp) === 0) {
      homeShow = showHdp;
      awayShow = showHdp;
    }

    if (!SetFlag) {
      return [
        {
          showMethod: '客 ' + homeShow,
          showOdd: oddData.AwayHdpOdds,
          wagerPos: 2,
        },
        {
          showMethod: '主 ' + awayShow,
          showOdd: oddData.HomeHdpOdds,
          wagerPos: 1,
        },
      ];
    } else {
      return [
        {
          showMethod: '主 ' + homeShow,
          showOdd: oddData.HomeHdpOdds,
          wagerPos: 1,
        },
        {
          showMethod: '客 ' + awayShow,
          showOdd: oddData.AwayHdpOdds,
          wagerPos: 2,
        },
      ];
    }
  } else if (PlayMethodData.BigSmall.typeIdList.indexOf(wagerTypeID) !== -1) {
    return [
      {
        showMethod: '大 ' + oddData.OULine,
        showOdd: oddData.OverOdds,
        wagerPos: 4,
      },
      {
        showMethod: '小 ' + oddData.OULine,
        showOdd: oddData.UnderOdds,
        wagerPos: 5,
      },
    ];
  } else if (PlayMethodData.SoloWin.typeIdList.indexOf(wagerTypeID) !== -1) {
    // 獨贏
    if (!SetFlag) {
      const resArr = [
        {
          showMethod: '客',
          showOdd: oddData.AwayOdds,
          wagerPos: 2,
        },
        {
          showMethod: '主',
          showOdd: oddData.HomeOdds,
          wagerPos: 1,
        },
      ];
      if (Number(oddData.DrewOdds) !== 0) {
        resArr.splice(1, 0, {
          showMethod: '和',
          showOdd: oddData.DrewOdds,
          wagerPos: 3,
        });
      }
      return resArr;
    } else {
      const resArr = [
        {
          showMethod: '主',
          showOdd: oddData.HomeOdds,
          wagerPos: 1,
        },
        {
          showMethod: '客',
          showOdd: oddData.AwayOdds,
          wagerPos: 2,
        },
      ];
      if (Number(oddData.DrewOdds) !== 0) {
        resArr.splice(1, 0, {
          showMethod: '和',
          showOdd: oddData.DrewOdds,
          wagerPos: 3,
        });
      }
      return resArr;
    }
  } else if (PlayMethodData.OddEven.typeIdList.indexOf(wagerTypeID) !== -1) {
    // 單雙
    return [
      {
        showMethod: '單',
        showOdd: oddData.OverOdds,
        wagerPos: 4,
      },
      {
        showMethod: '雙',
        showOdd: oddData.UnderOdds,
        wagerPos: 5,
      },
    ];
  } else if (PlayMethodData.Other.typeIdList.indexOf(wagerTypeID) !== -1) {
    if (!SetFlag) {
      return [
        {
          showMethod: '客',
          showOdd: oddData.AwayHdpOdds,
          wagerPos: 2,
        },
        {
          showMethod: '主',
          showOdd: oddData.HomeHdpOdds,
          wagerPos: 1,
        },
      ];
    } else {
      return [
        {
          showMethod: '主',
          showOdd: oddData.HomeHdpOdds,
          wagerPos: 1,
        },
        {
          showMethod: '客',
          showOdd: oddData.AwayHdpOdds,
          wagerPos: 2,
        },
      ];
    }
  } else {
    return [];
  }
}

// 將oddData轉成用來顯示的資料
export function oddDataToPlayData(SetFlag, wagerTypeID = null, oddData = null) {
  if (SetFlag === undefined) {
    console.error('SetFlag is undefined');
  }
  let topPlayMethod = '';
  let topPlayOdd = '';
  let topWagerPos = '';
  let bottomPlayMethod = '';
  let bottomPlayOdd = '';
  let bottomWagerPos = '';
  let drewPlayOdd = '';
  let drewWagerPos = '';
  let layoutType = 'normal';
  let playMethodData = null;
  if (oddData !== null) {
    if (PlayMethodData.HandiCap.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 讓分
      topPlayMethod = oddData.HomeHdp;
      topPlayOdd = oddData.HomeHdpOdds;
      topWagerPos = 1;
      bottomPlayMethod = oddData.AwayHdp;
      bottomPlayOdd = oddData.AwayHdpOdds;
      bottomWagerPos = 2;
      playMethodData = PlayMethodData.HandiCap;
    } else if (PlayMethodData.BigSmall.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 大小
      topPlayMethod = oddData.OULine;
      topPlayOdd = oddData.OverOdds;
      topWagerPos = 4;
      bottomPlayMethod = '小';
      bottomPlayOdd = oddData.UnderOdds;
      bottomWagerPos = 5;
      playMethodData = PlayMethodData.BigSmall;
    } else if (PlayMethodData.SoloWin.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 獨贏
      topPlayOdd = oddData.HomeOdds;
      topWagerPos = 1;
      bottomPlayOdd = oddData.AwayOdds;
      bottomWagerPos = 2;
      drewPlayOdd = oddData.DrewOdds;
      drewWagerPos = 3;
      layoutType = 'single';
      playMethodData = PlayMethodData.SoloWin;
    } else if (PlayMethodData.OddEven.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 單雙
      topPlayMethod = '單';
      topPlayOdd = oddData.OverOdds;
      topWagerPos = 4;
      bottomPlayMethod = '雙';
      bottomPlayOdd = oddData.UnderOdds;
      bottomWagerPos = 5;
      playMethodData = PlayMethodData.OddEven;
    } else if (PlayMethodData.Other.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 其他
      topPlayOdd = oddData.HomeHdpOdds;
      topWagerPos = 1;
      bottomPlayOdd = oddData.AwayHdpOdds;
      bottomWagerPos = 2;
      layoutType = 'single';
      playMethodData = PlayMethodData.Other;
    } else {
      console.error('wagerTypeID not found:', wagerTypeID);
    }

    // 處理主客場對調
    //  ps.大小,單雙 玩法不能對調
    if (
      !SetFlag &&
      PlayMethodData.BigSmall.typeIdList.indexOf(wagerTypeID) === -1 &&
      PlayMethodData.OddEven.typeIdList.indexOf(wagerTypeID) === -1
    ) {
      [topPlayMethod, bottomPlayMethod] = [bottomPlayMethod, topPlayMethod];
      [topPlayOdd, bottomPlayOdd] = [bottomPlayOdd, topPlayOdd];
      [topWagerPos, bottomWagerPos] = [bottomWagerPos, topWagerPos];
    }
  }
  return {
    topPlayMethod,
    topPlayOdd,
    topWagerPos,
    bottomPlayMethod,
    bottomPlayOdd,
    bottomWagerPos,
    drewPlayOdd,
    drewWagerPos,
    layoutType,
    playMethodData,
  };
}

/**
 * WagerData 轉成 遊戲注格面板 的顯示格式
 * @param {Number} catID     球種ID
 * @param {Object} wagerData team底下的wager
 * @param {Object} rowIndex  team底下的第幾個row
 * @returns {Object}
 *?  topPlayMethod    {String} 上方玩法
 *?  topPlayOdd       {String} 上方賠率
 *?  bottomPlayMethod {String} 下方玩法
 *?  bottomPlayOdd    {String} 下方賠率
 *?  playMethodData   {Object} 參考 PlayMethodData
 *?  layoutType       {Object} 版型分類
 *     > normal: 預設版型
 *     > single: 只顯示一個Odd
 */
export function WagerDataToShowData(SetFlag, wagerData, rowIndex) {
  if (SetFlag === undefined) {
    console.error('SetFlag is undefined');
  }
  if (!wagerData?.isNoData) {
    // 關閉狀態
    if (wagerData.Odds[rowIndex] === undefined || wagerData.Odds[rowIndex].Status !== 1) {
      return oddDataToPlayData(SetFlag, null, null);
    } else {
      return oddDataToPlayData(SetFlag, wagerData.WagerTypeID, wagerData.Odds[rowIndex]);
    }
  } else {
    return oddDataToPlayData(SetFlag, null, null);
  }
}

// 將購物車的資料 轉成 購物車內顯示的資料
export function cartDataToDisplayData(cartData) {
  let showBetTitle = '';
  let showCutLine = '';
  let showOdd = '';
  const playData = cartData.playData;
  const SetFlag = cartData.SetFlag;
  let judgeWagerPos = cartData.wagerPos;
  if (playData.playMethodData.name === 'HandiCap') {
    if (!SetFlag) {
      if (judgeWagerPos === 1) {
        judgeWagerPos = 2;
      } else if (judgeWagerPos === 2) {
        judgeWagerPos = 1;
      }
    }
    if (judgeWagerPos === 1) {
      showBetTitle = cartData.HomeTeamStr;
      if (playData.topPlayMethod === '') {
        showCutLine = '+' + playData.bottomPlayMethod;
      } else {
        showCutLine = '-' + playData.topPlayMethod;
      }
      showOdd = playData.topPlayOdd;
    } else if (judgeWagerPos === 2) {
      showBetTitle = cartData.AwayTeamStr;
      if (playData.topPlayMethod === '') {
        showCutLine = '-' + playData.bottomPlayMethod;
      } else {
        showCutLine = '+' + playData.topPlayMethod;
      }
      showOdd = playData.bottomPlayOdd;
    } else {
      console.error(`cartDataToDisplayData no this wagerPos ${cartData.wagerPos}`);
    }
    if (playData.topPlayMethod === '0' || playData.bottomPlayMethod === '0') {
      showCutLine = '0';
    }
  } else if (playData.playMethodData.name === 'BigSmall') {
    if (judgeWagerPos === 4) {
      showBetTitle = '大';
      showCutLine = playData.topPlayMethod;
      showOdd = playData.topPlayOdd;
    } else if (judgeWagerPos === 5) {
      showBetTitle = '小';
      showCutLine = playData.topPlayMethod;
      showOdd = playData.bottomPlayOdd;
    } else {
      console.error(`cartDataToDisplayData no this wagerPos ${cartData.wagerPos}`);
    }
  } else if (playData.playMethodData.name === 'SoloWin') {
    if (!SetFlag) {
      if (judgeWagerPos === 1) {
        judgeWagerPos = 2;
      } else if (judgeWagerPos === 2) {
        judgeWagerPos = 1;
      }
    }
    if (judgeWagerPos === 1) {
      showBetTitle = cartData.HomeTeamStr;
      showOdd = playData.topPlayOdd;
      showCutLine = 'PK';
    } else if (judgeWagerPos === 2) {
      showBetTitle = cartData.AwayTeamStr;
      showOdd = playData.bottomPlayOdd;
      showCutLine = 'PK';
    } else if (judgeWagerPos === 3) {
      showBetTitle = '和局';
      showOdd = playData.drewPlayOdd;
      showCutLine = '';
    } else {
      console.error(`cartDataToDisplayData no this wagerPos ${cartData.wagerPos}`);
    }
  } else if (playData.playMethodData.name === 'OddEven') {
    if (judgeWagerPos === 4) {
      showBetTitle = '單';
      showOdd = playData.topPlayOdd;
    } else if (judgeWagerPos === 5) {
      showBetTitle = '雙';
      showOdd = playData.bottomPlayOdd;
    } else {
      console.error(`cartDataToDisplayData no this wagerPos ${cartData.wagerPos}`);
    }
  } else if (playData.playMethodData.name === 'Other') {
    if (!SetFlag) {
      if (judgeWagerPos === 1) {
        judgeWagerPos = 2;
      } else if (judgeWagerPos === 2) {
        judgeWagerPos = 1;
      }
    }
    if (judgeWagerPos === 1) {
      showBetTitle = cartData.HomeTeamStr;
      showOdd = playData.topPlayOdd;
      if (cartData.HomeHdp === '') {
        showCutLine = '-' + cartData.AwayHdp;
      } else {
        showCutLine = '+' + cartData.HomeHdp;
      }
    } else if (judgeWagerPos === 2) {
      showBetTitle = cartData.AwayTeamStr;
      showOdd = playData.bottomPlayOdd;
      if (cartData.AwayHdp === '') {
        showCutLine = '-' + cartData.HomeHdp;
      } else {
        showCutLine = '+' + cartData.AwayHdp;
      }
    } else {
      console.error(`cartDataToDisplayData no this wagerPos ${cartData.wagerPos}`);
    }
  } else {
    console.error('playData.playMethodData.name error:', playData.playMethodData.name);
  }

  let wagerGrpLabel = '';

  if (cartData.WagerGrpID === 0 || cartData.WagerGrpID === 10 || cartData.WagerGrpID === 20) {
    wagerGrpLabel = '- [全場]';
  } else if (
    cartData.WagerGrpID === 1 ||
    cartData.WagerGrpID === 11 ||
    cartData.WagerGrpID === 21
  ) {
    wagerGrpLabel = '- [上半]';
  }
  const showGameTypeLabel = `${cartData.CatNameStr} ${wagerGrpLabel}`;

  return {
    showBetTitle,
    showCutLine,
    showOdd,
    showGameTypeLabel,
    wagerGrpLabel,
  };
}

// 以 catID 取得對應 menu icon
export function getMenuIconByCatID(catID) {
  const iconMap = Object.freeze({
    1: 'icon_sportMenu_soccer.svg',
    5: 'icon_sportMenu_soccer.svg',
    21: 'icon_sportMenu_pingpong.svg',
    22: 'icon_sportMenu_badminton.svg',
    23: 'icon_sportMenu_volleyball.svg',
    31: 'icon_sportMenu_worldCup.svg',
    32: 'icon_sportMenu_UEFA.svg',
    4: 'icon_sportMenu_baseball.svg',
    12: 'icon_sportMenu_baseball.svg',
    13: 'icon_sportMenu_baseball.svg',
    14: 'icon_sportMenu_baseball.svg',
    101: 'icon_sportMenu_baseball.svg',
    102: 'icon_sportMenu_basketball.svg',
    3: 'icon_sportMenu_basketball.svg',
    16: 'icon_sportMenu_basketball.svg',
    55: 'icon_sportMenu_tennis.svg',
    72: 'icon_horse.svg',
    82: 'icon_sportMenu_hockey.svg',
    83: 'icon_lottery.svg',
    84: 'icon_invest.svg',
    85: 'icon_sportMenu_pcgame.svg',
    '-999': 'icon_sportMenu_star.svg',
    default: 'icon_sportMenu_soccer.svg',
  });

  return iconMap[catID] || iconMap.default;
}

// 以 catID 取得對應 背景圖片順位
export function getBackgroundIndexByCatId(catID) {
  const backgroundIndexes = Object.freeze({
    1: 0,
    5: 0,
    21: 9,
    22: 7,
    31: null,
    32: null,
    4: 2,
    12: 2,
    13: 2,
    14: 2,
    101: 2,
    102: 1,
    3: 1,
    16: 1,
    55: 3,
    72: null,
    82: 4,
    83: null,
    85: 10,
    '-999': null,
    default: null,
  });

  return backgroundIndexes[catID] || backgroundIndexes.default;
}

export const chipsData = [
  {
    value: 1,
    img: 'icon_chip_01.png',
  },
  {
    value: 5,
    img: 'icon_chip_02.png',
  },
  {
    value: 10,
    img: 'icon_chip_03.png',
  },
  {
    value: 100,
    img: 'icon_chip_04.png',
  },
  {
    value: 500,
    img: 'icon_chip_05.png',
  },
  {
    value: 1000,
    img: 'icon_chip_06.png',
  },
  {
    value: 2000,
    img: 'icon_chip_07.png',
  },
  {
    value: 5000,
    img: 'icon_chip_08.png',
  },
  {
    value: 10000,
    img: 'icon_chip_09.png',
  },
];

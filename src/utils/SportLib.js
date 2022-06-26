import i18n from '@/locales';

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
    typeIdList: [101, 103, 121, 124, 129],
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
    typeIdList: [110, 111, 123, 127],
    betCutLineDealFunc: function () {
      return 0;
    },
  },
  // 單雙
  OddEven: {
    name: 'OddEven',
    typeIdList: [105, 113, 126, 128],
    betCutLineDealFunc: function () {
      return 0;
    },
  },
  // 波膽
  Bold: {
    name: 'Bold',
    typeIdList: [112],
    betCutLineDealFunc: function (oddData) {
      return oddData.OULine;
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
          showMethod: `${i18n.t('Common.Away')} ${homeShow}`,
          showOdd: oddData.AwayHdpOdds,
          wagerPos: 2,
        },
        {
          showMethod: `${i18n.t('Common.Home')} ${awayShow}`,
          showOdd: oddData.HomeHdpOdds,
          wagerPos: 1,
        },
      ];
    } else {
      return [
        {
          showMethod: `${i18n.t('Common.Home')} ${homeShow}`,
          showOdd: oddData.HomeHdpOdds,
          wagerPos: 1,
        },
        {
          showMethod: `${i18n.t('Common.Away')} ${awayShow}`,
          showOdd: oddData.AwayHdpOdds,
          wagerPos: 2,
        },
      ];
    }
  } else if (PlayMethodData.BigSmall.typeIdList.indexOf(wagerTypeID) !== -1) {
    return [
      {
        showMethod: `${i18n.t('Common.Big')} ${oddData.OULine}`,
        showOdd: oddData.OverOdds,
        wagerPos: 4,
      },
      {
        showMethod: `${i18n.t('Common.Small')} ${oddData.OULine}`,
        showOdd: oddData.UnderOdds,
        wagerPos: 5,
      },
    ];
  } else if (PlayMethodData.SoloWin.typeIdList.indexOf(wagerTypeID) !== -1) {
    // 獨贏
    if (!SetFlag) {
      const resArr = [
        {
          showMethod: i18n.t('Common.Away'),
          showOdd: oddData.AwayOdds,
          wagerPos: 2,
        },
        {
          showMethod: i18n.t('Common.Home'),
          showOdd: oddData.HomeOdds,
          wagerPos: 1,
        },
      ];
      if (Number(oddData.DrewOdds) !== 0) {
        resArr.splice(1, 0, {
          showMethod: i18n.t('Common.Drew'),
          showOdd: oddData.DrewOdds,
          wagerPos: 3,
        });
      }
      return resArr;
    } else {
      const resArr = [
        {
          showMethod: i18n.t('Common.Home'),
          showOdd: oddData.HomeOdds,
          wagerPos: 1,
        },
        {
          showMethod: i18n.t('Common.Away'),
          showOdd: oddData.AwayOdds,
          wagerPos: 2,
        },
      ];
      if (Number(oddData.DrewOdds) !== 0) {
        resArr.splice(1, 0, {
          showMethod: i18n.t('Common.Drew'),
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
        showMethod: i18n.t('Common.Single'),
        showOdd: oddData.OverOdds,
        wagerPos: 4,
      },
      {
        showMethod: i18n.t('Common.Double'),
        showOdd: oddData.UnderOdds,
        wagerPos: 5,
      },
    ];
  } else if (PlayMethodData.Other.typeIdList.indexOf(wagerTypeID) !== -1) {
    if (!SetFlag) {
      return [
        {
          showMethod: i18n.t('Common.Away'),
          showOdd: oddData.AwayHdpOdds,
          wagerPos: 2,
        },
        {
          showMethod: i18n.t('Common.Home'),
          showOdd: oddData.HomeHdpOdds,
          wagerPos: 1,
        },
      ];
    } else {
      return [
        {
          showMethod: i18n.t('Common.Home'),
          showOdd: oddData.HomeHdpOdds,
          wagerPos: 1,
        },
        {
          showMethod: i18n.t('Common.Away'),
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
      bottomPlayMethod = i18n.t('Common.Small');
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
      topPlayMethod = i18n.t('Common.Single');
      topPlayOdd = oddData.OverOdds;
      topWagerPos = 4;
      bottomPlayMethod = i18n.t('Common.Double');
      bottomPlayOdd = oddData.UnderOdds;
      bottomWagerPos = 5;
      playMethodData = PlayMethodData.OddEven;
    } else if (PlayMethodData.Bold.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 其他
      topPlayOdd = null;
      topWagerPos = null;
      bottomPlayOdd = null;
      bottomWagerPos = null;
      layoutType = null;
      playMethodData = PlayMethodData.Bold;
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
      showBetTitle = i18n.t('Common.Big');
      showCutLine = playData.topPlayMethod;
      showOdd = playData.topPlayOdd;
    } else if (judgeWagerPos === 5) {
      showBetTitle = i18n.t('Common.Small');
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
      showBetTitle = i18n.t('Common.DrewOdd');
      showOdd = playData.drewPlayOdd;
      showCutLine = '';
    } else {
      console.error(`cartDataToDisplayData no this wagerPos ${cartData.wagerPos}`);
    }
  } else if (playData.playMethodData.name === 'OddEven') {
    if (judgeWagerPos === 4) {
      showBetTitle = i18n.t('Common.Single');
      showOdd = playData.topPlayOdd;
    } else if (judgeWagerPos === 5) {
      showBetTitle = i18n.t('Common.Double');
      showOdd = playData.bottomPlayOdd;
    } else {
      console.error(`cartDataToDisplayData no this wagerPos ${cartData.wagerPos}`);
    }
  } else if (playData.playMethodData.name === 'Bold') {
    showBetTitle = cartData.OULine;
    showOdd = cartData.DrewOdds;
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
  let wagerBoldLabel = '';
  // 波膽處理
  if (cartData.WagerTypeID === 112) {
    wagerBoldLabel = `- ${i18n.t('Common.Bold')}`;
  }

  if (cartData.WagerGrpID === 0 || cartData.WagerGrpID === 10 || cartData.WagerGrpID === 20) {
    wagerGrpLabel = `- [${i18n.t('Common.FullGame')}${wagerBoldLabel}]`;
  } else if (
    cartData.WagerGrpID === 1 ||
    cartData.WagerGrpID === 11 ||
    cartData.WagerGrpID === 21
  ) {
    wagerGrpLabel = `- [${i18n.t('Common.HalfGame')}${wagerBoldLabel}]`;
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

// 取得彩種 menu icon
export function getMenuIconByCatID(catID) {
  const map = Object.freeze({
    1: 'icon_sportMenu_soccer.svg', // 足球
    5: 'icon_sportMenu_football.svg', // 美足
    21: 'icon_sportMenu_pingpong.svg', // 乒乓
    22: 'icon_sportMenu_badminton.svg', // 羽球
    23: 'icon_sportMenu_volleyball.svg', // 排球
    24: 'icon_sportMenu_billiard.svg', // 撞球
    31: 'icon_sportMenu_worldCup.svg', // 世界盃
    32: 'icon_sportMenu_UEFA.svg', // 歐洲杯
    55: 'icon_sportMenu_tennis.svg', // 網球
    72: 'icon_horse.svg', // 賽馬賽狗
    82: 'icon_sportMenu_hockey.svg', // 冰球
    83: 'icon_lottery.svg', // 彩球
    84: 'icon_invest.svg', // 指數
    85: 'icon_sportMenu_pcgame.svg', // 電競
    101: 'icon_sportMenu_baseball.svg', // 棒球
    102: 'icon_sportMenu_basketball.svg', // 籃球
    '-999': 'icon_sportMenu_star.svg', // 收藏
    default: 'icon_sportMenu_soccer.svg',
  });

  return map[catID] || map.default;
}

// 取得彩種 背景圖
export function getBoardImageByCatId(catID) {
  const map = Object.freeze({
    1: 'soccer.jpg',
    5: 'Rugby.jpg',
    21: 'pingpong.jpg',
    22: 'badminton.jpg',
    23: 'volleyball.jpg',
    24: 'billiard.jpg',
    31: 'worldCup.jpg',
    32: 'champion.jpg',
    55: 'tennis.jpg',
    72: null,
    82: 'hockey.jpg',
    83: null,
    84: null,
    85: 'pcgame.jpg',
    101: 'baseball.jpg',
    102: 'basketball.jpg',
    '-999': null,
    default: 'soccer.jpg',
  });

  return map[catID] || map.default;
}

// 取得彩種 顏色
export function getColorByCatId(catID) {
  const map = Object.freeze({
    1: '#61b880',
    5: '#b25332',
    21: '#c6914b',
    22: '#d56f84',
    23: '#e0bf36',
    24: '#A470AC',
    31: '#65cc56',
    32: '#FFFC4C',
    55: '#90b270',
    72: '#14be9e',
    82: '#14be9e',
    83: '#f07f3f',
    84: '#fe5186',
    85: '#7894dc',
    101: '#caba62',
    102: '#ae6a3d',
    '-999': '#ffffff',
    default: '#ffffff',
  });

  return map[catID] || map.default;
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

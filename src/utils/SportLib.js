/**
 * CatID 轉文本
 * @param {Number} val
 * @returns String
 */
export function CatIDtoShowLabel(val) {
  if (val === 1) {
    return '足球';
  } else if (val === 5) {
    return '美足';
  } else if (val === 21) {
    return '乒乓球';
  } else if (val === 22) {
    return '羽毛球';
  } else if (val === 31) {
    return '世界杯';
  } else if (val === 32) {
    return '歐洲杯';
  } else if (val === 101 || val === 4 || val === 12) {
    return '棒球';
  } else if (val === 102 || val === 3 || val === 16) {
    return '籃球';
  } else if (val === 55) {
    return '网球';
  } else if (val === 72) {
    return '赛马赛狗';
  } else if (val === 82) {
    return '冰球';
  } else if (val === 83) {
    return '彩球';
  } else if (val === 85) {
    return 'ESports';
  } else {
    console.error(`catIDtoString ${val} no found`);
  }
}

/**
 * Wager 轉 文本
 * @param {Empty} val
 * @param {Array} typeid WagerTypeID
 * @param {Number} grpid WagerGrpID
 * @returns { String } 用來顯示的文本
 */
export function WagerTypeIDandWagerGrpIDtoString(typeid, grpid) {
  let WagerGrp = '';
  let Wagertype = '';
  let text = '';
  if (grpid === 10 || grpid === 0 || grpid === 20) {
    WagerGrp = '全場';
  } else if (grpid === 1 || grpid === 11 || grpid === 21) {
    WagerGrp = '上半';
  } else {
    WagerGrp = '';
  }
  if (typeid.indexOf(101 || 103) > -1) {
    Wagertype = '讓球';
    text = WagerGrp + Wagertype;
  } else if (typeid.indexOf(102 || 104 || 109) > -1) {
    Wagertype = '大小';
    text = WagerGrp + Wagertype;
  } else if (typeid.indexOf(111 || 110) > -1) {
    Wagertype = '獨贏';
    text = WagerGrp + Wagertype;
  } else if (typeid.indexOf(105 || 113) > -1) {
    Wagertype = '單雙';
    text = WagerGrp + Wagertype;
  } else if (typeid.indexOf(106)) {
    Wagertype = '一输';
    text = WagerGrp + Wagertype;
  } else if (typeid.indexOf(121)) {
    text = '局數讓球';
  } else if (typeid.indexOf(122)) {
    text = '局數大小';
  } else if (typeid.indexOf(128)) {
    text = '總分讓球';
  } else if (typeid.indexOf(129)) {
    text = '總分單雙';
  } else if (typeid.indexOf(126)) {
    text = '局數單雙';
  } else if (typeid.indexOf(127)) {
    text = '局數獨贏';
  } else if (typeid.indexOf(125)) {
    text = '總分大小';
  } else if (typeid.indexOf(123)) {
    text = '盤數獨贏';
  } else if (typeid.indexOf(124)) {
    text = '盤數讓球';
  }
  return text;
}

/**
 * @param {Number} catID 球種ID
 * @returns {Boolean} 是否需要主客場對調
 */
export function isHomeAwayReverse(catID) {
  const intCatID = parseInt(catID);
  return (
    intCatID === 4 || intCatID === 11 || intCatID === 12 || intCatID === 14 || intCatID === 101
  );
}

/**
 * 所有玩法數據的資料
 * WagerPos : 1主 2客 3和 4大 5小 1單 2雙
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
const PlayMethodData = {
  // 讓分
  HandiCap: {
    name: 'HandiCap',
    typeIdList: [101, 103],
    wagerPos: [1, 2],
    showMethod: ['topPlayMethod', 'bottomPlayMethod'],
    showOdd: ['topPlayOdd', 'bottomPlayOdd'],
    betCutLineDealFunc: function (oddData) {
      return oddData.HomeHdp !== '' ? oddData.HomeHdp : oddData.AwayHdp;
    },
  },
  // 大小
  BigSmall: {
    name: 'BigSmall',
    typeIdList: [102, 104, 109],
    wagerPos: [4, 5],
    showMethod: ['topPlayMethod', 'bottomPlayMethod'],
    showOdd: ['topPlayOdd', 'bottomPlayOdd'],
    betCutLineDealFunc: function (oddData) {
      return oddData.OULine;
    },
  },
  // 獨贏
  SoloWin: {
    name: 'SoloWin',
    typeIdList: [110, 111],
    wagerPos: [1, 2, 3],
    showMethod: [],
    showOdd: ['topPlayOdd', 'bottomPlayOdd', 'drewPlayOdd'],
    betCutLineDealFunc: function (oddData) {
      return 0;
    },
  },
  // 單雙
  OddEven: {
    name: 'OddEven',
    typeIdList: [105, 113, 126, 129],
    wagerPos: [1, 2],
    showMethod: ['topPlayMethod', 'bottomPlayMethod'],
    showOdd: ['topPlayOdd', 'bottomPlayOdd'],
    betCutLineDealFunc: function (oddData) {
      return 0;
    },
  },
};

// 將oddData轉成用來顯示的資料
export function oddDataToPlayData(catID = null, wagerTypeID = null, oddData = null) {
  let topPlayMethod = '';
  let topPlayOdd = '';
  let bottomPlayMethod = '';
  let bottomPlayOdd = '';
  let drewPlayOdd = '';
  let layoutType = 'normal';
  let playMethodData = null;
  if (oddData !== null) {
    if (PlayMethodData.HandiCap.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 讓分
      topPlayMethod = oddData.HomeHdp;
      topPlayOdd = oddData.HomeHdpOdds;
      bottomPlayMethod = oddData.AwayHdp;
      bottomPlayOdd = oddData.AwayHdpOdds;
      playMethodData = PlayMethodData.HandiCap;
    } else if (PlayMethodData.BigSmall.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 大小
      topPlayMethod = oddData.OULine;
      topPlayOdd = oddData.OverOdds;
      bottomPlayMethod = '小';
      bottomPlayOdd = oddData.UnderOdds;
      playMethodData = PlayMethodData.BigSmall;
    } else if (PlayMethodData.SoloWin.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 獨贏
      topPlayOdd = oddData.HomeOdds;
      bottomPlayOdd = oddData.AwayOdds;
      drewPlayOdd = oddData.DrewOdds;
      layoutType = 'single';
      playMethodData = PlayMethodData.SoloWin;
    } else if (PlayMethodData.OddEven.typeIdList.indexOf(wagerTypeID) !== -1) {
      // 單雙
      topPlayMethod = '單';
      topPlayOdd = oddData.OverOdds;
      bottomPlayMethod = '雙';
      bottomPlayOdd = oddData.UnderOdds;
      playMethodData = PlayMethodData.OddEven;
    }

    // 處理主客場對調
    //  ps.大小玩法不能對調
    if (
      isHomeAwayReverse(catID) &&
      PlayMethodData.BigSmall.typeIdList.indexOf(wagerTypeID) === -1
    ) {
      [topPlayMethod, bottomPlayMethod] = [bottomPlayMethod, topPlayMethod];
      [topPlayOdd, bottomPlayOdd] = [bottomPlayOdd, topPlayOdd];
    }
  }
  return {
    topPlayMethod,
    topPlayOdd,
    bottomPlayMethod,
    bottomPlayOdd,
    drewPlayOdd,
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
export function WagerDataToShowData(catID, wagerData, rowIndex) {
  if (!wagerData?.isNoData) {
    // 關閉狀態
    if (wagerData.Odds[rowIndex] === undefined || wagerData.Odds[rowIndex].Status !== 1) {
      return oddDataToPlayData(null, null);
    } else {
      return oddDataToPlayData(catID, wagerData.WagerTypeID, wagerData.Odds[rowIndex]);
    }
  } else {
    return oddDataToPlayData(null, null);
  }
}

// 將購物車的資料 轉成 購物車內顯示的資料
export function cartDataToDisplayData(cartData) {
  let showBetTitle = '';
  let showCutLine = '';
  let showOdd = '';
  const playData = cartData.playData;
  if (playData.playMethodData.name === 'HandiCap') {
    if (cartData.clickPlayIndex === 0) {
      showBetTitle = cartData.HomeTeamStr;
      if (playData.topPlayMethod === '') {
        showCutLine = '+' + playData.bottomPlayMethod;
      } else {
        showCutLine = '-' + playData.topPlayMethod;
      }
      showOdd = playData.topPlayOdd;
    } else if (cartData.clickPlayIndex === 1) {
      showBetTitle = cartData.AwayTeamStr;
      if (playData.topPlayMethod === '') {
        showCutLine = '-' + playData.bottomPlayMethod;
      } else {
        showCutLine = '+' + playData.topPlayMethod;
      }
      showOdd = playData.bottomPlayOdd;
    }
    if (playData.topPlayMethod === '0' || playData.bottomPlayMethod === '0') {
      showCutLine = '0';
    }
  } else if (playData.playMethodData.name === 'BigSmall') {
    if (cartData.clickPlayIndex === 0) {
      showBetTitle = '大';
      showCutLine = playData.topPlayMethod;
      showOdd = playData.topPlayOdd;
    } else if (cartData.clickPlayIndex === 1) {
      showBetTitle = '小';
      showCutLine = playData.topPlayMethod;
      showOdd = playData.bottomPlayOdd;
    }
  } else if (playData.playMethodData.name === 'SoloWin') {
    if (cartData.clickPlayIndex === 0) {
      showBetTitle = cartData.HomeTeamStr;
      showOdd = playData.topPlayOdd;
    } else if (cartData.clickPlayIndex === 1) {
      showBetTitle = cartData.AwayTeamStr;
      showOdd = playData.bottomPlayOdd;
    } else {
      showBetTitle = '和局';
      showOdd = playData.drewPlayOdd;
    }
    showCutLine = 'PK';
  } else if (playData.playMethodData.name === 'OddEven') {
    if (cartData.clickPlayIndex === 0) {
      showBetTitle = '單';
      showOdd = playData.topPlayOdd;
    } else if (cartData.clickPlayIndex === 1) {
      showBetTitle = '雙';
      showOdd = playData.bottomPlayOdd;
    }
  } else {
    console.error('playData.playMethodData.name error:', playData.playMethodData.name);
  }

  const catIDLabel = CatIDtoShowLabel(cartData.CatID);
  let wagerGrpLabel = '';

  if (cartData.WagerGrpID === '10') {
    wagerGrpLabel = '- [全場]';
  } else if (cartData.WagerGrpID === '11') {
    wagerGrpLabel = '- [上半]';
  }
  const showGameTypeLabel = `${catIDLabel}${cartData.GameTypeLabel}${wagerGrpLabel}`;

  return {
    showBetTitle,
    showCutLine,
    showOdd,
    showGameTypeLabel,
    wagerGrpLabel,
  };
}

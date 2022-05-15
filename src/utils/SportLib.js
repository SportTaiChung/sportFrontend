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
  return intCatID === 4 || intCatID === 11 || intCatID === 12 || intCatID === 101;
}

/**
 * WagerData 轉 成畫面需要組成的資料格式
 * @param {Number} catID     球種ID
 * @param {Object} wagerData team底下的wager
 * @param {Object} rowIndex  team底下的第幾個row
 * @returns {Object}
 *?  topPlayMethod    {String} 上方玩法
 *?  topPlayOdd       {String} 上方賠率
 *?  bottomPlayMethod {String} 下方玩法
 *?  bottomPlayOdd    {String} 下方賠率
 *?  layoutType       {Object} 版型分類
 *     > normal: 預設版型
 *     > single: 只顯示一個Odd
 */
export function WagerDataToShowData(catID, wagerData, rowIndex) {
  try {
    let topPlayMethod = '';
    let topPlayOdd = '';
    let bottomPlayMethod = '';
    let bottomPlayOdd = '';
    let layoutType = 'normal';
    const bigSmallTypeIDs = [102, 104, 109];
    if (!wagerData?.isNoData) {
      if (wagerData.Odds[rowIndex] === undefined || wagerData.Odds[rowIndex].Status !== 1) {
        // 關閉狀態
      } else if (wagerData.WagerTypeID === 101 || wagerData.WagerTypeID === 103) {
        // 讓分
        topPlayMethod = wagerData.Odds[rowIndex].HomeHdp;
        topPlayOdd = wagerData.Odds[rowIndex].HomeHdpOdds;
        bottomPlayMethod = wagerData.Odds[rowIndex].AwayHdp;
        bottomPlayOdd = wagerData.Odds[rowIndex].AwayHdpOdds;
      } else if (bigSmallTypeIDs.indexOf(wagerData.WagerTypeID) !== -1) {
        // 大小
        topPlayMethod = wagerData.Odds[rowIndex].OULine;
        topPlayOdd = wagerData.Odds[rowIndex].OverOdds;
        bottomPlayMethod = '小';
        bottomPlayOdd = wagerData.Odds[rowIndex].UnderOdds;
      } else if (wagerData.WagerTypeID === 110 || wagerData.WagerTypeID === 111) {
        // 獨贏
        topPlayOdd = wagerData.Odds[rowIndex].HomeOdds;
        bottomPlayOdd = wagerData.Odds[rowIndex].AwayOdds;
        layoutType = 'single';
      } else if (
        wagerData.WagerTypeID === 105 ||
        wagerData.WagerTypeID === 113 ||
        wagerData.WagerTypeID === 126 ||
        wagerData.WagerTypeID === 129
      ) {
        // 單雙
        topPlayMethod = '單';
        topPlayOdd = wagerData.Odds[rowIndex].OverOdds;
        bottomPlayMethod = '雙';
        bottomPlayOdd = wagerData.Odds[rowIndex].UnderOdds;
      }

      // 處理主客場對調
      //  ps.大小玩法不能對調
      if (isHomeAwayReverse(catID) && bigSmallTypeIDs.indexOf(wagerData.WagerTypeID) === -1) {
        [topPlayMethod, bottomPlayMethod] = [bottomPlayMethod, topPlayMethod];
        [topPlayOdd, bottomPlayOdd] = [bottomPlayOdd, topPlayOdd];
      }
    }

    return {
      topPlayMethod,
      topPlayOdd,
      bottomPlayMethod,
      bottomPlayOdd,
      layoutType,
    };
  } catch (error) {
    console.error('error:', error);
    debugger;
  }
}

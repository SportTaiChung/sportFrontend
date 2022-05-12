/**
 * CatID 轉文本
 * @param {Number} val
 * @returns String
 */
export function CatIDtoString(val) {
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

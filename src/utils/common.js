/**
 * Wager 轉 文本
 * @param {Empty} val
 * @param {Array} typeid WagerTypeID
 * @param {Number} grpid WagerGrpID
 * @returns
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

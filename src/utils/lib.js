/**
 * 強制保留2位小數，不足補 0
 */
export function toDecimal(x) {
  let f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

export function thousandSpr(x) {
  if (x === null || x === undefined) {
    return '';
  }

  const parts = x.toString().split('.');
  const replacement = ',';
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, replacement);

  return parts.join('.');
}

export function toTimestamp(time) {
  return new Date(time).getTime();
}

export function diffDateFloor(a, b) {
  return Math.floor((toTimestamp(a) - toTimestamp(b)) / 1000 / 86400);
}

export function diffDateCeil(a, b) {
  return Math.ceil((toTimestamp(a) - toTimestamp(b)) / 1000 / 86400);
}

// yyyy-MM-dd HH:mm:ss
export function timeFormat(time) {
  const date = new Date(time);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1).toString().padStart(2, '0') + '-';
  const D = date.getDate().toString().padStart(2, '0');
  const h = date.getHours() + ':';
  const m = date.getMinutes() + ':';
  const s = date.getSeconds();
  const TimeZoneOffset = date.getTimezoneOffset();
  let UTC = -(TimeZoneOffset / 60);
  let UTCFloat = '';
  if (TimeZoneOffset % 60 !== 0) {
    UTCFloat = `.${-(TimeZoneOffset % 60)}`;
  }
  if (UTC > 0) {
    UTC = ` (UTC+${parseInt(UTC)}${UTCFloat})`;
  } else {
    UTC = ` (UTC${parseInt(UTC)}${UTCFloat})`;
  }
  return (
    Y +
    M +
    D +
    ' ' +
    (h.toString().length === 2 ? '0' + h : h) +
    (m.toString().length === 2 ? '0' + m : m) +
    (s.toString().length === 1 ? '0' + s : s)
  );
}

// MMDD
export function timeFormatMMDD(time) {
  const date = new Date(time);
  const M = (date.getMonth() + 1).toString().padStart(2, '0') + '-';
  const D = date.getDate().toString().padStart(2, '0');

  return M + D;
}

// HH:mm
export function timeFormatHHmm(time) {
  const date = new Date(time);
  const h = date.getHours() + ':';
  const m = date.getMinutes();
  return (h.toString().length === 2 ? '0' + h : h) + (m.toString().length === 1 ? '0' + m : m);
}

// 處理浮點數運算
export function trunc(num, decimal = 2) {
  const base = 10 ** decimal;
  return Math.trunc((num * base).toFixed(decimal)) / base;
}

// 處理浮點數運算 並且floor去除小數點
export function truncFloor(num, decimal = 2) {
  return Math.floor(trunc(num, decimal));
}

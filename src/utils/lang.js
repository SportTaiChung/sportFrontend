// 預設語言
const localLang = (function () {
  let Lang = localStorage.getItem('Lang');
  if (Lang === null) {
    Lang = 'tw';
  }
  return Lang;
})();

export default localLang;

import request from '@/utils/axios';

// 防偽驗證
export function dataFresh(param) {
  return request({
    url: `/datafresh/token`,
    method: 'post',
    data: param,
  });
}

// 3. 取得系統時間
export function systemTime() {
  return request({
    url: `/datafresh/systime`,
    method: 'get',
  });
}

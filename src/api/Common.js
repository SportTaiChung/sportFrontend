import request from '@/utils/axios';

// 3. 取得系統時間
export function systemTime() {
  return request({
    url: `/datafresh/systime`,
    method: 'get',
  });
}

import request from '@/utils/axios';

// 防偽驗證
export function dataFresh(param) {
  return request({
    url: `/datafresh/token`,
    method: 'post',
    data: param,
  });
}

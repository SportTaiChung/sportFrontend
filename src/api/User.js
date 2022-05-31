import request from '@/utils/axios';

// 登入
export function login(param) {
  return request({
    url: `/mb/sin/login`,
    method: 'post',
    data: param,
    param: {},
  });
}

// 取得用戶資訊
export function getUserInfoAbout() {
  return request({
    url: `/mb/info/about`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
  });
}

// 取得用戶餘額
export function getUserInfoCash() {
  return request({
    url: `/mb/info/cash`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
  });
}

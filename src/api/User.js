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

// 登出
export function logout() {
  return request({
    url: `/mb/sin/logout`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
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

// 設置暱稱
export function setNickName(postData) {
  return request({
    url: `/mb/info/setNickname`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
    data: postData,
  });
}

import request from '@/utils/axios';
import store from '@/store';
// 獲取左側菜單
export function getMenuGameType(postData = {}) {
  return request({
    url: `/GameInfo/MenuGameType`,
    method: 'post',
    param: {
      AddRVfToken: true,
      AddMemberToken: true,
    },
    data: { Lang: store.state.Lang },
  });
}

// 獲取左侧菜单球种(含赛事数量)
export function getMenuGameCatList(postData = {}) {
  return request({
    url: `/GameInfo/Menu`,
    method: 'post',
    param: {
      AddRVfToken: true,
      AddMemberToken: true,
    },
    data: { Lang: store.state.Lang, ...postData },
  });
}

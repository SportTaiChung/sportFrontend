import request from '@/utils/axios';
import store from '@/store';
// 16. 獲取左側菜單
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

// 17. 獲取左侧菜单球种(含赛事数量)
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

// 18. (赔率)游戏玩法资讯
export function getGameDetail(postData = {}) {
  return request({
    url: `/GameInfo/GameDetail`,
    method: 'post',
    param: {
      AddRVfToken: true,
      AddMemberToken: true,
    },
    data: { Lang: store.state.Lang, ...postData },
  });
}

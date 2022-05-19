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
    data: { lang: store.state.Lang },
  });
}

// 17. 獲取左侧菜单球种(含赛事数量)
export function getMenuGameCatList() {
  return request({
    url: `/GameInfo/Menu`,
    method: 'post',
    param: {
      AddRVfToken: true,
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang },
  });
}

// 18-a. (赔率)游戏玩法资讯
export function getGameDetail(postData = {}) {
  return request({
    url: `/GameInfo/GameDetail`,
    method: 'post',
    param: {
      AddRVfToken: true,
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang, ...postData },
  });
}

// 19-a. 主要盤口:(赔率)获取30秒内变动数据
export function getGameDetailSmall(postData = {}) {
  return request({
    url: `/GameInfo/GamelistSmall`,
    method: 'post',
    param: {
      AddRVfToken: true,
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang, ...postData },
  });
}

// 20. 投注接口
export function playBet(postData = []) {
  return request({
    url: `/GameInfo/Play`,
    method: 'post',
    param: {
      AddRVfToken: true,
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang, list: postData },
  });
}

// 21. 投注-追踪注单处理状态
export function playState(traceCodeKey) {
  return request({
    url: `/GameInfo/playState`,
    method: 'post',
    param: {
      AddRVfToken: true,
      AddMemberToken: true,
    },
    data: { traceCodeKey },
  });
}

// 22. 获取投注盘口详情
export function getBetInfo(postData = {}) {
  return request({
    url: `/GameInfo/BetInfo`,
    method: 'post',
    param: {
      AddRVfToken: true,
      AddMemberToken: true,
    },
    data: postData,
  });
}

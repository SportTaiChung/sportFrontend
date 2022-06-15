import request from '@/utils/axios';
import store from '@/store';

// API共用-球類CatID唯一識別
export function getCatList() {
  return request({
    url: `/GameInfo/GameOnlyCatID/${store.state.Lang}`,
    method: 'get',
  });
}

// API(15,18)共用-聯賽Items
export function getGameResultLeagues(postData = {}) {
  return request({
    url: `/GameInfo/GameResultLeagues`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang, ...postData },
  });
}

// 16. 獲取左側菜單
export function getMenuGameType(postData = {}) {
  return request({
    url: `/GameInfo/MenuGameType`,
    method: 'post',
    param: {
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
      AddMemberToken: true,
    },
    data: postData,
  });
}

// 24. 获取即时注单紀錄
export function getBetHistory(postData = {}) {
  return request({
    url: `/GameInfo/Ticket/betHistory`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang, ...postData },
  });
}

// 26.取得直播線路
export function getLive() {
  return request({
    url: `/GameInfo/Live`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang },
  });
}

// 12.获取在线咨询信息
export function getQAHistory() {
  return request({
    url: `/GameInfo/QAMes/LiveList`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
  });
}

// 13.传送咨询-信息
export function sendQAMessage(postData) {
  return request({
    url: `/GameInfo/QAMes/send`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
    data: postData,
  });
}

// 14.传送咨询-檔案信息
export function sendQAFile(postData) {
  return request({
    url: `/GameInfo/QAMes/sendFile`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
    data: postData,
  });
}

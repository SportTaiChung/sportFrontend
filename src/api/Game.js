import request from '@/utils/axios';
import store from '@/store';

// API共用-球類CatID唯一識別
export function getCatList() {
  return request({
    url: `/GameInfo/GameOnlyCatID/${store.state.Lang}`,
    method: 'get',
  });
}

// 11. 游戏公告讯息
export function getAnnouncement(postData) {
  return request({
    url: `/GameInfo/Ann`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang, ...postData },
  });
}

// 12-1.获取在线咨询信息
export function getQAHistory(isGuestMode = false) {
  return request({
    url: `/GameInfo/QAMes/LiveList`,
    method: 'post',
    param: {
      AddMemberToken: !isGuestMode,
    },
  });
}

// 12-2 未讀訊息數
export function getCountMes(isGuestMode = false) {
  return request({
    url: `/GameInfo/QAMes/CountMes`,
    method: 'post',
    param: {
      AddMemberToken: !isGuestMode,
    },
  });
}

// 12-3 標示已讀
export function sendReadMes(isGuestMode = false) {
  return request({
    url: `/GameInfo/QAMes/ReadMes`,
    method: 'post',
    param: {
      AddMemberToken: !isGuestMode,
    },
  });
}

// 13.传送咨询-信息
export function sendQAMessage(postData, isGuestMode = false) {
  return request({
    url: `/GameInfo/QAMes/send`,
    method: 'post',
    param: {
      AddMemberToken: !isGuestMode,
    },
    data: postData,
  });
}

// 14.传送咨询-檔案信息
export function sendQAFile(postData, isGuestMode = false) {
  return request({
    url: `/GameInfo/QAMes/sendFile`,
    method: 'post',
    param: {
      AddMemberToken: !isGuestMode,
    },
    data: postData,
  });
}

// 15.賽事結果
export function getGameResult(postData = {}) {
  return request({
    url: `/GameInfo/GameResult`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang, ...postData },
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

// 23.获取历史投注日统计数据
export function getBetDayHistory(postData = {}) {
  return request({
    url: `/GameInfo/Ticket/betDayHistory`,
    method: 'post',
    param: {
      AddMemberToken: true,
    },
    data: { lang: store.state.Lang, ...postData },
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

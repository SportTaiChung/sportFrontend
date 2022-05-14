import { WagerTypeIDandWagerGrpIDtoString } from '@/utils/common';
export function showTableHeaderList(state) {
  return state.GameList.BestHead.map((it) => {
    return {
      originName: it.Name,
      showName: WagerTypeIDandWagerGrpIDtoString(it.WagerTypeID, it.WagerGrpID),
      WagerGrpID: it.WagerGrpID,
      WagerTypeID: it.WagerTypeID,
    };
  });
}

export function gameListFinalData(state) {
  if (state.GameList.length === 0) {
    return [];
  } else {
    const BestHeadData = state.GameList.BestHead;
    return state.GameList.List.map((it, index) => {
      return { uid: index, ...it };
    }).map((listData) => {
      const newListData = JSON.parse(JSON.stringify(listData));
      newListData.Team = listData.Team.map((TeamData) => {
        const newTeamData = JSON.parse(JSON.stringify(TeamData));
        const DrewOdds = [];
        newTeamData.Wager.forEach((item_Team_Wager) => {
          DrewOdds.push(item_Team_Wager.Odds[0].DrewOdds);
        });
        // 如果 DrewOdds每個都是字串0 代表不會有和 玩法
        if (DrewOdds.every((key) => key === '0' || key === '0.00')) {
          newTeamData.hasDrewOdds = false;
        } else {
          newTeamData.hasDrewOdds = true;
        }

        // 補上空欄位
        const oldWagerDatas = JSON.parse(JSON.stringify(newTeamData.Wager));
        const newWagerData = new Array(BestHeadData.length).fill({
          isNoData: true,
        });
        BestHeadData.forEach((headData, headIndex) => {
          oldWagerDatas.every((oldWagerData, oldWagerDataIndex) => {
            if (headData.WagerTypeID.indexOf(oldWagerData.WagerTypeID) !== -1) {
              newWagerData[headIndex] = oldWagerData;
              oldWagerDatas.splice(oldWagerDataIndex, 1);
              return false;
            }
          });
        });
        newTeamData.Wager = newWagerData;

        // 可能會對其他數據做操作
        // newTeamData.Wager = newTeamData.Wager.map((wagerData) => {
        //   const newWagerData = JSON.parse(JSON.stringify(wagerData));
        //   newWagerData.Odds = newWagerData.Odds.map((oddData) => {
        //     const newOddData = JSON.parse(JSON.stringify(oddData));
        //     if (newOddData?.DrewOdds) {
        //       newOddData.hasDrewOdds = true;
        //     } else {
        //       newOddData.hasDrewOdds = false;
        //     }
        //     return newOddData;
        //   });
        //   return newWagerData;
        // });
        return newTeamData;
      });
      return newListData;
    });
    // TODO 測試CODE 過濾指定賽事
    // .filter((it) => {
    //   if (it.LeagueID === 7893) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // })
  }
}

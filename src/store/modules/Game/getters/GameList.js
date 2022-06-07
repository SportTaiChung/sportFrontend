import { WagerTypeIDandWagerGrpIDtoString } from '@/utils/SportLib';
export function showTableHeaderList(state) {
  if (state.GameList.length === 0) {
    return [];
  }
  return state.GameList.BestHead.map((it) => {
    return {
      originName: it.Name,
      showName: WagerTypeIDandWagerGrpIDtoString(it.WagerTypeIDs, it.WagerGrpIDs[0]),
      WagerGrpIDs: it.WagerGrpIDs,
      WagerTypeIDs: it.WagerTypeIDs,
    };
  });
}

export function gameListFinalData(state) {
  if (state.GameList.length === 0) {
    return [];
  } else {
    return state.GameList.map((gameData) => {
      // const newGameItemData = gameData.Items.map((itemData) => {
      const newBestHead = gameData.Items.BestHead.map((it) => {
        return {
          originName: it.Name,
          showName: WagerTypeIDandWagerGrpIDtoString(it.WagerTypeIDs, it.WagerGrpIDs[0]),
          WagerGrpIDs: it.WagerGrpIDs,
          WagerTypeIDs: it.WagerTypeIDs,
        };
      });
      const newList = gameData.Items.List.filter((it) => {
        // 檢查 League 底下的 teamData.EvtStatus 是否為1
        const enableTeamList = it.Team.filter((teamData) => teamData.EvtStatus === 1);
        const isLeagueEnable = enableTeamList.length !== 0;
        return isLeagueEnable;
      })
        .map((it, index) => {
          return { id: index, ...it };
        })
        .map((listData) => {
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
            const newWagerData = new Array(newBestHead.length).fill({
              isNoData: true,
            });
            newBestHead.forEach((headData, headIndex) => {
              oldWagerDatas.every((oldWagerData, oldWagerDataIndex) => {
                if (headData.WagerTypeIDs.indexOf(oldWagerData.WagerTypeID) !== -1) {
                  newWagerData[headIndex] = oldWagerData;
                  oldWagerDatas.splice(oldWagerDataIndex, 1);
                  return false;
                }
              });
            });
            newTeamData.Wager = newWagerData;

            return newTeamData;
          });
          return newListData;
        });

      // });
      return {
        CatName: gameData.CatName,
        Items: {
          BestHead: newBestHead,
          List: newList,
        },
      };
    });

    // gameData.List.filter((it) => {
    //   // 檢查 League 底下的 teamData.EvtStatus 是否為1
    //   const enableTeamList = it.Team.filter((teamData) => teamData.EvtStatus === 1);
    //   const isLeagueEnable = enableTeamList.length !== 0;
    //   return isLeagueEnable;
    // })
    //   .map((it, index) => {
    //     return { id: index, ...it };
    //   })
    //   .map((listData) => {
    //     const newListData = JSON.parse(JSON.stringify(listData));
    //     newListData.Team = listData.Team.map((TeamData) => {
    //       const newTeamData = JSON.parse(JSON.stringify(TeamData));
    //       const DrewOdds = [];
    //       newTeamData.Wager.forEach((item_Team_Wager) => {
    //         DrewOdds.push(item_Team_Wager.Odds[0].DrewOdds);
    //       });
    //       // 如果 DrewOdds每個都是字串0 代表不會有和 玩法
    //       if (DrewOdds.every((key) => key === '0' || key === '0.00')) {
    //         newTeamData.hasDrewOdds = false;
    //       } else {
    //         newTeamData.hasDrewOdds = true;
    //       }

    //       // 補上空欄位
    //       const oldWagerDatas = JSON.parse(JSON.stringify(newTeamData.Wager));
    //       const newWagerData = new Array(BestHeadData.length).fill({
    //         isNoData: true,
    //       });
    //       BestHeadData.forEach((headData, headIndex) => {
    //         oldWagerDatas.every((oldWagerData, oldWagerDataIndex) => {
    //           if (headData.WagerTypeIDs.indexOf(oldWagerData.WagerTypeID) !== -1) {
    //             newWagerData[headIndex] = oldWagerData;
    //             oldWagerDatas.splice(oldWagerDataIndex, 1);
    //             return false;
    //           }
    //         });
    //       });
    //       newTeamData.Wager = newWagerData;

    //       return newTeamData;
    //     });
    //     return newListData;
    //   });
    // return {
    //   ...gameData,
    //   Items:
    // }
    // })
    // const BestHeadData = state.GameList.BestHead;
    // return
    //* TEST 測試CODE 過濾指定賽事
    // .filter((it) => {
    //   if (it.LeagueID === 7893) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // })
  }
}

import { WagerTypeIDandWagerGrpIDtoString } from '@/utils/common';
export function showTableHeaderList(state) {
  return state.GameList.BestHead.map((it) => {
    return {
      originName: it.name,
      showName: WagerTypeIDandWagerGrpIDtoString(it.WagerTypeID, it.WagerGrpID),
      WagerGrpID: it.WagerGrpID,
      WagerTypeID: it.WagerTypeID,
    };
  });
}

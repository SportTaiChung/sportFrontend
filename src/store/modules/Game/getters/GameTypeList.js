export function showGameTypeList(state) {
  return state.GameTypeList.filter((it, index) => index <= 2);
}

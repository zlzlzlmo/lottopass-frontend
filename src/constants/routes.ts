export const ROUTES = {
  HOME: { path: "/", label: "HOME" },
  NUMBER_GENERATION: { path: "/number-generation", label: "행운의 번호 생성" },
  STORE_INFO: { path: "/store-info", label: "당첨 매장 찾기" },
  HISTORY: { path: "/history", label: "역대 당첨 회차 확인" },
  HISTORY_DETAIL: { path: "/history/:drawNumber", label: "" },
  ALL_STORES: { path: "/all-stores", label: "로또 판매점 찾기" },
  RESULT: { path: "/result", label: "" },
  STATISTIC: { path: "/statistic", label: "로또 DATA" },
  // LOGIN: { path: "/login", label: "" },
  SIGNUP: { path: "/signup", label: "회원가입" },
  CALLBACK: { path: "/auth/:provider/callback", label: "" },
  // SAVED_COMBINATIONS: { path: "/saved-combinations", label: "내 번호" },
};

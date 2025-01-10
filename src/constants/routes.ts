export const ROUTES = {
  HOME: { path: "/", label: "HOME" },
  HISTORY: { path: "/history", label: "역대 당첨 회차 확인" },
  NUMBER_GENERATION: { path: "/number-generation", label: "행운의 번호 생성" },
  S_NUMBER_GENERATION: {
    path: "/s-number-generation",
    label: "당첨 시뮬레이션",
  },
  STORE_INFO: { path: "/store-info", label: "당첨 매장 찾기" },
  ALL_STORES: { path: "/all-stores", label: "로또 판매점 찾기" },
  STATISTIC: { path: "/statistic", label: "로또 DATA" },
  SIMULATION_RESULT: { path: "/s-result", label: "" },
  RESULT: { path: "/result", label: "" },
  HISTORY_DETAIL: { path: "/history/:drawNumber", label: "" },
  CALLBACK: { path: "/auth/:provider/callback", label: "" },
  // LOGIN: { path: "/login", label: "" },
  // SIGNUP: { path: "/signup", label: "회원가입" },
  // SAVED_COMBINATIONS: { path: "/saved-combinations", label: "내 번호" },
};

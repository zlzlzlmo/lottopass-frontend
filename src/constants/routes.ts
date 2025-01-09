export const ROUTES = {
  HOME: { path: "/", label: "HOME" },
  NUMBER_GENERATION: { path: "/number-generation", label: "번호 생성" },
  STORE_INFO: { path: "/store-info", label: "당첨점 확인" },
  HISTORY: { path: "/history", label: "당첨회차 확인" },
  HISTORY_DETAIL: { path: "/history/:drawNumber", label: "" },
  ALL_STORES: { path: "/all-stores", label: "판매점 찾기" },
  RESULT: { path: "/result", label: "" },
  STATISTIC: { path: "/statistic", label: "번호 통계" },
  LOGIN: { path: "/login", label: "" },
  SIGN_UP: { path: "/signup", label: "회원가입" },
  CALLBACK: { path: "/auth/:provider/callback", label: "" },
  SAVED_COMBINATIONS: { path: "/saved-combinations", label: "내 번호" },
};

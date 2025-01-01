import { LottoDraw } from "lottopass-shared";

// 액션 타입 정의
export const FETCH_INIT = "FETCH_INIT" as const;
export const FETCH_SUCCESS_LATEST = "FETCH_SUCCESS_LATEST" as const;
export const FETCH_SUCCESS_ALL = "FETCH_SUCCESS_ALL" as const;
export const FETCH_FAILURE = "FETCH_FAILURE" as const;

// 액션 생성자
export const fetchInit = () => ({
  type: FETCH_INIT,
});

export const fetchSuccessLatest = (payload: LottoDraw) => ({
  type: FETCH_SUCCESS_LATEST,
  payload,
});

export const fetchSuccessAll = (payload: LottoDraw[]) => ({
  type: FETCH_SUCCESS_ALL,
  payload,
});

export const fetchFailure = (payload: string) => ({
  type: FETCH_FAILURE,
  payload,
});

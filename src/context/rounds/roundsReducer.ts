import {
  FETCH_INIT,
  FETCH_SUCCESS_LATEST,
  FETCH_SUCCESS_ALL,
  FETCH_FAILURE,
} from "./roundsActions";
import { LottoDraw } from "lottopass-shared";

// 상태 타입 정의
export type State = {
  latestRound: LottoDraw | null;
  allRounds: LottoDraw[];
  isLoading: boolean;
  error: string | null;
};

// 액션 타입 정의
type Action =
  | { type: typeof FETCH_INIT }
  | { type: typeof FETCH_SUCCESS_LATEST; payload: LottoDraw }
  | { type: typeof FETCH_SUCCESS_ALL; payload: LottoDraw[] }
  | { type: typeof FETCH_FAILURE; payload: string };

// 초기 상태 정의
export const initialState: State = {
  latestRound: null,
  allRounds: [],
  isLoading: true,
  error: null,
};

// 리듀서
export const roundsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case FETCH_INIT:
      return { ...state, isLoading: true, error: null };
    case FETCH_SUCCESS_LATEST:
      return { ...state, latestRound: action.payload, isLoading: false };
    case FETCH_SUCCESS_ALL:
      return { ...state, allRounds: action.payload, isLoading: false };
    case FETCH_FAILURE:
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error(`Unhandled action type`);
  }
};

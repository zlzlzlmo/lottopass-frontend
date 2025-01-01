import { clearFromLocalStorage } from "../../utils/storage";
import {
  RESET_NUMBER,
  SET_EXCLUDE_NUMBERS,
  SET_MIN_COUNT,
} from "./lottoNumberActions";

export type State = {
  excludeNumber: number[];
  minCount: number;
};

export type Action =
  | { type: typeof SET_EXCLUDE_NUMBERS; payload: number[] }
  | { type: typeof SET_MIN_COUNT; payload: number }
  | { type: typeof RESET_NUMBER };

export const initialState: State = {
  excludeNumber: [],
  minCount: 6,
};

// 리듀서
export const lottoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_EXCLUDE_NUMBERS:
      return { ...state, excludeNumber: action.payload };
    case SET_MIN_COUNT:
      return { ...state, minCount: action.payload };
    case RESET_NUMBER:
      clearFromLocalStorage();
      return { ...state, excludeNumber: [], minCount: 6 };
    default:
      throw new Error("Unhandled action type");
  }
};

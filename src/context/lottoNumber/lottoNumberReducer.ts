import {
  Action,
  RESET_NUMBER,
  SET_MIN_COUNT,
  SET_REQUIRED_NUMBERS,
} from "./lottoNumberActions";

export type State = {
  requiredNumbers: number[];
  minCount: number;
};

export const initialState: State = {
  requiredNumbers: [],
  minCount: 6,
};

// 리듀서
export const lottoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_REQUIRED_NUMBERS:
      return { ...state, requiredNumbers: action.payload };
    case SET_MIN_COUNT:
      return { ...state, minCount: action.payload };
    case RESET_NUMBER:
      return initialState;
    default:
      throw new Error("Unhandled action type");
  }
};

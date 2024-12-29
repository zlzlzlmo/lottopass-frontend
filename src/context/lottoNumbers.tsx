import { useReducer, useMemo, useContext, createContext } from "react";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearFromLocalStorage,
} from "../utils/storage";
import { getRandomNum, shuffle } from "../utils/number";

interface State {
  excludedNumbers: number[];
  minCount: number;
}

type Action =
  | { type: "SET_EXCLUDED_NUMBERS"; payload: number[] }
  | { type: "SET_MIN_COUNT"; payload: number }
  | { type: "RESET" };

const initialState: State = {
  excludedNumbers: [],
  minCount: 6,
};

const reducer = (state: State, action: Action): State => {
  const newState = (() => {
    switch (action.type) {
      case "SET_EXCLUDED_NUMBERS":
        return {
          ...state,
          excludedNumbers: action.payload,
        };
      case "SET_MIN_COUNT":
        return {
          ...state,
          minCount: action.payload,
        };
      case "RESET":
        clearFromLocalStorage();
        return initialState;
      default:
        throw new Error("Unhandled action type");
    }
  })();

  saveToLocalStorage("lottoState", newState); // 상태 저장
  return newState;
};

const LottoNumberContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  generateNumbers: () => number[];
} | null>(null);

export const LottoNumberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    loadFromLocalStorage<State>("lottoState", initialState) // 상태 복원
  );

  const generateNumbers = () => {
    const allNumbers = shuffle(Array.from({ length: 45 }, (_, i) => i + 1));

    const randomIdx = getRandomNum(state.minCount, 6);

    const availableNumbers = shuffle(
      allNumbers.filter((num) => !state.excludedNumbers.includes(num))
    ).slice(0, randomIdx);

    const unique = new Set([...availableNumbers, ...allNumbers]);

    const results = [...unique].slice(0, 6).sort((a, b) => a - b);

    return results;
  };

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      generateNumbers,
    }),
    [state]
  );

  return (
    <LottoNumberContext.Provider value={contextValue}>
      {children}
    </LottoNumberContext.Provider>
  );
};

export const useLottoNumber = () => {
  const context = useContext(LottoNumberContext);
  if (!context) {
    throw new Error("useLottoNumber must be used within a LottoNumberProvider");
  }
  return context;
};

import { useReducer, useMemo, useContext, createContext } from "react";
import { saveToLocalStorage, loadFromLocalStorage } from "../utils/storage";
import { shuffle } from "../utils/number";

interface State {
  excludedNumbers: number[];
  roundCount: number;
  minimumRequiredCount: number;
}

type Action =
  | { type: "SET_EXCLUDED_NUMBERS"; payload: number[] }
  | { type: "SET_REQUIRED_NUMBERS"; payload: number[] }
  | { type: "SET_ROUND_COUNT"; payload: number }
  | { type: "SET_MINIMUM_REQUIRED_COUNT"; payload: number }
  | { type: "RESET" };

const initialState: State = {
  excludedNumbers: [],
  roundCount: Infinity,
  minimumRequiredCount: 6,
};

const reducer = (state: State, action: Action): State => {
  const newState = (() => {
    switch (action.type) {
      case "SET_EXCLUDED_NUMBERS":
        return {
          ...state,
          excludedNumbers: action.payload,
          requiredNumbers: [],
        };
      case "SET_REQUIRED_NUMBERS":
        return {
          ...state,
          requiredNumbers: action.payload,
          excludedNumbers: [],
        };
      case "SET_ROUND_COUNT":
        return { ...state, roundCount: action.payload };
      case "SET_MINIMUM_REQUIRED_COUNT":
        return { ...state, minimumRequiredCount: action.payload };
      case "RESET":
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
    // 필수번호 선택하면 필수 번호 제외한것이 제외번호지.
    const allNumbers = shuffle(Array.from({ length: 45 }, (_, i) => i + 1));
    // const randomCount = getRandomNum(0, 6);

    const availableNumbers = shuffle(
      allNumbers.filter((num) => !state.excludedNumbers.includes(num))
    );

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

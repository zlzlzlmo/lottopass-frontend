import { useReducer, useMemo, useContext, createContext } from "react";
import { getRandomNum, shuffle } from "../utils/number";
interface State {
  excludedNumbers: number[];
  requiredNumbers: number[];
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
  requiredNumbers: [],
  roundCount: 5,
  minimumRequiredCount: 3,
};

// Reducer Function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_EXCLUDED_NUMBERS":
      return { ...state, excludedNumbers: action.payload, requiredNumbers: [] };
    case "SET_REQUIRED_NUMBERS":
      return { ...state, requiredNumbers: action.payload, excludedNumbers: [] };
    case "SET_ROUND_COUNT":
      return { ...state, roundCount: action.payload };
    case "SET_MINIMUM_REQUIRED_COUNT":
      return { ...state, minimumRequiredCount: action.payload };
    case "RESET":
      return initialState;
    default:
      throw new Error("Unhandled action type");
  }
};
const LottoNumberContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  generateNumbers: () => number[];
} | null>(null);

// Provider Component
export const LottoNumberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generateNumbers = () => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const randomCount = getRandomNum(state.minimumRequiredCount, 6);

    const shuffledRequiredNumbers = shuffle(state.requiredNumbers);
    const uniqueRequiredNumbers = [...new Set(shuffledRequiredNumbers)].slice(
      0,
      randomCount
    );

    const availableNumbers = allNumbers.filter(
      (num) => !state.excludedNumbers.includes(num)
    );

    const randomNumbers: number[] = [];

    while (randomNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const number = availableNumbers[randomIndex];

      if (
        !uniqueRequiredNumbers.includes(number) &&
        !randomNumbers.includes(number)
      ) {
        randomNumbers.push(number);
      }
    }

    const results = [...uniqueRequiredNumbers, ...randomNumbers]
      .slice(0, 6)
      .sort((a, b) => a - b);

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

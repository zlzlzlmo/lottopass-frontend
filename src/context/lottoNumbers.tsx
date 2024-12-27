import React, { createContext, useReducer, useContext, useMemo } from "react";
import { getRandomNum, shuffle } from "../utils/number";

// State and Action Types
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

// Initial State
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
      return {
        ...state,
        roundCount: action.payload,
      };
    case "SET_MINIMUM_REQUIRED_COUNT":
      return {
        ...state,
        minimumRequiredCount: action.payload,
      };
    case "RESET":
      return initialState;
    default:
      throw new Error("Unhandled action type");
  }
};

// Context Creation
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
  const { minimumRequiredCount, excludedNumbers, requiredNumbers } = state;

  const generateNumbers = () => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

    const randomCount = getRandomNum(minimumRequiredCount, 6);

    const shuffledRequiredNumbers = shuffle(requiredNumbers);
    const uniquerRequiredNumbers = [...new Set(shuffledRequiredNumbers)].slice(
      0,
      randomCount
    );

    const availableNumbers = allNumbers.filter((num) => {
      return !excludedNumbers.includes(num);
    });

    const randomNumbers: number[] = [];

    while (randomNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const number = [...availableNumbers][randomIndex];

      if (
        !uniquerRequiredNumbers.includes(number) &&
        !randomNumbers.includes(number)
      )
        randomNumbers.push(number);
    }

    const results = randomNumbers.map((num, i) => {
      if (uniquerRequiredNumbers[i]) return uniquerRequiredNumbers[i];
      return num;
    });

    return results.sort((a, b) => a - b); // 정렬
  };

  const value = useMemo(
    () => ({
      state,
      dispatch,
      generateNumbers,
    }),
    [state]
  );

  return (
    <LottoNumberContext.Provider value={value}>
      {children}
    </LottoNumberContext.Provider>
  );
};

// Custom Hook
export const useLottoNumber = () => {
  const context = useContext(LottoNumberContext);
  if (!context) {
    throw new Error("LottoNumberProvider로 감싸져 있지 않습니다.");
  }
  return context;
};

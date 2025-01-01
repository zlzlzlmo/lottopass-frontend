import React, { createContext, useContext, useReducer } from "react";

import {
  Action,
  initialState,
  lottoReducer,
  State,
} from "./lottoNumberReducer";
import { getRandomNum, shuffle } from "../../utils/number";
import { loadFromLocalStorage } from "../../utils/storage";

type LottoContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  generateNumbers: () => number[];
};

const LottoContext = createContext<LottoContextType | undefined>(undefined);

export const LottoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    lottoReducer,
    loadFromLocalStorage<State>("lottoState", initialState)
  );

  const generateNumbers = () => {
    const allNumbers = shuffle(Array.from({ length: 45 }, (_, i) => i + 1));

    const randomIdx = getRandomNum(state.minCount, 6);

    const availableNumbers = shuffle(
      allNumbers.filter((num) => !state.excludeNumber.includes(num))
    ).slice(0, randomIdx);

    const unique = new Set([...availableNumbers, ...allNumbers]);

    const results = [...unique].slice(0, 6).sort((a, b) => a - b);

    return results;
  };

  return (
    <LottoContext.Provider value={{ state, dispatch, generateNumbers }}>
      {children}
    </LottoContext.Provider>
  );
};

export const useLotto = () => {
  const context = useContext(LottoContext);
  if (!context) {
    throw new Error("useLotto must be used within a LottoProvider");
  }
  return context;
};

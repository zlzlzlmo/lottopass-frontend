import React, { createContext, useContext, useReducer } from "react";

import { initialState, lottoReducer, State } from "./lottoNumberReducer";
import { getRandomNum, shuffle } from "../../utils/number";
import { loadFromLocalStorage } from "../../utils/storage";
import { Action } from "./lottoNumberActions";

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

  const generateNumbers = (): number[] => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const randomIdx = getRandomNum(state.minCount, 6);
    const availableNumbers = shuffle(state.requiredNumbers).slice(0, randomIdx);

    return Array.from(new Set([...availableNumbers, ...shuffle(allNumbers)]))
      .slice(0, 6)
      .sort((a, b) => a - b);
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

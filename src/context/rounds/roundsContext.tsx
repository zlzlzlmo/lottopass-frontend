import React, { createContext, useContext, useEffect, useReducer } from "react";
import { fetchSuccessAll, fetchFailure } from "./roundsActions";
import { initialState, roundsReducer, State } from "./roundsReducer";
import { getAllRounds } from "../../api/axios/lottoApi";
import { LottoDraw } from "lottopass-shared";
import { drawService } from "@/api";

type RoundsContextType = {
  state: State;
  getRound: (drawNumber: string | number) => LottoDraw | undefined;
};

const RoundsContext = createContext<RoundsContextType | undefined>(undefined);

export const RoundsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(roundsReducer, initialState);

  useEffect(() => {
    const fetchAllRounds = async () => {
      try {
        const allRoundsResult = await getAllRounds();

        if (allRoundsResult.status === "success") {
          dispatch(
            fetchSuccessAll(
              allRoundsResult.data.sort((a, b) => b.drawNumber - a.drawNumber)
            )
          );
        } else {
          throw new Error(
            allRoundsResult.message || "Failed to fetch all rounds"
          );
        }
      } catch (err) {
        dispatch(
          fetchFailure((err as Error).message || "Failed to load all rounds")
        );
      }
    };

    fetchAllRounds();
  }, []);

  const getRound = (drawNumber: string | number) => {
    if (isNaN(Number(drawNumber))) return;
    return state.allRounds.find(
      (round) => round.drawNumber === Number(drawNumber)
    );
  };

  return (
    <RoundsContext.Provider value={{ state, getRound }}>
      {children}
    </RoundsContext.Provider>
  );
};

export const useRounds = (): RoundsContextType => {
  const context = useContext(RoundsContext);
  if (!context) {
    throw new Error("useRounds must be used within a RoundsProvider");
  }
  return context;
};

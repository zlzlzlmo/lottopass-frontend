import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  fetchInit,
  fetchSuccessLatest,
  fetchSuccessAll,
  fetchFailure,
} from "./roundsActions";
import { initialState, roundsReducer, State } from "./roundsReducer";
import { getAllRounds, getLatestRound } from "../../api/axios/lottoApi";

type RoundsContextType = State;

const RoundsContext = createContext<RoundsContextType | undefined>(undefined);

export const RoundsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(roundsReducer, initialState);

  useEffect(() => {
    const fetchLatestRound = async () => {
      dispatch(fetchInit());

      try {
        const latestRoundResult = await getLatestRound();

        if (latestRoundResult.status === "success") {
          dispatch(fetchSuccessLatest(latestRoundResult.data));
        } else {
          throw new Error(
            latestRoundResult.message || "Failed to fetch the latest round"
          );
        }
      } catch (err) {
        dispatch(
          fetchFailure((err as Error).message || "Failed to load latest round")
        );
      }
    };

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

    fetchLatestRound().then(() => {
      fetchAllRounds();
    });
  }, []);

  return (
    <RoundsContext.Provider value={state}>{children}</RoundsContext.Provider>
  );
};

export const useRounds = (): RoundsContextType => {
  const context = useContext(RoundsContext);
  if (!context) {
    throw new Error("useRounds must be used within a RoundsProvider");
  }
  return context;
};

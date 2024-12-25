import React, { createContext, useContext, useEffect, useState } from "react";
import { getAllRounds } from "../api/axios/lottoApi";
import { LottoDraw } from "lottopass-shared";

type RoundsContextType = {
  rounds: LottoDraw[];
  latestRound: LottoDraw | null;
  isLoading: boolean;
  error: string | null;
};

const RoundsContext = createContext<RoundsContextType | null>(null);

export const RoundsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [rounds, setRounds] = useState<LottoDraw[]>([]);
  const [latestRound, setLatestRound] = useState<LottoDraw | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const result = await getAllRounds();
        if (result.status === "success") {
          setRounds(result.data);
          setLatestRound(result.data[result.data.length - 1]);
          console.log(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error("Failed to fetch rounds", error);
        setError("Failed to load rounds data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRounds();
  }, []);

  return (
    <RoundsContext.Provider value={{ rounds, latestRound, isLoading, error }}>
      {children}
    </RoundsContext.Provider>
  );
};

export const useRounds = () => {
  const context = useContext(RoundsContext);
  if (!context) {
    throw new Error("useRounds must be used within a RoundsProvider");
  }
  return context;
};

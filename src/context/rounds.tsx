import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { getAllRounds } from "../api/axios/lottoApi";
import { LottoDraw } from "lottopass-shared";

type RoundsContextType = {
  rounds: LottoDraw[];
  latestRound: LottoDraw | null;
  isLoading: boolean;
  error: string | null;
  getRecentRounds: (range: number) => LottoDraw[];
};

const RoundsContext = createContext<RoundsContextType | null>(null);

// Rounds Provider
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
        } else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (err) {
        setError((err as Error).message || "Failed to load rounds data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRounds();
  }, []);

  const getRecentRounds = (range: number): LottoDraw[] => {
    return rounds.slice(-range);
  };

  const contextValue = useMemo(
    () => ({
      rounds,
      latestRound,
      getRecentRounds,
      isLoading,
      error,
    }),
    [rounds, latestRound, isLoading, error]
  );

  return (
    <RoundsContext.Provider value={contextValue}>
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

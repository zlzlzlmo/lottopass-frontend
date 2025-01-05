import { drawService } from "@/api";
import { useQuery } from "react-query";

export const useLatestRound = () => {
  return useQuery(
    "latestRound",
    async () => {
      return await drawService.getLatestRound();
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

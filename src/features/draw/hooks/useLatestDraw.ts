import { drawService } from "@/api";
import { useQuery } from "react-query";

export const useLatestDraw = () => {
  return useQuery(
    "latestRound",
    async () => {
      return await drawService.getLatestDraw();
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

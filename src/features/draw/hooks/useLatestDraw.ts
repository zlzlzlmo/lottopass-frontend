import { drawService } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useLatestDraw = () => {
  return useQuery({
    queryKey: ["latestRound"],
    queryFn: async () => {
      return await drawService.getLatestDraw();
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

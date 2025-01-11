import { drawService } from "@/api";
import { useQuery } from "react-query";

export const useAllDraws = () => {
  return useQuery(
    "allDraws",
    async () => {
      return await drawService.getAllDraws();
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

import { drawService } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useAllDraws = () => {
  return useQuery({
    queryKey: ["allDraws"],
    queryFn: async () => {
      return await drawService.getAllDraws();
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

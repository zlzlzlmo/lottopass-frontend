import { useQuery } from "@tanstack/react-query";
import { LottoDraw } from "@/types";
import { drawService } from "@/api";

interface UseOneDrawOptions {
  drawNumber: number;
}

export const useOneDraw = ({ drawNumber }: UseOneDrawOptions) => {
  return useQuery<LottoDraw, Error>({
    queryKey: ["oneDraw", drawNumber],
    queryFn: () => drawService.getOneDraw(drawNumber),
    enabled: !!drawNumber,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

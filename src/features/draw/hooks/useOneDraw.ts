import { useQuery } from "react-query";
import { LottoDraw } from "lottopass-shared";
import { drawService } from "@/api";

interface UseOneDrawOptions {
  drawNumber: number;
}

export const useOneDraw = ({ drawNumber }: UseOneDrawOptions) => {
  return useQuery<LottoDraw, Error>(
    ["oneDraw", drawNumber], // Query Key
    () => drawService.getOneDraw(drawNumber),
    {
      enabled: !!drawNumber,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
    }
  );
};

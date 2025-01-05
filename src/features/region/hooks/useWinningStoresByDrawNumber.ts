import { useQuery } from "react-query";
import { WinningRegion } from "lottopass-shared";
import { regionService } from "@/api";

interface UseWinningStoresByDrawNumberOptions {
  drawNumber: number; // 회차 번호
  enabled?: boolean; // 쿼리 활성화 여부
}

export const useWinningStoresByDrawNumber = ({
  drawNumber,
  enabled = true,
}: UseWinningStoresByDrawNumberOptions) => {
  return useQuery<WinningRegion[], Error>(
    ["winningStoresByDraw", drawNumber], // Query Key
    async () => {
      return await regionService.getWinningStoresByDrawNumber(drawNumber); // API 호출
    },
    {
      enabled: !!drawNumber && enabled, // 회차 번호가 유효할 때만 쿼리 실행
      staleTime: 5 * 60 * 1000, // 5분 동안 데이터 캐싱
      cacheTime: 10 * 60 * 1000, // 10분 동안 캐시 데이터 유지
      retry: 2, // 실패 시 2회 재시도
    }
  );
};

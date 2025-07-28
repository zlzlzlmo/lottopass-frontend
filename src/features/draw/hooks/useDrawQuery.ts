import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { drawService } from '@/api';
import { DrawInfo } from '@/types';

// Query Keys
export const drawKeys = {
  all: ['draws'] as const,
  lists: () => [...drawKeys.all, 'list'] as const,
  list: (filters: any) => [...drawKeys.lists(), filters] as const,
  details: () => [...drawKeys.all, 'detail'] as const,
  detail: (drwNo: number) => [...drawKeys.details(), drwNo] as const,
  latest: () => [...drawKeys.all, 'latest'] as const,
};

// 최신 회차 조회
export function useLatestDraw() {
  return useQuery({
    queryKey: drawKeys.latest(),
    queryFn: () => drawService.getLatestDraw(),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

// 특정 회차 조회
export function useDrawDetail(drwNo: number) {
  return useQuery({
    queryKey: drawKeys.detail(drwNo),
    queryFn: () => drawService.getDrawByNo(drwNo),
    enabled: !!drwNo && drwNo > 0,
    staleTime: Infinity, // 추첨 결과는 변하지 않음
  });
}

// 회차 목록 조회
export function useDrawList(startNo: number, endNo: number) {
  return useQuery({
    queryKey: drawKeys.list({ startNo, endNo }),
    queryFn: async () => {
      const promises = [];
      for (let i = startNo; i <= endNo; i++) {
        promises.push(drawService.getDrawByNo(i));
      }
      return Promise.all(promises);
    },
    enabled: startNo > 0 && endNo >= startNo,
    staleTime: 1000 * 60 * 60, // 1시간
  });
}

// 회차 범위 조회 with pagination
export function useDrawsPaginated(page: number = 1, pageSize: number = 10) {
  const { data: latestDraw } = useLatestDraw();
  
  const startNo = latestDraw ? latestDraw.drwNo - (page - 1) * pageSize : 0;
  const endNo = latestDraw ? Math.max(1, startNo - pageSize + 1) : 0;
  
  return useQuery({
    queryKey: drawKeys.list({ page, pageSize }),
    queryFn: async () => {
      if (!latestDraw) return { draws: [], total: 0, page, pageSize };
      
      const draws = await Promise.all(
        Array.from({ length: pageSize }, (_, i) => {
          const drwNo = startNo - i;
          return drwNo > 0 ? drawService.getDrawByNo(drwNo) : null;
        })
      );
      
      return {
        draws: draws.filter(Boolean) as DrawInfo[],
        total: latestDraw.drwNo,
        page,
        pageSize,
      };
    },
    enabled: !!latestDraw,
    keepPreviousData: true,
  });
}

// Prefetch 회차 데이터
export function usePrefetchDraw() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (drwNo: number) => {
      return drawService.getDrawByNo(drwNo);
    },
    onSuccess: (data, drwNo) => {
      queryClient.setQueryData(drawKeys.detail(drwNo), data);
    },
  });
}

// 회차별 통계 조회
export function useDrawStatistics(drwNo: number) {
  return useQuery({
    queryKey: ['drawStatistics', drwNo],
    queryFn: async () => {
      const draw = await drawService.getDrawByNo(drwNo);
      
      // 번호 합계, 홀짝 비율 등 계산
      const numbers = [
        draw.drwtNo1, draw.drwtNo2, draw.drwtNo3,
        draw.drwtNo4, draw.drwtNo5, draw.drwtNo6,
      ];
      
      const sum = numbers.reduce((acc, num) => acc + num, 0);
      const oddCount = numbers.filter(num => num % 2 === 1).length;
      const evenCount = 6 - oddCount;
      
      // 번호 간격 계산
      const gaps = [];
      for (let i = 1; i < numbers.length; i++) {
        gaps.push(numbers[i] - numbers[i - 1]);
      }
      
      return {
        draw,
        statistics: {
          sum,
          average: sum / 6,
          oddCount,
          evenCount,
          oddRatio: (oddCount / 6) * 100,
          gaps,
          maxGap: Math.max(...gaps),
          minGap: Math.min(...gaps),
        },
      };
    },
    enabled: !!drwNo && drwNo > 0,
    staleTime: Infinity,
  });
}

// 회차 검색
export function useSearchDraw(keyword: string) {
  return useQuery({
    queryKey: ['searchDraw', keyword],
    queryFn: async () => {
      // 숫자인 경우 회차 번호로 검색
      const drwNo = parseInt(keyword);
      if (!isNaN(drwNo)) {
        try {
          const draw = await drawService.getDrawByNo(drwNo);
          return [draw];
        } catch {
          return [];
        }
      }
      
      // 날짜 형식인 경우 해당 날짜 주변 회차 검색
      // 구현 예정
      return [];
    },
    enabled: keyword.length > 0,
  });
}
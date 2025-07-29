# /api-types

API 응답을 기반으로 TypeScript 타입을 생성합니다. CODE_STYLE.md의 타입 정의 규칙을 준수합니다.

## 사용법
```
/api-types <api-endpoint> [options]
```

## 예시
```
/api-types https://api.dhlottery.co.kr/common.do?method=getLottoNumber --output packages/shared/types/lottery.ts
/api-types /api/lottery/latest --from-openapi --with-hooks
/api-types ./openapi.yaml --with-zod --split-by-tag
```

## 동작
1. API 엔드포인트 호출 또는 스펙 분석
2. 응답 구조 파싱 및 타입 추론
3. TypeScript 인터페이스 생성
4. Zod 스키마 생성 (선택적)
5. TanStack Query 훅 생성 (선택적)
6. 타입 파일 저장 및 barrel export 업데이트

## 생성 예시

### 기본 타입 생성
```typescript
// Generated from API response
export interface LotteryDrawResponse {
  returnValue: 'success' | 'fail';
  drwNo: number;
  drwNoDate: string;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  totSellamnt: number;
  firstWinamnt: number;
  firstPrzwnerCo: number;
}

// Transformed for app usage
export interface LotteryDraw {
  id: string;
  drawNumber: number;
  drawDate: Date;
  numbers: readonly [number, number, number, number, number, number];
  bonusNumber: number;
  totalSales: number;
  firstPrizeAmount: number;
  firstPrizeWinners: number;
}
```

### Zod 스키마 생성
```typescript
import { z } from 'zod';

export const LotteryDrawSchema = z.object({
  id: z.string(),
  drawNumber: z.number().int().positive(),
  drawDate: z.date(),
  numbers: z.tuple([
    z.number().int().min(1).max(45),
    z.number().int().min(1).max(45),
    z.number().int().min(1).max(45),
    z.number().int().min(1).max(45),
    z.number().int().min(1).max(45),
    z.number().int().min(1).max(45),
  ]),
  bonusNumber: z.number().int().min(1).max(45),
});

export type LotteryDraw = z.infer<typeof LotteryDrawSchema>;
```

### React Query 훅 생성
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

export const lotteryKeys = {
  all: ['lottery'] as const,
  draws: () => [...lotteryKeys.all, 'draws'] as const,
  draw: (id: string) => [...lotteryKeys.draws(), id] as const,
};

export const useGetLotteryDraw = (drawNumber: number) => {
  return useQuery({
    queryKey: lotteryKeys.draw(drawNumber.toString()),
    queryFn: async () => {
      const response = await fetch(`/api/lottery/${drawNumber}`);
      const data = await response.json();
      return LotteryDrawSchema.parse(data);
    },
  });
};
```

## 옵션
- `--output <path>`: 출력 파일 경로 (기본: packages/shared/types/)
- `--from-openapi`: OpenAPI 스펙에서 생성
- `--with-zod`: Zod 검증 스키마 포함
- `--with-hooks`: TanStack Query 훅 생성
- `--strict`: 엄격한 타입 생성 (unknown 사용)
- `--transform`: API 응답을 앱용 타입으로 변환
- `--split-by-tag`: OpenAPI 태그별로 파일 분리
- `--mock-data`: 테스트용 mock 데이터 생성

## 고급 기능

### 타입 변환 규칙
```yaml
transforms:
  - from: "drwNo"
    to: "drawNumber"
    type: "number"
  - from: "drwNoDate"
    to: "drawDate"
    type: "Date"
    transform: "new Date($value)"
```

### 커스텀 검증
```typescript
// 생성된 타입에 커스텀 검증 추가
export const validateLotteryNumbers = (numbers: number[]): boolean => {
  return numbers.every(n => n >= 1 && n <= 45) && 
         new Set(numbers).size === numbers.length;
};
```

## AI 프롬프트 템플릿
```
Generate TypeScript types from this API response:
[API Response JSON]

Requirements:
- Follow CODE_STYLE.md naming conventions
- Use interfaces for objects
- Create Zod schemas for runtime validation
- Generate TanStack Query hooks
- Transform snake_case to camelCase
- Add JSDoc comments
- Handle nullable fields with proper types
```
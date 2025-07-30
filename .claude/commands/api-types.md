# /api-types

API 응답에서 TypeScript 타입을 자동으로 생성합니다.

## Usage
```
/api-types <endpoint-url> [options]
```

## Options
- `--output` - 출력 파일 경로
- `--with-zod` - Zod 스키마 생성
- `--with-hooks` - React Query 훅 생성
- `--mock-data` - 모의 데이터 생성

## Implementation

API 엔드포인트를 분석하여 다음을 생성합니다:

1. **TypeScript 인터페이스**
   ```typescript
   interface LotteryDrawResponse {
     drwNo: number;
     drwNoDate: string;
     drwtNo1: number;
     drwtNo2: number;
     drwtNo3: number;
     drwtNo4: number;
     drwtNo5: number;
     drwtNo6: number;
     bnusNo: number;
     firstWinamnt: number;
     firstPrzwnerCo: number;
   }
   ```

2. **Zod 검증 스키마** (옵션)
   ```typescript
   const LotteryDrawSchema = z.object({
     drwNo: z.number(),
     drwNoDate: z.string(),
     // ...
   });
   ```

3. **React Query 훅** (옵션)
   ```typescript
   export const useLotteryDraw = (drawNo: number) => {
     return useQuery({
       queryKey: ['lottery', 'draw', drawNo],
       queryFn: () => fetchLotteryDraw(drawNo),
     });
   };
   ```

4. **모의 데이터 생성** (옵션)
   ```typescript
   export const mockLotteryDraw: LotteryDrawResponse = {
     drwNo: 1148,
     drwNoDate: "2024-01-20",
     // ...
   };
   ```

지원하는 기능:
- 중첩된 객체 처리
- 배열 타입 추론
- 선택적 필드 감지
- 유니온 타입 생성
- 열거형 추출
- 날짜/시간 타입 처리

결과물:
- TypeScript 타입 정의
- 런타임 검증 스키마
- API 클라이언트 코드
- 테스트용 모의 데이터
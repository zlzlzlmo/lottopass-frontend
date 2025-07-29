# /init-feature

기능 모듈을 초기화하고 표준 구조를 생성합니다. 모노레포 아키텍처와 CODE_STYLE.md를 준수합니다.

## 사용법
```
/init-feature <feature-name> [options]
```

## 예시
```
/init-feature lottery-stats --web --mobile
/init-feature user-profile --web --with-store
/init-feature payment-integration --package=core --with-tests
```

## 동작
1. 기능 디렉토리 구조 생성
2. 기본 컴포넌트 파일 생성
3. 타입 정의 추가
4. 스토어 초기화 (필요시)
5. API 훅 생성
6. 테스트 파일 설정
7. Barrel export 파일 생성
8. 문서 템플릿 생성

## 생성되는 구조

### 기본 구조 (Web)
```
apps/web/src/features/lottery-stats/
├── components/
│   ├── StatsChart.tsx
│   ├── StatsChart.test.tsx
│   └── index.ts
├── hooks/
│   ├── useStats.ts
│   ├── useStats.test.ts
│   └── index.ts
├── services/
│   ├── statsService.ts
│   ├── statsService.test.ts
│   └── index.ts
├── types/
│   └── stats.types.ts
├── index.ts
└── README.md
```

### 모바일 추가 구조
```
apps/mobile/src/features/lottery-stats/
├── components/
│   ├── StatsChart.tsx (React Native 버전)
│   └── StatsChart.test.tsx
├── screens/
│   ├── StatsScreen.tsx
│   └── StatsDetailScreen.tsx
└── navigation/
    └── StatsNavigator.tsx
```

### 패키지 구조 (Core)
```
packages/core/src/lottery-stats/
├── services/
│   └── StatsCalculator.ts
├── types/
│   └── stats.types.ts
├── utils/
│   └── statsHelpers.ts
└── index.ts
```

## 생성되는 파일 내용

### 컴포넌트 템플릿
```typescript
// components/StatsChart.tsx
import React from 'react';
import type { StatsData } from '../types/stats.types';

interface StatsChartProps {
  data: StatsData;
  variant?: 'bar' | 'line' | 'pie';
}

export const StatsChart: React.FC<StatsChartProps> = ({ 
  data, 
  variant = 'bar' 
}) => {
  return (
    <div className="stats-chart">
      {/* Implementation */}
    </div>
  );
};
```

### 훅 템플릿
```typescript
// hooks/useStats.ts
import { useQuery } from '@tanstack/react-query';
import { statsService } from '../services';

export const useStats = (options?: StatsOptions) => {
  return useQuery({
    queryKey: ['stats', options],
    queryFn: () => statsService.getStats(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### 스토어 템플릿 (with --with-store)
```typescript
// store/statsStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface StatsStore {
  selectedRange: DateRange;
  filters: StatsFilters;
  setRange: (range: DateRange) => void;
  setFilters: (filters: StatsFilters) => void;
  reset: () => void;
}

export const useStatsStore = create<StatsStore>()(
  devtools((set) => ({
    selectedRange: 'last30Days',
    filters: {},
    setRange: (range) => set({ selectedRange: range }),
    setFilters: (filters) => set({ filters }),
    reset: () => set({ selectedRange: 'last30Days', filters: {} }),
  }))
);
```

## 옵션
- `--web`: 웹 앱용 컴포넌트 생성 (Next.js)
- `--mobile`: 모바일 앱용 컴포넌트 생성 (React Native)
- `--package <name>`: 특정 패키지에 생성 (core, ui, shared)
- `--no-tests`: 테스트 파일 생성 건너뛰기
- `--with-store`: Zustand 스토어 생성
- `--with-api`: API 서비스 및 훅 생성
- `--with-docs`: 상세 문서 템플릿 생성
- `--dry-run`: 실제 파일 생성 없이 미리보기

## AI 활용 가이드
```
Initialize a new feature module for [feature-name]:
- Follow the monorepo structure
- Create components with TypeScript and proper types
- Include TanStack Query hooks for data fetching
- Add Zustand store if state management needed
- Generate comprehensive tests
- Follow CODE_STYLE.md conventions
- Create proper barrel exports
```

## 후속 작업
1. 생성된 파일 검토
2. 비즈니스 로직 구현
3. 테스트 작성 (`/test-component`)
4. 스타일 검증 (`/enforce-style`)
5. 문서 업데이트 (`/generate-docs`)
# /init-feature

새로운 기능 모듈을 표준 구조로 초기화합니다.

## Usage
```
/init-feature <feature-name> [options]
```

## Options
- `--platform` - 대상 플랫폼: `web`, `mobile`, `all`
- `--with-tests` - 테스트 파일 포함
- `--with-store` - 상태 관리 store 포함
- `--with-api` - API 통합 포함

## Implementation

지정된 기능에 대해 다음 구조를 생성합니다:

```
features/<feature-name>/
├── components/
│   ├── <FeatureName>.tsx
│   └── index.ts
├── hooks/
│   ├── use<FeatureName>.ts
│   └── index.ts
├── services/
│   ├── <featureName>Service.ts
│   └── index.ts
├── types/
│   ├── <featureName>.types.ts
│   └── index.ts
├── utils/
│   ├── <featureName>.utils.ts
│   └── index.ts
├── store/ (--with-store 옵션)
│   └── <featureName>.store.ts
├── __tests__/ (--with-tests 옵션)
│   ├── <FeatureName>.test.tsx
│   └── use<FeatureName>.test.ts
└── index.ts

생성되는 파일들:
- TypeScript 기반 컴포넌트
- 커스텀 훅
- 서비스 레이어
- 타입 정의
- 유틸리티 함수
- Zustand store (옵션)
- 테스트 파일 (옵션)

각 파일은 프로젝트의 코딩 컨벤션을 따르며:
- 적절한 import 구조
- TypeScript 타입 안전성
- 문서화 주석
- 기본 구현 포함
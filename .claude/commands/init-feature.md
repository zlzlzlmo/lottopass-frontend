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

### AI 기반 기능 분석

1. **Exa MCP로 최신 트렌드 조사**
   - 유사한 기능의 실제 구현 패턴 검색
   - 업계 베스트 프랙티스 수집
   - 인기 있는 라이브러리/패키지 파악

2. **Context7 MCP로 프레임워크 문서 참조**
   - React/Next.js 최신 API 패턴 확인
   - 권장되는 폴더 구조 및 네이밍 컨벤션
   - 성능 최적화 가이드라인

3. **스마트 보일러플레이트 생성**
   - 조사한 패턴을 기반으로 최적화된 코드 생성
   - 프로젝트 컨텍스트에 맞는 커스터마이징
   - 필요한 의존성 자동 제안

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

### 사용 예시

```bash
# 기본 사용
/init-feature user-profile

# 모든 옵션 포함
/init-feature payment-gateway --platform=web --with-tests --with-store --with-api
```

### AI 활용 프로세스

1. **기능 이름 분석**: "payment-gateway"라는 기능명으로부터 결제 관련 기능임을 파악
2. **Exa로 조사**: 
   - "React payment gateway implementation best practices"
   - "Next.js payment integration patterns"
   - "Secure payment form React components"
3. **Context7로 문서 확인**:
   - Next.js API routes for payment endpoints
   - React hooks for form validation
   - Zustand patterns for payment state
4. **코드 생성**: 조사한 내용을 바탕으로 실제 사용 가능한 보일러플레이트 생성
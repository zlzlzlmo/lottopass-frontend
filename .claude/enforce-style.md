# /enforce-style

프로젝트의 코드 스타일 규칙을 검사하고 적용합니다. CODE_STYLE.md 문서를 기반으로 일관된 코드 품질을 유지합니다.

## 사용법
```
/enforce-style [path] [options]
```

## 예시
```
/enforce-style src --fix
/enforce-style apps/web --check-only
/enforce-style packages/core --strict --report
```

## 동작
1. 코드 스타일 규칙 검사
2. TypeScript 엄격 모드 준수 확인
3. 네이밍 컨벤션 검증
4. 파일 구조 검증
5. Import 순서 정리
6. 포맷팅 적용
7. 커스텀 규칙 검증

## 검사 항목

### TypeScript 규칙
- `strict: true` 준수
- `any` 타입 사용 금지
- `unknown` 사용 권장
- 명시적 타입 정의
- Utility 타입 활용

### React 규칙
- 함수형 컴포넌트만 사용
- Props 인터페이스 네이밍 (ComponentNameProps)
- React 19 패턴 사용 (useTransition, useOptimistic)
- 커스텀 훅 `use` 프리픽스

### 네이밍 컨벤션
- 컴포넌트: PascalCase
- 함수/훅: camelCase
- 상수: UPPER_SNAKE_CASE
- 타입/인터페이스: PascalCase
- 파일명: 컴포넌트는 PascalCase, 나머지는 camelCase

### Import 구조
```typescript
// 1. React/Next.js
// 2. 외부 라이브러리
// 3. 내부 패키지 (@lottopass/*)
// 4. 상대 경로
// 5. 스타일
```

### 보안 규칙
- 하드코딩된 credentials 검사
- console.log에 민감 정보 노출 검사
- 입력값 검증 확인

## 옵션
- `--fix`: 자동 수정 적용
- `--check-only`: 검사만 수행 (기본값)
- `--strict`: 모든 규칙 엄격 적용
- `--ignore <pattern>`: 특정 파일/폴더 제외
- `--report`: 상세 리포트 생성 (HTML/JSON)
- `--ci`: CI 환경용 (자동 수정 없음, exit code 반환)

## 설정 파일
`.styleguide.json`으로 커스터마이징 가능:
```json
{
  "extends": "./CODE_STYLE.md",
  "rules": {
    "typescript/no-any": "error",
    "react/function-component": "error",
    "naming/component": "PascalCase"
  },
  "ignore": ["node_modules", "dist", "*.generated.ts"]
}
```

## AI 활용 가이드
```
Apply code style fixes following CODE_STYLE.md:
- Fix TypeScript strict mode violations
- Convert class components to function components
- Apply proper naming conventions
- Organize imports correctly
- Add missing type definitions
- Remove any usage of 'any' type
```

## 통합 워크플로우
```bash
# 1. 스타일 검사
/enforce-style src --check-only

# 2. 자동 수정
/enforce-style src --fix

# 3. 남은 이슈 수동 수정
# 4. 최종 검증
npm run lint && npm run type-check
```
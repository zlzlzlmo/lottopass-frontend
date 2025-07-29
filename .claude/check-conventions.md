# /check-conventions

프로젝트 아키텍처 및 코딩 컨벤션 준수를 검사합니다.

## 사용법
```
/check-conventions [scope] [options]
```

## 예시
```
/check-conventions packages/core --strict
/check-conventions apps/web/src/features --fix
```

## 동작
1. 모노레포 구조 규칙 검사
2. 패키지 간 의존성 검증
3. 기능별 폴더 구조 확인
4. 비즈니스 로직 위치 검증
5. 상태 관리 패턴 확인
6. 컴포넌트 구조 검증

## 검사 규칙
### 아키텍처
- 비즈니스 로직은 `@lottopass/core`에만
- UI 컴포넌트는 플랫폼별 분리
- 공통 타입은 `@lottopass/shared`에
- 전역 상태는 `@lottopass/stores`에

### 컴포넌트
- 기능별 디렉토리 구조 준수
- Props 인터페이스 필수
- 컴포넌트별 테스트 파일 존재
- Barrel export 사용

### 코드 패턴
- React 19 패턴 사용 (useTransition, useOptimistic)
- 서버 상태는 TanStack Query
- 클라이언트 상태는 Zustand
- 엄격한 TypeScript 사용

## 옵션
- `--fix`: 자동으로 수정 가능한 문제 해결
- `--strict`: 모든 규칙 엄격 적용
- `--architecture-only`: 아키텍처 규칙만 검사
- `--report`: 상세 리포트 생성
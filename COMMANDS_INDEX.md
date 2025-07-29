# Claude Code Commands Index

LottoPass 프로젝트에서 사용 가능한 모든 커스텀 명령어 목록입니다.

## 📋 명령어 카테고리

### 🚀 개발 초기화
- [`/init-feature`](./commands/init-feature.md) - 새로운 기능 모듈 생성 및 구조 설정

### 🧪 테스팅
- [`/test-component`](./commands/test-component.md) - 컴포넌트 테스트 자동 생성 및 실행

### 📊 코드 품질
- [`/enforce-style`](./commands/enforce-style.md) - 코드 스타일 규칙 검사 및 적용
- [`/check-conventions`](./commands/check-conventions.md) - 아키텍처 및 컨벤션 준수 검증
- [`/check-a11y`](./commands/check-a11y.md) - 접근성 검사 및 자동 수정
- [`/ai-review`](./commands/ai-review.md) - AI 기반 코드 리뷰 및 개선 제안

### 🔧 리팩토링 & 마이그레이션
- [`/migrate-component`](./commands/migrate-component.md) - 레거시 컴포넌트 현대화
- [`/refactor-imports`](./commands/refactor-imports.md) - Import 문 정리 및 최적화

### 🎯 성능 최적화
- [`/optimize-bundle`](./commands/optimize-bundle.md) - 번들 크기 분석 및 최적화
- [`/perf-audit`](./commands/perf-audit.md) - 성능 감사 및 최적화 제안

### 🔍 코드 생성
- [`/api-types`](./commands/api-types.md) - API 응답 기반 TypeScript 타입 생성
- [`/generate-docs`](./commands/generate-docs.md) - 코드베이스 문서 자동 생성

### 🛠 디버깅 & 모니터링
- [`/debug-assistant`](./commands/debug-assistant.md) - AI 기반 디버깅 도우미
- [`/setup-monitoring`](./commands/setup-monitoring.md) - 애플리케이션 모니터링 설정

## 🎯 사용 시나리오별 가이드

### 새 기능 개발 시작할 때
```bash
1. /init-feature user-dashboard --web --mobile --with-store
2. # 비즈니스 로직 구현
3. /test-component src/features/user-dashboard/components/Dashboard.tsx
4. /enforce-style src/features/user-dashboard --fix
```

### 레거시 코드 개선할 때
```bash
1. /migrate-component src/components/OldComponent.jsx --to-typescript
2. /refactor-imports src/components --fix
3. /ai-review src/components/NewComponent.tsx
4. /test-component src/components/NewComponent.tsx --coverage
```

### 성능 문제 해결할 때
```bash
1. /perf-audit web --lighthouse
2. /optimize-bundle web --analyze
3. /debug-assistant "Component rendering too slowly" --profile
4. /ai-review src/components --focus=performance
```

### API 통합할 때
```bash
1. /api-types https://api.example.com/endpoint --with-hooks --with-zod
2. /test-component src/hooks/useApiData.ts --hooks
3. /generate-docs packages/api-client
```

### 프로덕션 배포 전
```bash
1. /enforce-style . --strict --ci
2. /check-conventions . --strict
3. /check-a11y apps/web --level=AA
4. /perf-audit --threshold=90
5. /optimize-bundle --fix
```

## 💡 프로 팁

### 명령어 체이닝
여러 명령어를 순차적으로 실행:
```bash
/init-feature lottery-history --web && \
/test-component src/features/lottery-history/components/HistoryList.tsx && \
/enforce-style src/features/lottery-history --fix
```

### 커스텀 설정
프로젝트 루트에 설정 파일 생성:
- `.styleguide.json` - 스타일 규칙 커스터마이징
- `.ai-review.yml` - AI 리뷰 규칙 설정
- `.ai-context` - AI 세션 컨텍스트

### CI/CD 통합
GitHub Actions에서 사용:
```yaml
- name: Code Quality Check
  run: |
    claude-code /enforce-style . --ci
    claude-code /check-conventions . --strict
    claude-code /ai-review . --severity=high --format=markdown
```

## 📚 관련 문서
- [CODE_STYLE.md](./CODE_STYLE.md) - 코딩 스타일 가이드
- [TESTING_STANDARDS.md](./TESTING_STANDARDS.md) - 테스팅 표준
- [AI_DEVELOPMENT.md](./AI_DEVELOPMENT.md) - AI 활용 개발 가이드
- [CLAUDE.md](./CLAUDE.md) - Claude Code 프로젝트 가이드

## 🔄 업데이트 내역
- 2024-01-20: 초기 명령어 세트 생성
- 2024-01-20: AI 기반 명령어 추가 (ai-review, debug-assistant)
- 2024-01-20: 문서 및 스타일 가이드 통합
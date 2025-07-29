# /ai-review

AI를 활용하여 코드 리뷰를 수행하고 개선 사항을 제안합니다. AI_DEVELOPMENT.md의 리뷰 체크리스트를 기반으로 합니다.

## 사용법
```
/ai-review <file-or-directory> [options]
```

## 예시
```
/ai-review src/components/LotteryForm.tsx
/ai-review apps/web/src/features --focus=security
/ai-review . --changed-only --severity=high
```

## 동작
1. 대상 코드 분석
2. 체크리스트 기반 검토
3. 문제점 식별 및 분류
4. 개선 제안 생성
5. 우선순위별 리포트 생성
6. 수정 사항 제안 (선택적)

## 검토 항목

### 🔒 보안 (Security)
- 하드코딩된 credentials 검사
- Input validation 확인
- XSS 취약점 검사
- API 엔드포인트 보안
- 민감 데이터 로깅 검사
- 환경 변수 사용 확인

### 🏗️ 아키텍처 (Architecture)
- 모노레포 경계 준수
- 패키지 의존성 올바름
- 관심사 분리 확인
- 순환 의존성 검사
- 레이어 침범 검사

### 📝 코드 품질 (Code Quality)
- TypeScript strict 모드 준수
- `any` 타입 사용 검사
- 에러 핸들링 적절성
- 네이밍 컨벤션 준수
- DRY 원칙 준수
- 복잡도 분석

### 🧪 테스팅 (Testing)
- 테스트 커버리지 확인
- 엣지 케이스 처리
- Mock 적절성 검증
- 접근성 테스트 존재
- 테스트 격리 확인

### 🚀 성능 (Performance)
- 불필요한 리렌더링 검사
- 메모이제이션 기회 식별
- 번들 크기 영향 분석
- 지연 로딩 기회
- 최적화 가능성

### ♿ 접근성 (Accessibility)
- ARIA 레이블 확인
- 키보드 네비게이션
- 색상 대비 검사
- 스크린 리더 호환성
- 포커스 관리

## 리뷰 결과 형식

### 요약 리포트
```markdown
## AI Code Review Summary

**Reviewed**: LotteryForm.tsx
**Date**: 2024-01-20
**Score**: 85/100

### Critical Issues (2)
- 🔴 SQL injection vulnerability in line 45
- 🔴 Missing error boundary

### High Priority (3)
- 🟡 No input validation for user data
- 🟡 API key exposed in console.log
- 🟡 Missing loading state

### Recommendations (5)
- 🟢 Add TypeScript strict null checks
- 🟢 Implement proper error handling
- 🟢 Add unit tests
- 🟢 Optimize re-renders with memo
- 🟢 Add accessibility labels
```

### 상세 리뷰
```typescript
// 🔴 Critical: SQL Injection Risk
// Line 45
const query = `SELECT * FROM users WHERE id = ${userId}`;
// Fix: Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';

// 🟡 High: Missing Error Handling
// Line 67
const data = await fetch('/api/data');
// Fix: Add try-catch and error state
try {
  const data = await fetch('/api/data');
  if (!data.ok) throw new Error('Failed to fetch');
} catch (error) {
  setError(error.message);
}
```

## 옵션
- `--focus <area>`: 특정 영역 집중 (security, performance, etc.)
- `--severity <level>`: 심각도 필터 (critical, high, medium, low)
- `--changed-only`: Git 변경사항만 검토
- `--fix`: 자동 수정 가능한 문제 해결
- `--format <type>`: 출력 형식 (markdown, json, html)
- `--compare <branch>`: 브랜치 간 비교
- `--config <file>`: 커스텀 리뷰 규칙 파일

## 커스텀 규칙 설정
`.ai-review.yml`:
```yaml
rules:
  security:
    - no-console-secrets: error
    - input-validation: error
  performance:
    - memo-complex-components: warning
    - bundle-size-limit: 200KB
  custom:
    - pattern: "TODO|FIXME"
      message: "Unresolved TODO found"
      severity: medium
```

## AI 프롬프트 템플릿
```
Review this code following AI_DEVELOPMENT.md checklist:
[Code Content]

Focus areas:
- Security vulnerabilities
- TypeScript best practices
- React patterns and performance
- Accessibility compliance
- Testing coverage

Provide:
1. Severity-ranked issues
2. Specific line references
3. Fix suggestions with code examples
4. Overall code quality score
```

## CI/CD 통합
```bash
# GitHub Actions example
- name: AI Code Review
  run: |
    claude-code /ai-review . \
      --changed-only \
      --severity=high \
      --format=markdown > review.md
    
    if [ $? -ne 0 ]; then
      echo "Critical issues found"
      exit 1
    fi
```

## 통합 워크플로우
1. 코드 작성
2. `/ai-review` 실행
3. 크리티컬 이슈 수정
4. `/enforce-style --fix` 실행
5. `/test-component` 로 테스트 생성
6. 최종 검증 후 커밋
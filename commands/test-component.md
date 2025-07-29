# /test-component

컴포넌트의 테스트를 작성하고 실행합니다. TESTING_STANDARDS.md를 준수하여 행동 기반 테스트를 생성합니다.

## 사용법
```
/test-component <component-path> [options]
```

## 예시
```
/test-component src/components/ui/Button.tsx
/test-component apps/web/src/components/home/HeroSection.tsx --coverage
/test-component packages/ui-universal/LottoBall.tsx --integration
```

## 동작
1. 컴포넌트 분석 (props, state, hooks 파악)
2. 테스트 케이스 자동 생성
   - 기본 렌더링 테스트
   - Props 변경 테스트
   - 사용자 상호작용 테스트
   - 엣지 케이스 테스트
3. 접근성 테스트 포함 (jest-axe)
4. 비동기 동작 테스트
5. 성능 메트릭 측정 (선택적)
6. 테스트 실행 및 결과 보고

## 생성되는 테스트 구조
```typescript
describe('ComponentName', () => {
  // Setup and teardown
  beforeEach(() => {});
  
  // Rendering tests
  describe('rendering', () => {});
  
  // User interaction tests
  describe('user interactions', () => {});
  
  // Edge cases
  describe('edge cases', () => {});
  
  // Accessibility
  describe('accessibility', () => {});
});
```

## 옵션
- `--coverage`: 커버리지 리포트 생성 (목표: 80%+)
- `--update-snapshots`: 스냅샷 업데이트
- `--watch`: 감시 모드로 실행
- `--only-a11y`: 접근성 테스트만 실행
- `--integration`: 통합 테스트 포함
- `--performance`: 성능 테스트 포함
- `--hooks`: 커스텀 훅 테스트 생성
- `--no-mock`: 모킹 최소화 (외부 의존성만)

## AI 프롬프트 템플릿
```
Generate tests for [ComponentName] following TESTING_STANDARDS.md:
- Test behavior, not implementation
- Use React Testing Library best practices
- Include accessibility tests with jest-axe
- Mock only external dependencies
- Test user flows: [list specific flows]
- Edge cases: [list edge cases]
- Async operations: [if applicable]
```
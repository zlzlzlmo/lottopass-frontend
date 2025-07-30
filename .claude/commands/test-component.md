# /test-component

컴포넌트에 대한 테스트를 자동으로 생성하고 실행합니다.

## Usage
```
/test-component <component-path> [options]
```

## Options
- `--coverage` - 커버리지 보고서 생성
- `--watch` - 감시 모드로 실행
- `--update-snapshots` - 스냅샷 업데이트
- `--only` - 특정 테스트만 실행

## Implementation

다음과 같은 테스트를 자동으로 생성합니다:

1. **렌더링 테스트**
   - 컴포넌트가 오류 없이 렌더링되는지
   - 필수 props 검증
   - 조건부 렌더링 검증

2. **사용자 상호작용 테스트**
   - 클릭 이벤트 처리
   - 폼 입력 및 제출
   - 키보드 네비게이션

3. **상태 관리 테스트**
   - 상태 변경 검증
   - 부작용 처리
   - 비동기 동작

4. **접근성 테스트**
   - ARIA 속성 검증
   - 키보드 접근성
   - 스크린 리더 지원

5. **통합 테스트**
   - API 호출 모킹
   - 라우팅 동작
   - 전역 상태 통합

생성되는 테스트 예시:
```typescript
describe('<ComponentName />', () => {
  it('renders without crashing', () => {})
  it('handles user interactions correctly', () => {})
  it('manages state properly', () => {})
  it('meets accessibility standards', () => {})
  it('integrates with external services', () => {})
})
```

결과물:
- 테스트 파일 생성/업데이트
- 테스트 실행 결과
- 커버리지 보고서
- 개선 제안사항
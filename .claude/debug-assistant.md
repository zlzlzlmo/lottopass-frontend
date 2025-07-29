# /debug-assistant

AI 기반 디버깅 어시스턴트로 복잡한 버그를 해결합니다. 컨텍스트를 수집하고 단계별로 문제를 분석합니다.

## 사용법
```
/debug-assistant <error-description> [options]
```

## 예시
```
/debug-assistant "Component not re-rendering after state update"
/debug-assistant "TypeError: Cannot read property 'map' of undefined" --file=src/components/List.tsx
/debug-assistant "Memory leak in useEffect" --trace
```

## 동작
1. 에러 컨텍스트 수집
2. 관련 코드 분석
3. 스택 트레이스 파싱
4. 가능한 원인 식별
5. 단계별 해결 방안 제시
6. 수정 코드 제안
7. 재발 방지 가이드

## 디버깅 전략

### 1. 컨텍스트 수집
```typescript
// 수집하는 정보
- Error message and stack trace
- Component/function code
- Related files and imports
- Recent git changes
- Dependencies versions
- Runtime environment
```

### 2. 문제 유형 분류
- **Type Errors**: TypeScript 타입 관련
- **Runtime Errors**: 실행 중 발생
- **Logic Errors**: 비즈니스 로직 문제
- **Performance Issues**: 성능 저하
- **Memory Leaks**: 메모리 누수
- **State Issues**: 상태 관리 문제

### 3. 분석 템플릿

#### React 리렌더링 문제
```typescript
// 문제 분석
1. Dependencies 확인
   - useEffect deps array
   - useCallback/useMemo deps
   
2. State 변경 확인
   - 직접 변경 vs 불변성
   - 참조 동일성
   
3. Component 구조
   - Props 변경
   - Context 변경

// 해결 방안
const Component = () => {
  // ❌ 문제: 매번 새 객체 생성
  const config = { key: value };
  
  // ✅ 해결: 메모이제이션
  const config = useMemo(() => ({ key: value }), [value]);
};
```

#### TypeScript 타입 에러
```typescript
// 문제 분석
1. 타입 정의 확인
2. 타입 추론 경로
3. 제네릭 사용
4. Union/Intersection 타입

// 해결 방안
// ❌ 문제: 타입 불일치
const data: string = fetchData(); // returns unknown

// ✅ 해결: 타입 가드
const data = fetchData();
if (typeof data === 'string') {
  // data is string
}
```

### 4. 일반적인 문제와 해결책

#### undefined/null 참조
```typescript
// 문제
data.map(item => item.name) // data가 undefined

// 진단
- API 응답 확인
- 초기 상태 확인
- 로딩 상태 처리

// 해결
{data?.map(item => item.name) ?? <Loading />}
```

#### 무한 루프
```typescript
// 문제
useEffect(() => {
  setData(newData);
}); // deps 누락

// 진단
- Dependencies 분석
- State 업데이트 추적

// 해결
useEffect(() => {
  setData(newData);
}, [newData]);
```

#### 메모리 누수
```typescript
// 문제
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  // cleanup 없음
}, []);

// 해결
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

## 출력 형식

### 기본 출력
```markdown
## Debug Analysis

### 🔍 Problem Summary
Component not re-rendering after state update

### 🎯 Root Cause
State mutation detected - React requires immutable updates

### 📍 Location
File: src/components/TodoList.tsx
Line: 45-47

### 🔧 Solution
```typescript
// ❌ Current (Mutating state)
const handleAdd = (item) => {
  state.items.push(item);
  setState(state);
};

// ✅ Fixed (Immutable update)
const handleAdd = (item) => {
  setState(prev => ({
    ...prev,
    items: [...prev.items, item]
  }));
};
```

### 🚀 Next Steps
1. Apply the fix above
2. Add unit test for state updates
3. Consider using Immer for complex state
```

## 옵션
- `--file <path>`: 특정 파일 지정
- `--trace`: 전체 스택 트레이스 포함
- `--verbose`: 상세 분석 모드
- `--recent-changes`: 최근 변경사항 포함
- `--test`: 테스트 코드 생성
- `--similar`: 유사한 문제 검색

## 고급 기능

### 성능 프로파일링
```bash
/debug-assistant "Slow render performance" --profile
```

### 메모리 분석
```bash
/debug-assistant "Memory usage increasing" --memory-analysis
```

### 비교 디버깅
```bash
/debug-assistant "Works in dev but not in prod" --compare-env
```

## AI 프롬프트 템플릿
```
Debug this issue step by step:
Error: [Error message]
Context: [Code context]
Stack trace: [If available]

Analyze:
1. What is the root cause?
2. Why does this happen?
3. How to fix it?
4. How to prevent it?

Provide:
- Specific fix with code
- Explanation of the issue
- Best practices to avoid
- Test cases to verify fix
```

## 통합 디버깅 플로우
1. 에러 발생
2. `/debug-assistant` 실행
3. 제안된 수정 적용
4. `/test-component` 로 테스트 추가
5. `/ai-review` 로 최종 검증
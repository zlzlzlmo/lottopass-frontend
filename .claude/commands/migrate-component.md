# /migrate-component

레거시 컴포넌트를 최신 패턴으로 마이그레이션합니다.

## Usage
```
/migrate-component <component-path> [options]
```

## Options
- `--to-typescript` - TypeScript로 변환
- `--to-functional` - 함수형 컴포넌트로 변환
- `--update-styling` - 스타일링 시스템 업데이트
- `--add-tests` - 테스트 추가

## Implementation

다음과 같은 마이그레이션을 수행합니다:

1. **TypeScript 변환**
   - PropTypes → TypeScript 인터페이스
   - 타입 추론 개선
   - 제네릭 적용
   - strict 모드 준수

2. **React 패턴 현대화**
   - Class → Function 컴포넌트
   - Hook 패턴 적용
   - React 19 기능 활용
   - Suspense 통합

3. **스타일링 마이그레이션**
   - CSS Modules → Tailwind CSS
   - styled-components → CSS-in-JS
   - 반응형 디자인 개선
   - 다크 모드 지원

4. **상태 관리 개선**
   - Redux → Zustand
   - Local state 최적화
   - Context 사용 개선
   - 서버 상태 분리

5. **성능 최적화**
   - React.memo 적용
   - useMemo/useCallback 최적화
   - 번들 크기 감소
   - 렌더링 최적화

마이그레이션 프로세스:
1. 현재 코드 분석
2. 마이그레이션 계획 수립
3. 단계별 변환 실행
4. 테스트 작성/실행
5. 성능 비교 분석

결과물:
- 마이그레이션된 컴포넌트
- 변경 사항 요약
- 테스트 커버리지
- 성능 개선 보고서
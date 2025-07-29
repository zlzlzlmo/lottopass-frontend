# /check-a11y

접근성 문제를 검사하고 수정합니다.

## 사용법
```
/check-a11y <path> [options]
```

## 예시
```
/check-a11y apps/web --fix
/check-a11y src/components/form --report
```

## 동작
1. WCAG 2.1 기준 검사
2. 색상 대비 확인
3. ARIA 레이블 검증
4. 키보드 네비게이션 테스트
5. 스크린 리더 호환성 확인
6. 자동 수정 적용 (가능한 경우)

## 옵션
- `--fix`: 자동으로 수정 가능한 문제 해결
- `--level <AA|AAA>`: WCAG 레벨 지정 (기본: AA)
- `--report`: 상세 리포트 생성
- `--components-only`: 컴포넌트만 검사
- `--ignore <pattern>`: 특정 파일/폴더 제외
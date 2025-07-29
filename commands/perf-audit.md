# /perf-audit

성능 감사를 실행하고 최적화 제안을 제공합니다.

## 사용법
```
/perf-audit [app] [options]
```

## 예시
```
/perf-audit web --lighthouse
/perf-audit mobile --components
```

## 동작
1. 렌더링 성능 분석
2. 번들 크기 확인
3. 리렌더링 패턴 감지
4. 메모이제이션 기회 식별
5. 이미지 최적화 확인
6. 성능 점수 및 개선안 제공

## 옵션
- `--lighthouse`: Lighthouse 감사 실행
- `--components`: 컴포넌트별 성능 분석
- `--runtime`: 런타임 성능 프로파일링
- `--threshold <score>`: 성능 임계값 설정
- `--fix`: 자동 최적화 적용
# /perf-audit

성능 감사를 수행하고 최적화 제안을 제공합니다.

## Usage
```
/perf-audit [app] [options]
```

## Options
- `--lighthouse` - Lighthouse 감사 실행
- `--runtime` - 런타임 성능 분석
- `--threshold` - 성능 임계값 설정 (0-100)
- `--device` - 디바이스 유형: `mobile`, `desktop`

## Implementation

종합적인 성능 분석을 수행합니다:

1. **초기 로딩 성능**
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
   - Total Blocking Time (TBT)
   - Cumulative Layout Shift (CLS)

2. **런타임 성능**
   - 렌더링 성능
   - 스크롤 성능
   - 애니메이션 성능
   - 메모리 사용량
   - CPU 사용률

3. **네트워크 성능**
   - 요청 수 및 크기
   - 캐싱 효율성
   - CDN 활용도
   - API 응답 시간
   - 리소스 우선순위

4. **코드 성능**
   - JavaScript 실행 시간
   - 메인 스레드 차단
   - 비효율적인 셀렉터
   - 메모리 누수
   - 불필요한 리렌더링

5. **모바일 최적화**
   - 터치 응답성
   - 배터리 사용량
   - 네트워크 효율성
   - 오프라인 성능

최적화 제안:
- 이미지 최적화 (WebP, lazy loading)
- 코드 분할 전략
- 캐싱 정책 개선
- 리소스 힌트 적용
- 서비스 워커 활용
- 프리페칭/프리로딩

결과물:
- 성능 점수 (0-100)
- Core Web Vitals 측정값
- 병목 지점 식별
- 우선순위별 개선 항목
- 예상 성능 향상도
- 구현 가이드
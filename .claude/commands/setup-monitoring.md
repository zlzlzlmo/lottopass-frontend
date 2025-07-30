# /setup-monitoring

애플리케이션 모니터링을 설정합니다.

## Usage
```
/setup-monitoring <service> [options]
```

## Options
- `--service` - 모니터링 서비스: `sentry`, `datadog`, `newrelic`, `custom`
- `--features` - 활성화할 기능: `errors`, `performance`, `logs`, `metrics`
- `--env` - 환경: `development`, `staging`, `production`
- `--sample-rate` - 샘플링 비율 (0-1)

## Implementation

다음과 같은 모니터링을 구성합니다:

1. **에러 모니터링**
   ```typescript
   // Sentry 설정 예시
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
     integrations: [
       new BrowserTracing(),
       new Replay(),
     ],
     tracesSampleRate: 0.1,
     replaysSessionSampleRate: 0.1,
   });
   ```

2. **성능 모니터링**
   - 페이지 로드 시간
   - API 응답 시간
   - 렌더링 성능
   - 리소스 사용량
   - 사용자 세션 추적

3. **커스텀 메트릭**
   ```typescript
   // 로또 번호 생성 추적
   trackEvent('lottery_number_generated', {
     method: generationMethod,
     duration: endTime - startTime,
     userId: user.id,
   });
   ```

4. **로그 수집**
   - 구조화된 로깅
   - 로그 레벨 관리
   - 컨텍스트 정보 포함
   - 민감 정보 필터링

5. **알림 설정**
   - 에러율 임계값
   - 성능 저하 감지
   - 사용자 경험 지표
   - 비즈니스 메트릭

모니터링 대시보드:
- 실시간 에러 추적
- 성능 메트릭 시각화
- 사용자 행동 분석
- 사용자 정의 대시보드
- 알림 규칙 관리

통합 기능:
- 소스맵 업로드
- 릴리즈 추적
- 사용자 피드백 수집
- A/B 테스트 추적
- 세션 리플레이

결과물:
- 모니터링 설정 코드
- 환경 변수 구성
- 대시보드 설정
- 알림 규칙
- 모니터링 가이드
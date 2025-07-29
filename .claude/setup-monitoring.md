# /setup-monitoring

애플리케이션 모니터링 설정을 구성합니다.

## 사용법
```
/setup-monitoring <service> [options]
```

## 예시
```
/setup-monitoring sentry --dsn <your-dsn>
/setup-monitoring vercel-analytics
```

## 동작
1. 모니터링 서비스 SDK 설치
2. 환경 변수 설정
3. 초기화 코드 추가
4. 에러 바운더리 설정
5. 성능 모니터링 구성
6. 커스텀 이벤트 추적 설정

## 옵션
- `--service <name>`: 서비스 선택 (sentry, vercel, datadog)
- `--env <prod|dev>`: 환경 지정
- `--performance`: 성능 모니터링 포함
- `--custom-events`: 커스텀 이벤트 추적
- `--source-maps`: 소스맵 업로드 설정
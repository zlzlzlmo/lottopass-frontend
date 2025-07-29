# /optimize-bundle

번들 크기를 분석하고 최적화합니다.

## 사용법
```
/optimize-bundle [app] [options]
```

## 예시
```
/optimize-bundle web --analyze
/optimize-bundle mobile --fix
```

## 동작
1. 현재 번들 크기 분석
2. 대용량 의존성 식별
3. 트리 셰이킹 기회 찾기
4. 동적 임포트 제안
5. 중복 패키지 감지
6. 최적화 적용 (--fix 옵션시)

## 옵션
- `--analyze`: 상세 분석 리포트 생성
- `--fix`: 자동 최적화 적용
- `--threshold <size>`: 경고 임계값 설정 (기본: 170KB)
- `--format <type>`: 리포트 형식 (json, html, text)
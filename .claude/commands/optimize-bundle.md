# /optimize-bundle

번들 크기를 분석하고 최적화합니다.

## Usage
```
/optimize-bundle [app] [options]
```

## Options
- `--analyze` - 번들 분석 보고서 생성
- `--fix` - 자동 최적화 적용
- `--target-size` - 목표 번들 크기 (KB)
- `--report` - 상세 보고서 생성

## Implementation

번들 최적화를 위해 다음을 수행합니다:

1. **번들 분석**
   - 현재 번들 크기 측정
   - 의존성별 크기 분석
   - 중복 모듈 탐지
   - 사용하지 않는 코드 식별

2. **코드 분할 최적화**
   - 라우트 기반 분할
   - 컴포넌트 레벨 분할
   - 동적 임포트 적용
   - 공통 청크 최적화

3. **의존성 최적화**
   - 대체 가능한 경량 라이브러리 제안
   - Tree shaking 개선
   - 번들 제외 설정
   - Peer dependencies 최적화

4. **에셋 최적화**
   - 이미지 압축 및 포맷 변환
   - 폰트 서브셋 생성
   - SVG 최적화
   - CSS 압축

5. **빌드 설정 개선**
   - Webpack/Vite 설정 최적화
   - 압축 알고리즘 개선
   - 캐싱 전략 강화
   - 소스맵 최적화

최적화 기법:
- Dynamic imports
- React.lazy()
- Bundle splitting
- Tree shaking
- Dead code elimination
- Minification
- Compression

결과물:
- 번들 크기 비교 (전/후)
- 최적화 적용 내역
- 성능 개선 지표
- 추가 최적화 제안
- 번들 분석 시각화
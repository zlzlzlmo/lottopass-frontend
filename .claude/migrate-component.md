# /migrate-component

레거시 컴포넌트를 최신 패턴으로 마이그레이션합니다.

## 사용법
```
/migrate-component <source-path> [options]
```

## 예시
```
/migrate-component src/pages/home/HomePage.tsx --to-app-router
/migrate-component src/components/Card.jsx --to-typescript
```

## 동작
1. 컴포넌트 코드 분석
2. 마이그레이션 필요사항 식별
3. 변환 계획 생성
4. 코드 자동 변환
5. 타입 안전성 검증
6. 테스트 업데이트

## 옵션
- `--to-app-router`: Next.js App Router로 마이그레이션
- `--to-typescript`: TypeScript로 변환
- `--to-react-19`: React 19 패턴 적용
- `--dry-run`: 변경사항 미리보기만
- `--preserve-styles`: 스타일 유지
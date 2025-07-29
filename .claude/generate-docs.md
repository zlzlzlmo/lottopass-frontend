# /generate-docs

코드베이스의 문서를 자동 생성합니다.

## 사용법
```
/generate-docs [scope] [options]
```

## 예시
```
/generate-docs packages/core --format markdown
/generate-docs apps/web/src/components --storybook
```

## 동작
1. 코드 구조 분석
2. JSDoc/TSDoc 주석 파싱
3. 컴포넌트 Props 문서화
4. API 엔드포인트 문서화
5. 사용 예시 추출
6. 문서 파일 생성

## 옵션
- `--format <type>`: 출력 형식 (markdown, html, json)
- `--storybook`: Storybook 스토리 생성
- `--api-only`: API 문서만 생성
- `--components-only`: 컴포넌트 문서만 생성
- `--output <dir>`: 출력 디렉토리 지정
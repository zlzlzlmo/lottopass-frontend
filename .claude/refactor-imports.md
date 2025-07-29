# /refactor-imports

프로젝트의 import 문을 정리하고 최적화합니다.

## 사용법
```
/refactor-imports [path] [options]
```

## 예시
```
/refactor-imports src --fix
/refactor-imports apps/web --to-aliases
```

## 동작
1. 사용하지 않는 import 제거
2. import 순서 정리
3. 상대 경로를 절대 경로로 변환
4. 중복 import 병합
5. barrel export 최적화
6. 순환 참조 감지

## 옵션
- `--fix`: 자동으로 수정 적용
- `--to-aliases`: 경로 별칭 사용으로 변환
- `--sort-order <order>`: import 정렬 순서 지정
- `--remove-unused`: 미사용 import만 제거
- `--check-circular`: 순환 참조만 검사
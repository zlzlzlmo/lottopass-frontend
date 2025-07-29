# Claude Code Custom Commands

이 디렉토리는 LottoPass 프로젝트를 위한 커스텀 Claude Code 명령어들을 포함합니다.

## 명령어 구조

각 명령어는 다음 구조를 따릅니다:
- 명령어 이름과 설명
- 사용법 및 예시
- 동작 순서
- 사용 가능한 옵션
- AI 프롬프트 템플릿 (해당되는 경우)

## 명령어 사용 방법

Claude Code 세션에서:
```
/[command-name] [arguments] [options]
```

예시:
```
/init-feature user-profile --web --with-store
/test-component src/components/Button.tsx --coverage
```

## 명령어 개발 가이드

새 명령어를 추가할 때:

1. **명명 규칙**
   - 동사-명사 형식 사용 (예: `test-component`, `optimize-bundle`)
   - 명확하고 직관적인 이름 선택

2. **문서 구조**
   - 목적과 기능을 명확히 설명
   - 실제 사용 예시 포함
   - 모든 옵션 문서화
   - AI 활용 시 프롬프트 템플릿 제공

3. **통합 고려사항**
   - 다른 명령어와의 연계성
   - 프로젝트 규칙 준수 (CODE_STYLE.md 등)
   - 에러 처리 및 피드백

## 명령어 테스트

명령어 테스트 시:
```bash
# Dry run 모드 활용
/[command-name] --dry-run

# 상세 출력 확인
/[command-name] --verbose

# 특정 파일로 테스트
/[command-name] test-file.ts --debug
```

## 기여 가이드라인

1. 새 명령어는 팀 리뷰 필요
2. 기존 패턴과 일관성 유지
3. 충분한 예시와 문서 제공
4. 성능과 확장성 고려

## 관련 문서
- [COMMANDS_INDEX.md](../COMMANDS_INDEX.md) - 전체 명령어 목록
- [AI_DEVELOPMENT.md](../AI_DEVELOPMENT.md) - AI 활용 가이드
- [CLAUDE.md](../CLAUDE.md) - 프로젝트 가이드
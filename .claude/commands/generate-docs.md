# /generate-docs

코드베이스의 문서를 자동으로 생성합니다.

## Usage
```
/generate-docs [scope] [options]
```

## Options
- `--format` - 문서 형식: `markdown`, `html`, `pdf`
- `--include-examples` - 사용 예제 포함
- `--api-docs` - API 문서 생성
- `--components-docs` - 컴포넌트 문서 생성

## Implementation

다음과 같은 문서를 자동으로 생성합니다:

1. **API 문서**
   ```markdown
   ## DrawService
   
   로또 추첨 데이터를 관리하는 서비스
   
   ### Methods
   
   #### getLatestDraw()
   최신 추첨 정보를 가져옵니다.
   
   **Returns:** `Promise<DrawResult>`
   
   **Example:**
   \`\`\`typescript
   const latest = await drawService.getLatestDraw();
   console.log(latest.drwNo); // 1148
   \`\`\`
   ```

2. **컴포넌트 문서**
   ```markdown
   ## LottoBall
   
   로또 번호를 시각적으로 표현하는 컴포넌트
   
   ### Props
   | Name | Type | Default | Description |
   |------|------|---------|-------------|
   | number | number | - | 표시할 번호 (1-45) |
   | size | 'sm' \| 'md' \| 'lg' | 'md' | 공 크기 |
   | isBonus | boolean | false | 보너스 번호 여부 |
   
   ### Usage
   \`\`\`tsx
   <LottoBall number={7} size="lg" />
   \`\`\`
   ```

3. **아키텍처 문서**
   - 프로젝트 구조
   - 데이터 흐름
   - 상태 관리 전략
   - 라우팅 구조
   - 빌드 프로세스

4. **개발 가이드**
   - 설치 방법
   - 환경 설정
   - 개발 워크플로우
   - 테스팅 가이드
   - 배포 프로세스

5. **타입 문서**
   ```typescript
   /**
    * 로또 추첨 결과
    * @interface DrawResult
    */
   interface DrawResult {
     /** 회차 번호 */
     drwNo: number;
     /** 추첨일 */
     drwNoDate: string;
     /** 당첨 번호 1-6 */
     drwtNo1: number;
     // ...
   }
   ```

문서 생성 기능:
- JSDoc 주석 파싱
- TypeScript 타입 추출
- 사용 예제 자동 생성
- 의존성 그래프 생성
- 변경 이력 추적

결과물:
- README.md 업데이트
- API 참조 문서
- 컴포넌트 카탈로그
- 아키텍처 다이어그램
- 개발자 가이드
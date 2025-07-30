# /refactor-imports

Import 문을 정리하고 최적화합니다.

## Usage
```
/refactor-imports [path] [options]
```

## Options
- `--fix` - 자동으로 수정 적용
- `--sort` - Import 정렬 방식: `alphabetical`, `grouped`, `custom`
- `--remove-unused` - 사용하지 않는 import 제거
- `--absolute-paths` - 절대 경로로 변환

## Implementation

Import 문을 다음과 같이 최적화합니다:

1. **Import 정리**
   - 사용하지 않는 import 제거
   - 중복 import 제거
   - 와일드카드 import 개선
   - 순환 참조 탐지

2. **Import 정렬**
   ```typescript
   // 1. React 관련
   import React, { useState, useEffect } from 'react';
   
   // 2. 외부 라이브러리
   import { useQuery } from '@tanstack/react-query';
   import { format } from 'date-fns';
   
   // 3. 내부 패키지 (모노레포)
   import { Button } from '@lottopass/ui';
   import { useAuth } from '@lottopass/stores';
   
   // 4. 상대 경로 import
   import { Header } from './components/Header';
   import { utils } from './utils';
   
   // 5. 스타일 import
   import styles from './styles.module.scss';
   ```

3. **경로 최적화**
   - 상대 경로 → 절대 경로
   - 경로 별칭 활용
   - 배럴 export 최적화
   - 인덱스 파일 활용

4. **번들 최적화**
   - Tree shaking 개선
   - 동적 import 제안
   - Lazy loading 적용
   - 청크 분할 최적화

5. **타입 import 개선**
   ```typescript
   // 타입 전용 import 분리
   import type { User, Product } from './types';
   import { getUserData } from './api';
   ```

자동 수정 사항:
- Import 그룹화 및 정렬
- 사용하지 않는 import 제거
- 경로 별칭 적용
- 타입 import 분리
- 코드 스타일 정리

결과물:
- 정리된 import 문
- 제거된 import 목록
- 번들 크기 개선 예상치
- 순환 참조 보고서
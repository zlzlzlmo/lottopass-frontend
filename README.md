# LottoPass Frontend

> **당신의 로또 번호를 똑똑하게 관리하고 분석할 수 있는 프론트엔드 애플리케이션**

LottoPass는 로또 번호 생성 및 데이터 분석 도구를 제공하는 플랫폼입니다. 이 레포지토리는 LottoPass의 프론트엔드 애플리케이션을 위한 코드베이스를 포함합니다.

---

**현재 버전**: 0.1.0

## 🚀 **프로젝트 미리보기**

[LottoPass 배포 사이트](https://lottopass.co.kr)

---

## 📌 **주요 기능**

- **로또 번호 생성**: 조건에 맞는 로또 번호를 추천.
- **사용자 친화적인 UI**: 직관적인 디자인으로 누구나 쉽게 사용 가능.

---

## 🛠 **기술 스택**

- **React**: 사용자 인터페이스 개발
- **TypeScript**: 타입 안전성을 보장하는 JavaScript 확장
- **Vite**: 빠른 개발 환경
- **Context + Reducer**: 상태 관리
- **Axios**: API 통신
- **Three.js**: 3D 렌더링
- **SCSS MODULE**: 스타일링

---

## 📂 **프로젝트 구조**

```
lottopass-frontend/
├── public/            # 정적 파일
├── src/
│   ├── api/          # API 요청 모듈
│   ├── assets/       # 이미지 및 정적 자원
│   ├── components/   # 재사용 가능한 UI 컴포넌트
│   │   ├── common/   # 공통 컴포넌트 (버튼 등)
│   │   └── layout/   # 레이아웃 컴포넌트 (헤더, 푸터 등)
│   ├── constants/    # 상수 및 설정값
│   ├── context/      # 전역 상태 관리 (React Context API)
│   ├── pages/        # 주요 화면 구성 (홈, 결과 페이지 등)
│   ├── styles/       # SCSS 스타일 파일
│   ├── utils/        # 유틸리티 함수
│   └── App.tsx       # 메인 App 컴포넌트
├── .env       # 환경 변수 샘플
└── package.json       # 프로젝트 의존성 관리
```

---

## 🧑‍💻 **설치 및 실행**

### 1. 레포지토리 클론

```bash
git clone https://github.com/zlzlzlmo/lottopass-frontend.git
cd lottopass-frontend
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 생성하고 필요한 값을 입력하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

### 5. 빌드

```bash
npm run build
```

---

## 📡 **API 명세**

프론트엔드는 다음 API와 통신합니다:

### 1. 전체 로또 추첨 데이터 가져오기

- **URL**: `/api/lotto/all`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "drawNumber": 1,
        "date": "2023-01-01",
        "winningNumbers": [1, 2, 3, 4, 5, 6],
        "bonusNumber": 7,
        "prizeStatistics": {
          "totalPrize": 1000000000,
          "firstWinAmount": 200000000,
          "firstAccumAmount": 600000000,
          "firstPrizeWinnerCount": 3
        }
      }
    ]
  }
  ```

### 2. 특정 회차 로또 데이터 가져오기

- **URL**: `/api/lotto/draw/:drawNumber`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "drawNumber": 123,
      "date": "2022-03-01",
      "winningNumbers": [5, 8, 13, 22, 29, 33],
      "bonusNumber": 10,
      "prizeStatistics": {
        "totalPrize": 800000000,
        "firstWinAmount": 160000000,
        "firstAccumAmount": 480000000,
        "firstPrizeWinnerCount": 3
      }
    }
  }
  ```

---

## ✨ **향후 업데이트**

- **로또 번호 저장 기능**
- **유저 인증 및 데이터 관리**
- **더 정교한 통계 분석**
- **데이터 시각화**
- **로또 당첨 지역 위치 안내 및 네비게이션**

---

## 📜 **라이센스**

이 프로젝트는 MIT 라이센스를 따릅니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

---

## 📬 **문의**

프로젝트와 관련된 문의 사항은 다음 이메일로 연락주세요:

- Email: zlzlzlmo60@gmail.com

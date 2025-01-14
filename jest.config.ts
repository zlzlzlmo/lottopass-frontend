module.exports = {
  preset: "ts-jest", // ts-jest를 사용하여 TypeScript 처리
  testEnvironment: "node", // 테스트 환경 설정
  transform: {
    "^.+\\.tsx?$": "ts-jest", // TypeScript 파일을 Jest에서 처리
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Vite alias와 동기화
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"], // 처리 가능한 확장자
};

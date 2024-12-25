import React, { createContext, useCallback, useContext, useState } from "react";

interface LottoNumberContextType {
  excludedNumbers: number[];
  setExcludedNumbers: (numbers: number[]) => void;
  generateNumbers: () => number[]; // 결과 번호 생성 함수
  resetExcludedNumbers: () => void;
}

const LottoNumberContext = createContext<LottoNumberContextType | undefined>(
  undefined
);

export const LottoNumberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);

  // 제외된 번호를 뺀 나머지 번호들에서 번호 생성
  const generateNumbers = () => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const availableNumbers = allNumbers.filter(
      (num) => !excludedNumbers.includes(num)
    );
    const randomNumbers: number[] = [];

    while (randomNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const number = availableNumbers[randomIndex];
      if (!randomNumbers.includes(number)) randomNumbers.push(number);
    }
    return randomNumbers.sort((a, b) => a - b); // 정렬
  };

  const resetExcludedNumbers = useCallback(() => {
    setExcludedNumbers(() => {
      // 기존 상태 초기화 로직
      return [];
    });
  }, []); // 의존성 배열을 비워 메모이제이션

  return (
    <LottoNumberContext.Provider
      value={{
        excludedNumbers,
        setExcludedNumbers,
        generateNumbers,
        resetExcludedNumbers,
      }}
    >
      {children}
    </LottoNumberContext.Provider>
  );
};

export const useLottoNumber = () => {
  const context = useContext(LottoNumberContext);
  if (!context) {
    throw new Error("LottoNumberProvider로 감싸져 있지 않습니다.");
  }
  return context;
};

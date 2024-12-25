import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface LottoNumberContextType {
  excludedNumbers: number[];
  requiredNumbers: number[];
  handleExcludedNumbers: (numbers: number[]) => void;
  handleRequiredNumbers: (numbers: number[]) => void;
  generateNumbers: () => number[]; // 결과 번호 생성 함수
  resetNumbers: () => void;
}

const LottoNumberContext = createContext<LottoNumberContextType | undefined>(
  undefined
);

export const LottoNumberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [requiredNumbers, setRequiredNumbers] = useState<number[]>([]);

  // 제외된 번호를 뺀 나머지 번호들에서 번호 생성
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateNumbers = () => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

    const availableNumbers = allNumbers.filter((num) => {
      if (requiredNumbers.length <= 0) return !excludedNumbers.includes(num);
      return requiredNumbers.includes(num);
    });

    const randomNumbers: number[] = [];

    while (randomNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const number = availableNumbers[randomIndex];
      if (!randomNumbers.includes(number)) randomNumbers.push(number);
    }

    return randomNumbers.sort((a, b) => a - b); // 정렬
  };

  const handleExcludedNumbers = (numbers: number[]) => {
    setExcludedNumbers(() => {
      return numbers;
    });
    setRequiredNumbers([]);
  };

  const handleRequiredNumbers = (numbers: number[]) => {
    setRequiredNumbers(() => {
      return numbers;
    });
    setExcludedNumbers([]);
  };

  const resetNumbers = useCallback(() => {
    setExcludedNumbers([]);
    setRequiredNumbers([]);
  }, []);

  const value = useMemo(
    () => ({
      excludedNumbers,
      requiredNumbers,
      handleExcludedNumbers,
      handleRequiredNumbers,
      generateNumbers,
      resetNumbers,
    }),
    [excludedNumbers, requiredNumbers, generateNumbers, resetNumbers]
  );

  return (
    <LottoNumberContext.Provider value={value}>
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

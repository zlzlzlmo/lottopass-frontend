import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { getRandomNum, shuffle } from "../utils/number";

interface LottoNumberContextType {
  roundCount: number;
  minimumRequiredCount: number;
  excludedNumbers: number[];
  requiredNumbers: number[];
  handleExcludedNumbers: (numbers: number[]) => void;
  handleRequiredNumbers: (numbers: number[]) => void;
  generateNumbers: () => number[]; // 결과 번호 생성 함수
  resetNumbers: () => void;
  setRoundCount: React.Dispatch<React.SetStateAction<number>>;
  setMinimumRequiredCount: React.Dispatch<React.SetStateAction<number>>;
}

const LottoNumberContext = createContext<LottoNumberContextType | undefined>(
  undefined
);

export const LottoNumberProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initialRoundCount = 5;
  const initialMinimumRequiredCount = 6;

  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [requiredNumbers, setRequiredNumbers] = useState<number[]>([]);
  const [minimumRequiredCount, setMinimumRequiredCount] = useState<number>(
    initialMinimumRequiredCount
  );
  const [roundCount, setRoundCount] = useState<number>(initialRoundCount);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generateNumbers = () => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

    const randomCount = getRandomNum(minimumRequiredCount, 6);

    const shuffledRequiredNumbers = shuffle(requiredNumbers);
    const uniquerRequiredNumbers = [...new Set(shuffledRequiredNumbers)].slice(
      0,
      randomCount
    );

    const availableNumbers = new Set(
      allNumbers.filter((num) => {
        if (requiredNumbers.length <= 0) return !excludedNumbers.includes(num);
        return uniquerRequiredNumbers.includes(num);
      })
    );

    while (availableNumbers.size < 6) {
      const randomNum = getRandomNum(1, 45);
      availableNumbers.add(randomNum);
    }

    const randomNumbers: number[] = [];

    while (randomNumbers.length < 6) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.size);
      const number = [...availableNumbers][randomIndex];
      if (!randomNumbers.includes(number)) randomNumbers.push(number);
    }

    return randomNumbers.sort((a, b) => a - b); // 정렬
  };

  const handleExcludedNumbers = useCallback((numbers: number[]) => {
    setExcludedNumbers(numbers);
    setRequiredNumbers([]);
  }, []);

  const handleRequiredNumbers = useCallback((numbers: number[]) => {
    setRequiredNumbers(numbers);
    setExcludedNumbers([]);
  }, []);

  const resetNumbers = useCallback(() => {
    setExcludedNumbers([]);
    setRequiredNumbers([]);
    setMinimumRequiredCount(initialMinimumRequiredCount);
    setRoundCount(initialRoundCount);
  }, []);

  const value = useMemo<LottoNumberContextType>(
    () => ({
      excludedNumbers,
      requiredNumbers,
      handleExcludedNumbers,
      handleRequiredNumbers,
      generateNumbers,
      resetNumbers,
      setMinimumRequiredCount,
      minimumRequiredCount,
      setRoundCount,
      roundCount,
    }),
    [
      excludedNumbers,
      requiredNumbers,
      handleExcludedNumbers,
      handleRequiredNumbers,
      generateNumbers,
      resetNumbers,
      minimumRequiredCount,
      roundCount,
    ]
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

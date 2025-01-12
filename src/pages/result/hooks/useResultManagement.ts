import { message } from "antd";
import { useEffect, useState } from "react";
import { useGenerateNumbers } from "./useGenerateNumbers";

export const useResultManagement = ({
  maxResultsLen,
}: {
  maxResultsLen: number;
}) => {
  const { allDraws, isLoading, isError, generateNumbers } =
    useGenerateNumbers();
  const [results, setResults] = useState<number[][]>([]);

  const addNewCombination = () => {
    if (results.length >= maxResultsLen) {
      message.warning(`최대 ${maxResultsLen}줄까지만 추가할 수 있습니다.`);
      return;
    }

    const newResult = generateNumbers();
    setResults((prevResults) => [...prevResults, newResult]);
  };

  const deleteCombination = (index: number) => {
    setResults((prevResults) => prevResults.filter((_, i) => i !== index));
    message.success("번호 조합이 삭제되었습니다.");
  };

  const regenerateCombination = (index: number) => {
    setResults((prevResults) =>
      prevResults.map((numbers, i) =>
        i === index ? generateNumbers() : numbers
      )
    );
    message.info("번호가 다시 생성되었습니다.");
  };

  useEffect(() => {
    if (allDraws && allDraws?.length > 0) {
      const newResults = Array.from({ length: 5 }, () => generateNumbers());
      setResults(newResults);
    }
  }, [allDraws]);

  return {
    results,
    addNewCombination,
    deleteCombination,
    regenerateCombination,
    isLoading,
    isError,
  };
};

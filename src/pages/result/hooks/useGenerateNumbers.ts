import { useAllDraws } from "@/features/draw/hooks/useAllDraws";
import { parseQueryParams } from "@/pages/numberGeneration/components/numberActionButtons/utils";
import { QueryParams, setRequiredNumbers } from "../result-service";
import { useSearchParams } from "react-router-dom";
import { getRandomNum, shuffle } from "@/utils/number";
import { useCallback } from "react";

export const useGenerateNumbers = () => {
  const [searchParams] = useSearchParams();

  const { data: allDraws, isLoading, isError } = useAllDraws();
  const queryParams = parseQueryParams(searchParams) as QueryParams;

  const generateNumbers = useCallback((): number[] => {
    const minCount = queryParams.minCount ?? 6;
    if (!allDraws || allDraws.length <= 0) return [];
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

    const requiredNumbers = setRequiredNumbers(queryParams, allDraws, allDraws);
    const len = requiredNumbers.length;
    const randomIdx = getRandomNum(Math.min(Number(minCount), len), len);

    const availableNumbers = shuffle(requiredNumbers).slice(0, randomIdx);

    return Array.from(new Set([...availableNumbers, ...shuffle(allNumbers)]))
      .slice(0, 6)
      .sort((a, b) => a - b);
  }, [allDraws, queryParams]);

  return { allDraws, isLoading, isError, generateNumbers };
};

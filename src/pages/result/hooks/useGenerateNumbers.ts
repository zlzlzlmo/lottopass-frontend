import { useAllDraws } from "@/features/draw/hooks/useAllDraws";
import { parseQueryParams } from "@/pages/numberGeneration/components/numberActionButtons/utils";
import { useSearchParams } from "react-router-dom";
import { MinMaxGeneratorByRank } from "@/utils/combinationGenerator/minMaxGeneratorByRank/minMaxGeneratorByRank";
import { PopupType } from "@/components/popup/PopupManager";
import { ConfirmType } from "@/pages/numberGeneration/components/numberActionButtons/NumberActionButtons";
import { SelectedGenerator } from "@/utils/combinationGenerator/selectedGenerator/selectedGenerator";
import { DrawMinCountGenerator } from "@/utils/combinationGenerator/drawMinCountGenerator/drawMinCountGeneractor";
import { MinMaxGenerator } from "@/utils/combinationGenerator/minMaxGenerator/minMaxGenerator";
import { EvenOddGenerator } from "@/utils/combinationGenerator/evenOddGenerator/evenOddGenerator";
import { useEffect, useState } from "react";
import { LottoDraw } from "lottopass-shared";

export interface QueryParams {
  selectedNumbers?: number[];
  confirmType?: ConfirmType;
  drawCount?: number;
  minCount?: number;
  min?: number;
  max?: number;
  even?: number;
  odd?: number;
  type?: PopupType;
  topNumber?: number;
}

interface useGenerateNumbersOptions {
  slicedStart?: number;
}

export const useGenerateNumbers = ({
  slicedStart = 0,
}: useGenerateNumbersOptions) => {
  const [searchParams] = useSearchParams();

  const { data: allDraws, isLoading, isError, error } = useAllDraws();
  const [filteredDraws, setFilteredDraws] = useState<LottoDraw[]>([]);
  const queryParams = parseQueryParams(searchParams) as QueryParams;
  const {
    type,
    confirmType,
    selectedNumbers,
    drawCount,
    minCount,
    min,
    max,
    even,
    odd,
    topNumber,
  } = queryParams;

  const getCombinationByConfirmType = (
    param: Record<ConfirmType, number[]>
  ): number[] => {
    if (confirmType === "require") return param.require;
    return param.exclude;
  };

  const generateNumbers = () => {
    if (!filteredDraws) return;

    let result: number[] = [];

    // 필수, 제외번호 직접 선택
    if (type === "numberSelect" && selectedNumbers) {
      const generator = new SelectedGenerator(filteredDraws);
      const require = generator.getRequiredNumbers(selectedNumbers);
      const exclude = generator.getExcludedNumbers(selectedNumbers);
      result = getCombinationByConfirmType({ require, exclude });
    }

    // 최근 N 회차 최소 K 갯수 선택 (출현, 미출현)
    if (type === "numberControl" && drawCount && minCount) {
      const generator = new DrawMinCountGenerator(filteredDraws);
      const require = generator.getRandomCombinationWithMinCount(
        drawCount,
        minCount
      );
      const exclude = generator.getRandomUnappearedNumbers(drawCount, minCount);
      result = getCombinationByConfirmType({ require, exclude });
    }

    // 특정 회차 최소 갯수 선택 (출현, 미출현)
    if (type === "rangeSelect" && min && max) {
      const generator = new MinMaxGenerator(filteredDraws, min, max);
      const require = generator.generateAppearedNumbers();
      const exclude = generator.generateUnappearedNumbers();

      result = getCombinationByConfirmType({ require, exclude });
    }

    // 짝수 N개 홀수 K개 조합
    if (type === "evenOddControl" && even && odd) {
      const generator = new EvenOddGenerator(filteredDraws);
      result = generator.generateAppearedNumbers(even, odd);
    }

    if (
      (type === "rangeAndTopNumberSelect" ||
        type === "rangeAndBottomNumberSelect") &&
      min &&
      max &&
      topNumber
    ) {
      const generator = new MinMaxGeneratorByRank(filteredDraws, min, max);

      if (type === "rangeAndTopNumberSelect")
        result = generator.generateTopAppearedNumbers(topNumber);
      if (type === "rangeAndBottomNumberSelect")
        result = generator.generateBottomAppearedNumbers(topNumber);
    }

    return result.sort((a, b) => a - b);
  };

  useEffect(() => {
    if (allDraws?.length) {
      const startIndex = Math.min(slicedStart + 1, allDraws.length);
      setFilteredDraws(allDraws.slice(startIndex));
    }
  }, [slicedStart, allDraws]);

  return {
    filteredDraws,
    allDraws,
    isLoading,
    isError,
    error,
    generateNumbers,
  };
};

import { PopupType } from "@/components/popup/PopupManager";
import { LottoDraw } from "lottopass-shared";
import { getRecentDraws } from "../numberGeneration/components/numberActionButtons/utils";

export interface QueryParams {
  selectedNumbers?: number[];
  confirmType?: "exclude" | "require";
  drawCount?: number;
  minCount?: number;
  min?: number;
  max?: number;
}

const TOTAL_NUMBERS = Array.from({ length: 45 }, (_, i) => i + 1);

export const filterNumbers = ({
  numbers,
  confirmType,
}: {
  numbers: number[];
  confirmType: "require" | "exclude";
}): number[] => {
  return confirmType === "require"
    ? numbers
    : TOTAL_NUMBERS.filter((num) => !numbers.includes(num));
};

export const getCombinationType = (
  params: QueryParams
): {
  type: PopupType;
  data: QueryParams;
} => {
  const { selectedNumbers, confirmType, drawCount, minCount, min, max } =
    params;
  if (selectedNumbers && confirmType)
    return {
      type: "numberSelect",
      data: { selectedNumbers, confirmType },
    };
  else if (drawCount && minCount && confirmType)
    return {
      type: "numberControl",
      data: { drawCount, minCount, confirmType },
    };
  return {
    type: "rangeSelect",
    data: { min, max },
  };
};

export const setRequiredNumbers = (
  queryParams: QueryParams,
  allDraws: LottoDraw[],
  rawAllDraws: LottoDraw[]
): number[] => {
  const { type, data } = getCombinationType(queryParams);
  const { selectedNumbers, confirmType, drawCount, min, max } = data;
  if (type === "numberSelect") {
    return filterNumbers({
      numbers: selectedNumbers!,
      confirmType: confirmType!,
    });
  } else if (type === "numberControl") {
    const recentNumbers = getRecentDraws(allDraws, drawCount!).flatMap(
      (round) => round.winningNumbers
    );
    const uniqueNumbers = Array.from(new Set(recentNumbers)).map(Number);

    return filterNumbers({
      numbers: uniqueNumbers,
      confirmType: confirmType!,
    });
  }

  const draws = rawAllDraws?.filter(
    ({ drawNumber }) => drawNumber >= min! && drawNumber <= max!
  );

  const winningNumbers = draws
    ?.map(({ winningNumbers }) => winningNumbers)
    .flat()
    .map(Number);
  const uniqueNumbers = [...new Set(winningNumbers)];

  return uniqueNumbers;
};

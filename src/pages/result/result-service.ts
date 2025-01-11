import { PopupType } from "@/components/popup/PopupManager";
import { LottoDraw } from "lottopass-shared";
import { getRecentDraws } from "../numberGeneration/components/numberActionButtons/utils";
import { ConfirmType } from "../numberGeneration/components/numberActionButtons/NumberActionButtons";
import { shuffle } from "@/utils/number";

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

export const setRequiredNumbers = (
  queryParams: QueryParams,
  allDraws: LottoDraw[],
  rawAllDraws: LottoDraw[]
): number[] => {
  const { selectedNumbers, confirmType, drawCount, min, max, type } =
    queryParams;
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
  } else if (type === "evenOddControl") {
    const evens = shuffle(
      TOTAL_NUMBERS.filter((number) => number % 2 === 0)
    ).slice(0, queryParams.even ?? 0);

    const odds = shuffle(
      TOTAL_NUMBERS.filter((number) => number % 2 === 1)
    ).slice(0, queryParams.odd ?? 0);

    return filterNumbers({
      numbers: [...evens, ...odds],
      confirmType: "require",
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

  return filterNumbers({ numbers: uniqueNumbers, confirmType: confirmType! });
};

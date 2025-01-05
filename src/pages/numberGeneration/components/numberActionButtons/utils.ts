import { LottoDraw } from "lottopass-shared";

export const createSearchParams = (
  numbers: number[],
  minCount?: number
): URLSearchParams => {
  const params = new URLSearchParams({
    requiredNumbers: numbers.join(","),
  });

  if (minCount !== undefined) {
    params.append("minCount", minCount.toString());
  }

  return params;
};

export const getRecentDraws = (allDraws: LottoDraw[], roundCount: number) =>
  allDraws.slice(0, roundCount);

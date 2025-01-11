/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const createQueryParams = (params: Record<string, any>) => {
  const urlSearchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        urlSearchParams.append(key, JSON.stringify(value));
      } else {
        urlSearchParams.append(key, String(value));
      }
    }
  });

  return `?${urlSearchParams.toString()}`;
};

export const parseQueryParams = (query: Record<string, any>) => {
  const params = new URLSearchParams(query);
  const result: Record<string, any> = {};

  params.forEach((value, key) => {
    try {
      result[key] = JSON.parse(value);
    } catch {
      result[key] = value;
    }
  });

  return result;
};

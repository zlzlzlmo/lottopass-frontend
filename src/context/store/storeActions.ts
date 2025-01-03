import { UniqueRegion } from "lottopass-shared";

export const SET_REGIONS_BY_PROVINCE = "SET_REGIONS_BY_PROVINCE" as const;
export const SET_SELECTED_REGION = "SET_SELECTED_REGION" as const;

export const setRegionsByProvince = (
  payload: Record<string, UniqueRegion[]>
) => ({
  type: SET_REGIONS_BY_PROVINCE,
  payload,
});

export const setSelectedRegion = (key: "province" | "city", value: string) => ({
  type: SET_SELECTED_REGION,
  payload: { key, value },
});

export type Action =
  | ReturnType<typeof setRegionsByProvince>
  | ReturnType<typeof setSelectedRegion>;

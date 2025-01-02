import { MergedLocation } from "./storeReducer";

// 액션 타입 정의
export const SET_LOCATION = "SET_LOCATION" as const;
export const SET_UNIQUE_REGION = "SET_UNIQUE_REGION" as const;
export const SET_SELECTED_REGION = "SET_SELECTED_REGION" as const;
export const SET_SELECTED_CITY = "SET_SELECTED_CITY" as const;
export const SET_FILTERED_CITIES = "SET_FILTERED_CITIES" as const;
export const SET_MERGED_LOCATIONS = "SET_MERGED_LOCATIONS" as const;

// 액션 생성자
export const setLocation = (payload: { lat: number; lng: number }) => ({
  type: SET_LOCATION,
  payload,
});

export const setUniqueRegion = (payload: Record<string, string[]>) => ({
  type: SET_UNIQUE_REGION,
  payload,
});

export const setSelectedRegion = (payload: string) => ({
  type: SET_SELECTED_REGION,
  payload,
});

export const setSelectedCity = (payload: string) => ({
  type: SET_SELECTED_CITY,
  payload,
});

export const setFilteredCities = (payload: string[]) => ({
  type: SET_FILTERED_CITIES,
  payload,
});

export const setMergedLocations = (payload: MergedLocation[]) => ({
  type: SET_MERGED_LOCATIONS,
  payload,
});

export type Action =
  | ReturnType<typeof setLocation>
  | ReturnType<typeof setUniqueRegion>
  | ReturnType<typeof setSelectedRegion>
  | ReturnType<typeof setSelectedCity>
  | ReturnType<typeof setFilteredCities>
  | ReturnType<typeof setMergedLocations>;

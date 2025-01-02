import { Action } from "./storeActions";

export type MergedLocation = {
  storeName: string;
  address: string;
  district: string;
  coordinates?: { lat: number; lng: number };
  drawNumbers: number[];
  distance?: number;
};

export type State = {
  currentLocation: { lat: number; lng: number } | null;
  uniqueRegion: Record<string, string[]>;
  selectedRegion: string;
  selectedCity: string;
  filteredCities: string[];
  mergedLocations: MergedLocation[];
};

export const initialState: State = {
  currentLocation: null,
  uniqueRegion: {},
  selectedRegion: "",
  selectedCity: "",
  filteredCities: [],
  mergedLocations: [],
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, currentLocation: action.payload };
    case "SET_UNIQUE_REGION":
      return { ...state, uniqueRegion: action.payload };
    case "SET_SELECTED_REGION":
      return { ...state, selectedRegion: action.payload };
    case "SET_SELECTED_CITY":
      return { ...state, selectedCity: action.payload };
    case "SET_FILTERED_CITIES":
      return { ...state, filteredCities: action.payload };
    case "SET_MERGED_LOCATIONS":
      return { ...state, mergedLocations: action.payload };
    default:
      throw new Error("Unhandled action type");
  }
};

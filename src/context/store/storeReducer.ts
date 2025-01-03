import { UniqueRegion } from "lottopass-shared";
import { Action } from "./storeActions";

export type State = {
  regionsByProvince: Record<string, UniqueRegion[]> | null;
  selectedRegion: {
    province: string | null;
    city?: string;
  };
};

export const initialState: State = {
  regionsByProvince: null,
  selectedRegion: {
    province: null,
  },
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_REGIONS_BY_PROVINCE":
      return { ...state, regionsByProvince: action.payload };
    case "SET_SELECTED_REGION":
      return {
        ...state,
        selectedRegion: {
          ...state.selectedRegion,
          [action.payload.key]: action.payload.value,
        },
      };
    default:
      return state;
  }
};

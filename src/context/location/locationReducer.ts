import { Action } from "./locationActions";

export type State = {
  currentLocation: { lat: number; lng: number } | null;
};

export const initialState: State = {
  currentLocation: null,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_MY_LOCATION":
      return { ...state, currentLocation: action.payload };
    default:
      throw new Error("Unhandled action type");
  }
};

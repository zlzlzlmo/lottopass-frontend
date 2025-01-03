import React, { createContext, useReducer, ReactNode } from "react";
import { Action } from "./locationActions";
import { initialState, reducer, State } from "./locationReducer";

type LocationContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  calculateDistanceFromMyLocation: (target?: {
    lat: number;
    lng: number;
  }) => number;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const calculateDistanceFromMyLocation = (target?: {
    lat: number;
    lng: number;
  }): number => {
    if (!target) return Infinity;
    const current = state.currentLocation;
    if (!current) return Infinity;

    const R = 6371;
    const dLat = ((target.lat - current.lat) * Math.PI) / 180;
    const dLng = ((target.lng - current.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((current.lat * Math.PI) / 180) *
        Math.cos((target.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <LocationContext.Provider
      value={{ state, dispatch, calculateDistanceFromMyLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useGeoLocation = (): LocationContextType => {
  const context = React.useContext(LocationContext);
  if (!context) {
    throw new Error("useGeoLocation must be used within a LocationProvider");
  }
  return context;
};

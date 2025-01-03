import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { Action, setRegionsByProvince } from "./storeActions";
import { initialState, reducer, State } from "./storeReducer";
import { getUniqueRegions } from "../../api/axios/regionApi";
import { UniqueRegion } from "lottopass-shared";
import { groupBy } from "../../utils/group";

type StoreContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const groupRegionsByProvince = async () => {
    try {
      const res = await getUniqueRegions();
      if (res.status === "success") {
        const gr = groupBy<UniqueRegion>(res.data, "province");
        dispatch(setRegionsByProvince(gr));
      }
    } catch (error) {
      console.error("Failed to fetch regions:", error);
    }
  };

  useEffect(() => {
    groupRegionsByProvince();
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

import { LocationProvider } from "./\blocation/locationContext";
import { LottoProvider } from "./lottoNumber/lottoNumberContext";
import { StoreProvider } from "./store/storeContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <StoreProvider>
      <LocationProvider>
        <LottoProvider>{children}</LottoProvider>
      </LocationProvider>
    </StoreProvider>
  );
};

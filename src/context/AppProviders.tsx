import { LocationProvider } from "./\blocation/locationContext";
import { LottoProvider } from "./lottoNumber/lottoNumberContext";
import { RoundsProvider } from "./rounds/roundsContext";
import { StoreProvider } from "./store/storeContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <RoundsProvider>
      <StoreProvider>
        <LocationProvider>
          <LottoProvider>{children}</LottoProvider>
        </LocationProvider>
      </StoreProvider>
    </RoundsProvider>
  );
};

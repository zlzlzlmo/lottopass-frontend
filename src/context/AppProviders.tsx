import { LottoProvider } from "./lottoNumber/lottoNumberContext";
import { RoundsProvider } from "./rounds/roundsContext";
import { StoreProvider } from "./store/storeContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <RoundsProvider>
      <StoreProvider>
        <LottoProvider>{children}</LottoProvider>
      </StoreProvider>
    </RoundsProvider>
  );
};

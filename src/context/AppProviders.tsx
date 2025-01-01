import { LottoProvider } from "./lottoNumber/lottoNumberContext";
import { RoundsProvider } from "./rounds/roundsContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <RoundsProvider>
      <LottoProvider>{children}</LottoProvider>
    </RoundsProvider>
  );
};

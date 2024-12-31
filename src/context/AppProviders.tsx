import { LottoNumberProvider } from "./lottoNumbers";
import { RoundsProvider } from "./rounds";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <RoundsProvider>
      <LottoNumberProvider>{children}</LottoNumberProvider>
    </RoundsProvider>
  );
};

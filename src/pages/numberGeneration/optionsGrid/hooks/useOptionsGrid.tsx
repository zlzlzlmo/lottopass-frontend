import { useLottoNumber } from "../../../../context/lottoNumbers";
import { useRounds } from "../../../../context/rounds";
import { shuffle } from "../../../../utils/number";

const useOptionsGrid = () => {
  const { roundCount, handleRequiredNumbers } = useLottoNumber();
  const { getRecentRounds } = useRounds();

  // 최근 회차의 모든 당첨 번호 조합
  const handleRecentRounds = () => {
    const recentRounds = getRecentRounds(roundCount);

    const recentWinningRounds = new Set(
      recentRounds.flatMap((round) => round.winningNumbers)
    );

    const requiredNumbers = shuffle([...recentWinningRounds].map(Number));
    handleRequiredNumbers(requiredNumbers);
  };

  return {
    handleRecentRounds,
  };
};

export default useOptionsGrid;

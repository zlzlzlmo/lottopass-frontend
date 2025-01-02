import styles from "./RoundCard.module.scss";
import { formatNumberWithCommas } from "../../../utils/number";
import { getBallColor } from "../../../utils/ballColor";
import { LottoDraw } from "lottopass-shared";
// winningNumbers
// drawNumber
// date
// bonusNumber
// prizeStatistics
interface RoundCardProps extends LottoDraw {
  linkText: string;
  linkAction: () => void;
}

const RoundCard: React.FC<RoundCardProps> = ({
  winningNumbers,
  drawNumber,
  date,
  prizeStatistics,
  bonusNumber,
  linkText,
  linkAction,
}) => {
  //   if (isLoading)
  //     return (
  //       <div className={styles.cardContainer}>
  //         <div className={`${styles.card} ${styles.skeleton}`}>
  //           <div className={styles.skeletonHeader}></div>
  //           <div className={styles.skeletonNumbers}></div>
  //           <div className={styles.skeletonPrize}></div>
  //         </div>
  //       </div>
  //     );

  //   if (error || !latestRound) return <div>Error: {error}</div>;

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.round}>
            {drawNumber}회 당첨번호 [{date}]
          </span>
          <span className={styles.link} onClick={linkAction} role="button">
            {linkText}
          </span>
        </div>
        <div className={styles.numbersContainer}>
          {winningNumbers.map((num, index) => (
            <div
              style={{ backgroundColor: getBallColor(num) }}
              key={index}
              className={`${styles.number} ${index === 6 ? styles.bonus : ""}`}
            >
              {num}
            </div>
          ))}
          <div className={styles.bonusPlus}>+</div>
          <div className={`${styles.number} ${styles.bonus}`}>
            {bonusNumber}
          </div>
        </div>
        <div className={styles.prizeInfo}>
          1등 {formatNumberWithCommas(prizeStatistics.firstPrizeWinnerCount)}명
          | {formatNumberWithCommas(prizeStatistics.firstWinAmount)}원
        </div>
      </div>
    </div>
  );
};

export default RoundCard;

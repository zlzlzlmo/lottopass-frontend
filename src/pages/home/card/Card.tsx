import React from "react";
import styles from "./Card.module.scss";
import { useRounds } from "../../../context/rounds";
import { formatNumberWithCommas } from "../../../utils/number";
import { getBallColor } from "../../../utils/ballColor";

const Card = () => {
  const { latestRound, isLoading, error } = useRounds();

  if (isLoading) return <div>Loading...</div>;
  if (error || !latestRound) return <div>Error: {error}</div>;

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.round}>
            {latestRound.drawNumber}회 당첨번호 [{latestRound.date}]
          </span>
        </div>
        <div className={styles.numbersContainer}>
          {latestRound.winningNumbers.map((num, index) => (
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
            {latestRound.bonusNumber}
          </div>
        </div>
        <div className={styles.prizeInfo}>
          1등{" "}
          {formatNumberWithCommas(
            latestRound.prizeStatistics.firstPrizeWinnerCount
          )}
          명 |{" "}
          {formatNumberWithCommas(latestRound.prizeStatistics.firstWinAmount)}원
        </div>
      </div>
    </div>
  );
};

export default Card;

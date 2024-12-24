import React from "react";
import styles from "./Card.module.scss";

const Card = () => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.round}>1056회 당첨번호 [2월 25일 기준]</span>
          <span className={styles.result}>[당첨결과 +]</span>
        </div>
        <div className={styles.numbersContainer}>
          {[13, 20, 24, 32, 36, 45, "+29"].map((num, index) => (
            <div
              key={index}
              className={`${styles.number} ${index === 6 ? styles.bonus : ""}`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className={styles.prizeInfo}>1등 14명 | 1,969,662,456원</div>
      </div>
    </div>
  );
};

export default Card;

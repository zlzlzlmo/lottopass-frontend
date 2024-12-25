import React, { useState } from "react";
import styles from "./NumbersGrid.module.scss";

interface NumbersGridProps {
  maxSelection: number;
}

const NumbersGrid: React.FC<NumbersGridProps> = ({ maxSelection }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const handleConfirm = () => {
    console.log("선택된 번호:", selectedNumbers);
    // 로직 처리 후 다음 단계로 이동
  };

  const handleNumberClick = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number)); // 해제
    } else if (selectedNumbers.length < maxSelection) {
      setSelectedNumbers([...selectedNumbers, number]); // 선택
    }
  };

  return (
    <>
      <div className={styles.grid}>
        {Array.from({ length: 45 }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            className={`${styles.numberButton} ${
              selectedNumbers.includes(number) ? styles.selected : ""
            }`}
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <button
        className={styles.confirmButton}
        onClick={handleConfirm}
        disabled={selectedNumbers.length === 0}
      >
        확인
      </button>
    </>
  );
};

export default NumbersGrid;

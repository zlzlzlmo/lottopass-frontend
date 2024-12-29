import React, { useState } from "react";
import styles from "./NumbersGrid.module.scss";
import Button from "../../../components/common/button/Button";
import { useLottoNumber } from "../../../context/lottoNumbers";
import { useNavigate } from "react-router-dom";

interface NumbersGridProps {
  maxSelection: number;
}

const NumbersGrid: React.FC<NumbersGridProps> = ({ maxSelection }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const { dispatch } = useLottoNumber();
  const navigate = useNavigate();

  const handleConfirm = () => {
    dispatch({ type: "SET_EXCLUDED_NUMBERS", payload: selectedNumbers });
    navigate("/result");
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
      <Button
        onClick={handleConfirm}
        disabled={selectedNumbers.length > maxSelection}
      />
    </>
  );
};

export default NumbersGrid;

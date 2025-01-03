import React, { useState } from "react";
import { Button } from "antd";
import styles from "./NumberSelectPopup.module.scss";
import FlexContainer from "../common/container/FlexContainer";

interface NumberSelectPopupProps {
  onClose: () => void;
  onConfirm: (selectedNumbers: number[]) => void;
}

const NumberSelectPopup: React.FC<NumberSelectPopupProps> = ({
  onClose,
  onConfirm,
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const handleNumberToggle = (number: number) => {
    setSelectedNumbers((prev) =>
      prev.includes(number)
        ? prev.filter((num) => num !== number)
        : [...prev, number]
    );
  };

  const handleSubmit = () => {
    onConfirm(selectedNumbers);
    onClose();
  };

  return (
    <div>
      <h3 style={{ marginBottom: "16px", textAlign: "center" }}>
        번호를 선택하세요
      </h3>
      <div className={styles.numberGrid}>
        {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
          <div
            key={num}
            className={`${styles.numberCircle} ${
              selectedNumbers.includes(num) ? styles.selected : ""
            }`}
            onClick={() => handleNumberToggle(num)}
          >
            {num}
          </div>
        ))}
      </div>
      <FlexContainer justify="center" align="center">
        <Button onClick={onClose} style={{ marginRight: "8px" }}>
          취소
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          확인
        </Button>
      </FlexContainer>
    </div>
  );
};

export default NumberSelectPopup;

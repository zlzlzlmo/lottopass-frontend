// Popup for excluding numbers
import React, { useState } from "react";
import styles from "./NumberSelectPopup.module.scss";
import Button from "../common/button/Button";
import { clearFromLocalStorage } from "../../utils/storage";

interface NumberSelectPopupProps {
  maxSelection: number;
  onClose: () => void;
  onConfirm: (selectedNumbers: number[]) => void;
  confirmType: "exclude" | "require";
}

const NumberSelectPopup: React.FC<NumberSelectPopupProps> = ({
  maxSelection = 45 - 6,
  onClose,
  onConfirm,
  confirmType,
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const handleNumberClick = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number)); // 선택 해제
    } else if (selectedNumbers.length < maxSelection) {
      setSelectedNumbers([...selectedNumbers, number]); // 선택
    }
  };

  const handleConfirm = () => {
    clearFromLocalStorage();
    onConfirm(selectedNumbers); // 부모 컴포넌트로 선택된 번호 전달
    onClose(); // 팝업 닫기
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2 className={styles.title}>번호 선택</h2>
        <p className={styles.subtitle}>
          최대 {maxSelection}개의 번호를 선택할 수 있습니다.
        </p>

        <div className={styles.grid}>
          {Array.from({ length: 45 }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              className={`${styles.numberButton} ${
                selectedNumbers.includes(number) ? styles.selected : ""
              } ${confirmType === "require" && styles.required}`}
              onClick={() => handleNumberClick(number)}
            >
              {number}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <Button onClick={onClose} className={styles.cancelButton}>
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedNumbers.length > maxSelection}
            className={styles.confirmButton}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NumberSelectPopup;

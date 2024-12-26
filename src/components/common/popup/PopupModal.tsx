import React, { useLayoutEffect } from "react";
import styles from "./PopupModal.module.scss";
import Button from "../button/Button";
import { useLottoNumber } from "../../../context/lottoNumbers";

interface PopupModalProps {
  onConfirm: () => void; // 확인 버튼 콜백
  onClose: () => void; // 닫기 버튼 또는 DIM 클릭 콜백
}

const PopupModal: React.FC<PopupModalProps> = ({ onConfirm, onClose }) => {
  const {
    minimumRequiredCount,
    roundCount,
    setRoundCount,
    setMinimumRequiredCount,
  } = useLottoNumber();

  // 카운트 증감 핸들러
  const handleIncrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    max?: number
  ) => {
    setter((prev) => (max && prev >= max ? prev : prev + 1));
  };

  const handleDecrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    min?: number
  ) => {
    setter((prev) => (min && prev <= min ? prev : prev - 1));
  };

  useLayoutEffect(() => {
    setRoundCount(5);
    setMinimumRequiredCount(3);
  }, [setMinimumRequiredCount, setRoundCount]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputGroup}>
          {/* 최근 회차 */}
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>최근 회차</label>
            <input
              type="number"
              value={roundCount}
              onChange={(e) =>
                setRoundCount(
                  Math.max(1, Math.min(10, Number(e.target.value))) // 최소 1, 최대 10
                )
              }
              className={styles.inputBox}
            />
            <div className={styles.arrowGroup}>
              <button
                className={styles.arrowButton}
                onClick={() => handleDecrement(setRoundCount, 1)}
              >
                &lt;
              </button>
              <button
                className={styles.arrowButton}
                onClick={() => handleIncrement(setRoundCount, 10)}
              >
                &gt;
              </button>
            </div>
          </div>
          {/* 최소 갯수 */}
          <div className={styles.inputWrapper}>
            <label className={styles.inputLabel}>최소 갯수</label>
            <input
              type="number"
              value={minimumRequiredCount}
              onChange={(e) =>
                setMinimumRequiredCount(
                  Math.max(1, Math.min(6, Number(e.target.value))) // 최소 1, 최대 6
                )
              }
              className={styles.inputBox}
            />
            <div className={styles.arrowGroup}>
              <button
                className={styles.arrowButton}
                onClick={() => handleDecrement(setMinimumRequiredCount, 1)}
              >
                &lt;
              </button>
              <button
                className={styles.arrowButton}
                onClick={() => handleIncrement(setMinimumRequiredCount, 6)}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
        <p className={styles.exampleText}>
          최근 N회차에서 최소 K개의 당첨번호를 포함한 조합을 생성합니다.
        </p>
        <Button onClick={() => onConfirm()} text="번호 생성" />

        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default PopupModal;

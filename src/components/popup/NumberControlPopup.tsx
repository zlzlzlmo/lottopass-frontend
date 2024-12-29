import React, { useState } from "react";
import styles from "./NumberControlPopup.module.scss";
import Button from "../common/button/Button";
import { clearFromLocalStorage } from "../../utils/storage";

interface PopupModalProps {
  onConfirm: (roundCount: number, minCount: number) => void; // 확인 버튼 콜백
  onClose: () => void; // 닫기 버튼 또는 DIM 클릭 콜백
  confirmType: "require" | "exclude";
}

const clampValue = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

const NumberControlPopup: React.FC<PopupModalProps> = ({
  onConfirm,
  onClose,
  confirmType,
}) => {
  const [roundCount, setRoundCount] = useState<number>(5);
  const [minCount, setMinCount] = useState<number>(3);

  const ROUND_COUNT_MIN = 1;
  const ROUND_COUNT_MAX = 10;
  const MIN_COUNT_MIN = 1;
  const MIN_COUNT_MAX = 39;

  const handleConfirm = () => {
    clearFromLocalStorage();
    onConfirm(roundCount, minCount); // 부모 컴포넌트로 선택된 번호 전달
    onClose(); // 팝업 닫기
  };

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
                  clampValue(
                    Number(e.target.value),
                    ROUND_COUNT_MIN,
                    ROUND_COUNT_MAX
                  )
                )
              }
              className={styles.inputBox}
            />
            <div className={styles.arrowGroup}>
              <button
                className={styles.arrowButton}
                onClick={() =>
                  setRoundCount((prev) =>
                    clampValue(prev - 1, ROUND_COUNT_MIN, ROUND_COUNT_MAX)
                  )
                }
              >
                &lt;
              </button>
              <button
                className={styles.arrowButton}
                onClick={() =>
                  setRoundCount((prev) =>
                    clampValue(prev + 1, ROUND_COUNT_MIN, ROUND_COUNT_MAX)
                  )
                }
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
              value={minCount}
              onChange={(e) =>
                setMinCount(
                  clampValue(
                    Number(e.target.value),
                    MIN_COUNT_MIN,
                    MIN_COUNT_MAX
                  )
                )
              }
              className={styles.inputBox}
            />
            <div className={styles.arrowGroup}>
              <button
                className={styles.arrowButton}
                onClick={() =>
                  setMinCount((prev) =>
                    clampValue(prev - 1, MIN_COUNT_MIN, MIN_COUNT_MAX)
                  )
                }
              >
                &lt;
              </button>
              <button
                className={styles.arrowButton}
                onClick={() =>
                  setMinCount((prev) =>
                    clampValue(prev + 1, MIN_COUNT_MIN, MIN_COUNT_MAX)
                  )
                }
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
        <p className={styles.exampleText}>
          최근 N회차에서 최소 K개의 당첨번호를{" "}
          {confirmType === "exclude" ? "제외한" : "포함한"} 조합을 생성합니다.
        </p>
        <Button onClick={handleConfirm}>번호 생성</Button>

        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default NumberControlPopup;

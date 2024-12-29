import React, { useLayoutEffect } from "react";
import styles from "./NumberControlPopup.module.scss";
import { useLottoNumber } from "../../context/lottoNumbers";
import Button from "../common/button/Button";

interface PopupModalProps {
  onConfirm: () => void; // 확인 버튼 콜백
  onClose: () => void; // 닫기 버튼 또는 DIM 클릭 콜백
}

// Separate utility functions for increment and decrement logic
const adjustValue = (
  value: number,
  type: "increment" | "decrement",
  min: number,
  max: number
): number => {
  if (type === "increment") return Math.min(value + 1, max);
  return Math.max(value - 1, min);
};

const NumberControlPopup: React.FC<PopupModalProps> = ({
  onConfirm,
  onClose,
}) => {
  const {
    state: { roundCount, minimumRequiredCount },
    dispatch,
  } = useLottoNumber();

  // Handlers for increment and decrement
  const handleAdjustValue = (
    type: "SET_ROUND_COUNT" | "SET_MINIMUM_REQUIRED_COUNT",
    action: "increment" | "decrement",
    min: number,
    max: number
  ) => {
    const currentValue =
      type === "SET_ROUND_COUNT" ? roundCount : minimumRequiredCount;
    const newValue = adjustValue(currentValue, action, min, max);

    dispatch({ type, payload: newValue });
  };

  // Initialize values on mount
  useLayoutEffect(() => {
    dispatch({ type: "SET_ROUND_COUNT", payload: 5 });
    dispatch({ type: "SET_MINIMUM_REQUIRED_COUNT", payload: 3 });
  }, [dispatch]);

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
                dispatch({
                  type: "SET_ROUND_COUNT",
                  payload: Math.max(1, Math.min(10, Number(e.target.value))),
                })
              }
              className={styles.inputBox}
            />
            <div className={styles.arrowGroup}>
              <button
                className={styles.arrowButton}
                onClick={() =>
                  handleAdjustValue("SET_ROUND_COUNT", "decrement", 1, 10)
                }
              >
                &lt;
              </button>
              <button
                className={styles.arrowButton}
                onClick={() =>
                  handleAdjustValue("SET_ROUND_COUNT", "increment", 1, 10)
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
              value={minimumRequiredCount}
              onChange={(e) =>
                dispatch({
                  type: "SET_MINIMUM_REQUIRED_COUNT",
                  payload: Math.max(1, Math.min(6, Number(e.target.value))),
                })
              }
              className={styles.inputBox}
            />
            <div className={styles.arrowGroup}>
              <button
                className={styles.arrowButton}
                onClick={() =>
                  handleAdjustValue(
                    "SET_MINIMUM_REQUIRED_COUNT",
                    "decrement",
                    1,
                    6
                  )
                }
              >
                &lt;
              </button>
              <button
                className={styles.arrowButton}
                onClick={() =>
                  handleAdjustValue(
                    "SET_MINIMUM_REQUIRED_COUNT",
                    "increment",
                    1,
                    6
                  )
                }
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
        <p className={styles.exampleText}>
          최근 N회차에서 최소 K개의 당첨번호를 포함한 조합을 생성합니다.
        </p>
        <Button onClick={() => {}}>번호 생성</Button>

        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default NumberControlPopup;

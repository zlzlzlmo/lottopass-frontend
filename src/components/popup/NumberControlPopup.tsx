import React, { useState } from "react";
import { Button, InputNumber, Typography } from "antd";
import styles from "./NumberControlPopup.module.scss";

const { Title } = Typography;

interface NumberControlPopupProps {
  onClose: () => void;
  onConfirm: (roundCount: number, minCount: number) => void;
}

const NumberControlPopup: React.FC<NumberControlPopupProps> = ({
  onClose,
  onConfirm,
}) => {
  const [roundCount, setRoundCount] = useState<number>(5);
  const [minCount, setMinCount] = useState<number>(3);

  const handleConfirm = () => {
    onConfirm(roundCount, minCount);
    onClose();
  };

  return (
    <div className={styles.popupContainer}>
      <Title level={4} className={styles.title}>
        번호 조합 설정
      </Title>

      <div className={styles.controlGroup}>
        <div className={styles.controlItem}>
          <label>최근 회차</label>
          <div className={styles.controls}>
            <Button
              size="small"
              onClick={() => {
                setRoundCount((prev) => {
                  const next = Math.max(1, prev - 1);
                  return next;
                });
              }}
            >
              -
            </Button>
            <InputNumber
              min={1}
              max={20}
              value={roundCount}
              onChange={(value) => setRoundCount(value || 1)}
              className={styles.inputNumber}
              controls={false}
            />
            <Button
              size="small"
              onClick={() => setRoundCount((prev) => Math.min(20, prev + 1))}
            >
              +
            </Button>
          </div>
        </div>

        <div className={styles.controlItem}>
          <label>최소 포함 번호 갯수</label>
          <div className={styles.controls}>
            <Button
              size="small"
              onClick={() => setMinCount((prev) => Math.max(1, prev - 1))}
            >
              -
            </Button>
            <InputNumber
              min={1}
              max={6}
              value={minCount}
              onChange={(value) => setMinCount(value || 1)}
              className={styles.inputNumber}
              controls={false}
            />
            <Button
              size="small"
              onClick={() => setMinCount((prev) => Math.min(6, prev + 1))}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <Button onClick={onClose} style={{ marginRight: "8px" }}>
          취소
        </Button>
        <Button type="primary" onClick={handleConfirm}>
          확인
        </Button>
      </div>
    </div>
  );
};

export default NumberControlPopup;

import React, { useState } from "react";
import { Button, InputNumber, Typography } from "antd";
import styles from "./NumberControlPopup.module.scss";

const { Title } = Typography;

interface EvenOddSelectionPopupProps {
  onClose: () => void;
  onConfirm: (evenCount: number, oddCount: number) => void;
}

const EvenOddSelectionPopup: React.FC<EvenOddSelectionPopupProps> = ({
  onClose,
  onConfirm,
}) => {
  const [evenCount, setEvenCount] = useState<number>(3);
  const [oddCount, setOddCount] = useState<number>(3);

  const handleConfirm = () => {
    onConfirm(evenCount, oddCount);
    onClose();
  };

  const handleEvenChange = (value: number) => {
    const remaining = 6 - (oddCount || 0);
    setEvenCount(Math.min(value || 0, remaining));
  };

  const handleOddChange = (value: number) => {
    const remaining = 6 - (evenCount || 0);
    setOddCount(Math.min(value || 0, remaining));
  };

  return (
    <div className={styles.popupContainer}>
      <Title level={4} className={styles.title}>
        짝수, 홀수 조합 선택
      </Title>

      <div className={styles.controlGroup}>
        <div className={styles.controlItem}>
          <label>짝수 갯수</label>
          <div className={styles.controls}>
            <Button
              size="small"
              onClick={() => setEvenCount((prev) => Math.max(0, prev - 1))}
            >
              -
            </Button>
            <InputNumber
              min={0}
              max={6 - oddCount}
              value={evenCount}
              onChange={(value) => {
                if (!value) return;
                handleEvenChange(value);
              }}
              className={styles.inputNumber}
              controls={false}
            />
            <Button
              size="small"
              onClick={() =>
                setEvenCount((prev) => Math.min(6 - oddCount, prev + 1))
              }
            >
              +
            </Button>
          </div>
        </div>

        <div className={styles.controlItem}>
          <label>홀수 갯수</label>
          <div className={styles.controls}>
            <Button
              size="small"
              onClick={() => setOddCount((prev) => Math.max(0, prev - 1))}
            >
              -
            </Button>
            <InputNumber
              min={0}
              max={6 - evenCount}
              value={oddCount}
              onChange={(value) => {
                if (!value) return;
                handleOddChange(value);
              }}
              className={styles.inputNumber}
              controls={false}
            />
            <Button
              size="small"
              onClick={() =>
                setOddCount((prev) => Math.min(6 - evenCount, prev + 1))
              }
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* 버튼 그룹 */}
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

export default EvenOddSelectionPopup;

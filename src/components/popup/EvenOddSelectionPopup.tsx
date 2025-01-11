import React, { useState } from "react";
import { Button } from "antd";
import ControlNumberItem from "../common/numberSelector/ControlNumberItem";

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
          width: "100%",
        }}
      >
        <ControlNumberItem
          label="짝수 갯수"
          value={evenCount}
          onChange={(val) => setEvenCount(Math.min(val, 6 - oddCount))}
          min={0}
          max={6 - oddCount}
        />
        <ControlNumberItem
          label="홀수 갯수"
          value={oddCount}
          onChange={(val) => setOddCount(Math.min(val, 6 - evenCount))}
          min={0}
          max={6 - evenCount}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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

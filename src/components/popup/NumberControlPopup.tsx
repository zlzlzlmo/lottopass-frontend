import React, { useState } from "react";
import { Button } from "antd";
import ControlNumberItem from "../common/numberSelector/ControlNumberItem";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        padding: "16px",
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
          label="최근 회차"
          value={roundCount}
          onChange={(val) => setRoundCount(val)}
          min={1}
          max={20}
        />
        <ControlNumberItem
          label="최소 포함 번호 갯수"
          value={minCount}
          onChange={(val) => setMinCount(val)}
          min={1}
          max={6}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Button
          onClick={onClose}
          style={{
            backgroundColor: "#e2e8f0",
            border: "none",
            color: "#000",
            fontWeight: "bold",
          }}
        >
          취소
        </Button>
        <Button
          type="primary"
          style={{ fontWeight: "bold", padding: "0 16px" }}
          onClick={handleConfirm}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default NumberControlPopup;

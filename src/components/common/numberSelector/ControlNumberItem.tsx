import React from "react";
import { Button, InputNumber } from "antd";
import COLORS from "@/constants/colors";

interface ControlItemProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const ControlNumberItem: React.FC<ControlItemProps> = ({
  label,
  value,
  onChange,
  min,
  max,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        gap: "12px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: COLORS.NEUTRAL_LIGHT,
      }}
    >
      <label
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: COLORS.TEXT_PRIMARY,
          marginBottom: "8px",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Button
          size="middle"
          style={{
            backgroundColor: COLORS.NEUTRAL,
            border: "none",
            color: COLORS.BLACK,
            fontWeight: "bold",
          }}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          -
        </Button>
        <InputNumber
          min={min}
          max={max}
          value={value}
          onChange={(val) => onChange(val || min)}
          style={{
            width: "80px",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px",
          }}
          inputMode="numeric"
          controls={false}
        />
        <Button
          size="middle"
          style={{
            backgroundColor: COLORS.NEUTRAL,
            border: "none",
            color: COLORS.BLACK,
            fontWeight: "bold",
          }}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default ControlNumberItem;

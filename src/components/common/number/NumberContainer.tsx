import { getBallColor } from "@/utils/ballColor";
import { Space, Tag, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface NumberContainerProps {
  numbers: number[];
  bonusNumber?: number;
  size?: number;
}

const NumberContainer: React.FC<NumberContainerProps> = ({
  numbers,
  bonusNumber,
  size = 40,
}) => {
  const numberStyle = {
    width: size,
    height: size,
    fontSize: size / 2.8,
    fontWeight: "bold",
    textAlign: "center" as const,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    color: "#fff",
  };

  const numbersContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: size / 5,
    marginTop: size / 2.5,
  };

  const bonusPlusStyle = {
    fontSize: size / 2.5,
    margin: `0 ${size / 5}px`,
    color: "#333",
  };

  return (
    <Space style={numbersContainerStyle} wrap>
      {numbers.map((num, index) => (
        <Tag
          color={getBallColor(num)}
          key={index}
          style={{
            ...numberStyle,
            backgroundColor: getBallColor(num),
          }}
        >
          {num}
        </Tag>
      ))}

      {bonusNumber && (
        <>
          <Text style={bonusPlusStyle}>+</Text>
          <Tag
            style={{
              ...numberStyle,
              backgroundColor: "#ff4d4f",
            }}
          >
            {bonusNumber}
          </Tag>
        </>
      )}
    </Space>
  );
};

export default NumberContainer;

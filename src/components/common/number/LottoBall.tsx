import { getBallColor } from "@/utils/ballColor";
import { Tag, Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface LottoBallProps {
  number: number;
  size: number;
  isBonusNumber?: boolean;
}

const LottoBall: React.FC<LottoBallProps> = ({
  number,
  size,
  isBonusNumber = false,
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

  const bonusPlusStyle = {
    fontSize: size / 2.5,
    margin: `0 ${size / 5}px`,
    color: "#333",
  };

  if (isBonusNumber) {
    return (
      <>
        <Text style={bonusPlusStyle}>+</Text>
        <Tag
          style={{
            ...numberStyle,
            backgroundColor: "#ff4d4f",
          }}
        >
          {number}
        </Tag>
      </>
    );
  }
  return (
    <Tag
      color={getBallColor(number)}
      style={{
        ...numberStyle,
        backgroundColor: getBallColor(number),
      }}
    >
      {number}
    </Tag>
  );
};

export default LottoBall;

import { Button, Space } from "antd";
import React, { useState } from "react";
import { BarChartOutlined } from "@ant-design/icons";
import StatisticsPopup from "@/components/popup/StatisticPopup";
import LottoBall from "./LottoBall";

interface NumberContainerProps {
  numbers: number[];
  bonusNumber?: number;
  size?: number;
  hasStatistic?: boolean;
}

const NumberContainer: React.FC<NumberContainerProps> = ({
  numbers,
  bonusNumber,
  size = 40,
  hasStatistic = false,
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  const numbersContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: size / 5,
    marginTop: size / 2.5,
    position: "relative" as const,
  };

  const handleViewStatistics = () => {
    setVisible(true);
  };

  return (
    <div style={{ position: "relative" }}>
      <Space style={numbersContainerStyle} wrap>
        {numbers.map((num, index) => (
          <LottoBall key={index} number={num} size={size} />
        ))}

        {bonusNumber && (
          <>
            <LottoBall number={bonusNumber} size={size} />
          </>
        )}

        {hasStatistic && (
          <Button
            type="text"
            icon={<BarChartOutlined />}
            onClick={handleViewStatistics}
            style={{
              marginLeft: size / 5,
              color: "#1890ff",
              display: "flex",
              alignItems: "center",
            }}
          />
        )}
      </Space>

      {hasStatistic && visible && (
        <StatisticsPopup
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          numbers={numbers}
        />
      )}
    </div>
  );
};

export default NumberContainer;

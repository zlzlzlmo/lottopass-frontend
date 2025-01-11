import React, { useState } from "react";
import {
  Button,
  InputNumber,
  Select,
  Typography,
  Divider,
  Space,
  Card,
} from "antd";
import { LottoDraw } from "lottopass-shared";
import FlexContainer from "@/components/common/container/FlexContainer";
import NumberContainer from "@/components/common/number/NumberContainer";

const { Text } = Typography;

interface Props {
  selectedDraw: number;
  setSelectedDraw: (value: number) => void;
  allDraws: LottoDraw[];
  onSimulate: (maxCount: number) => void;
  onStop: () => void;
  simulationRunning: boolean;
  latestDraw: LottoDraw;
}

const SimulationControls: React.FC<Props> = ({
  selectedDraw,
  setSelectedDraw,
  allDraws,
  onSimulate,
  onStop,
  simulationRunning,
  latestDraw,
}) => {
  const maxSimulationLimit = 1000000;
  const [maxCount, setMaxCount] = useState<number>(1000);

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: "450px",
        margin: "0 auto",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <FlexContainer justify="space-between" align="center">
          <Text strong style={{ fontSize: "12px", flex: 1 }}>
            기준 회차 :
          </Text>
          <Select
            style={{ marginLeft: "10px", width: "100%", maxWidth: "150px" }}
            value={selectedDraw}
            onChange={setSelectedDraw}
            size="middle"
          >
            {allDraws.map((draw, index) => (
              <Select.Option key={draw.drawNumber} value={index}>
                {draw.drawNumber}회
              </Select.Option>
            ))}
          </Select>
        </FlexContainer>

        <Divider style={{ margin: "8px 0" }} />
        <Text strong style={{ fontSize: "12px", flex: 1 }}>
          당첨 번호 :
        </Text>
        <NumberContainer
          numbers={latestDraw.winningNumbers.map(Number)}
          bonusNumber={latestDraw.bonusNumber}
        />

        <Divider style={{ margin: "8px 0" }} />
        <FlexContainer justify="space-between" align="center">
          <Text strong style={{ fontSize: "12px", flex: 1 }}>
            횟수 :
          </Text>
          <InputNumber
            min={1}
            max={maxSimulationLimit}
            value={maxCount}
            onChange={(value) => {
              if (
                typeof value === "number" &&
                value > 0 &&
                value <= maxSimulationLimit
              ) {
                setMaxCount(value);
              }
            }}
            style={{ marginLeft: "10px", width: "100%", maxWidth: "150px" }}
          />
        </FlexContainer>

        <Divider style={{ margin: "8px 0" }} />
        <FlexContainer>
          <Button
            type="primary"
            onClick={() => onSimulate(maxCount)}
            disabled={simulationRunning}
            loading={simulationRunning}
            size="large"
            style={{
              fontWeight: "bold",
              width: "200px",
            }}
          >
            {simulationRunning ? "진행 중..." : "시뮬레이션 시작"}
          </Button>
          <Button
            type="default"
            onClick={onStop}
            disabled={!simulationRunning}
            size="large"
            style={{
              marginLeft: "10px",
              fontWeight: "bold",
              width: "120px",
              flex: 1,
            }}
          >
            중지
          </Button>
        </FlexContainer>
      </Space>
    </Card>
  );
};

export default SimulationControls;

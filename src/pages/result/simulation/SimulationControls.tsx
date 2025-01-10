import React, { useState } from "react";
import { Button, InputNumber, Select, Space, Typography, Divider } from "antd";
import { LottoDraw } from "lottopass-shared";

const { Text } = Typography;

interface Props {
  selectedDraw: number;
  setSelectedDraw: (value: number) => void;
  allDraws: LottoDraw[];
  onSimulate: (maxCount: number) => void;
  simulationRunning: boolean;
  latestDraw: LottoDraw;
}

const SimulationControls: React.FC<Props> = ({
  selectedDraw,
  setSelectedDraw,
  allDraws,
  onSimulate,
  simulationRunning,
  latestDraw,
}) => {
  const maxSimulationLimit = 1000000;
  const [maxCount, setMaxCount] = useState<number>(3000);

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        {/* 기준 회차 선택 */}
        <div>
          <Text strong style={{ fontSize: "14px" }}>
            기준 회차:
          </Text>
          <Select
            style={{ marginLeft: "10px", width: "120px" }}
            value={selectedDraw}
            onChange={setSelectedDraw}
            size="small"
          >
            {allDraws.map((draw, index) => (
              <Select.Option key={draw.drawNumber} value={index}>
                {draw.drawNumber}회
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* 당첨 번호 */}
        <Divider style={{ margin: "8px 0" }} />
        <div>
          <Text strong style={{ fontSize: "14px", color: "#1890ff" }}>
            당첨 번호:
          </Text>{" "}
          <Text style={{ fontSize: "14px" }}>
            {latestDraw?.winningNumbers.join(", ") ?? "없음"}
          </Text>
        </div>
        <div>
          <Text strong style={{ fontSize: "14px", color: "#fa541c" }}>
            보너스 번호:
          </Text>{" "}
          <Text style={{ fontSize: "14px" }}>
            {latestDraw?.bonusNumber ?? "없음"}
          </Text>
        </div>

        {/* 시뮬레이션 횟수 설정 */}
        <Divider style={{ margin: "8px 0" }} />
        <div>
          <Text strong style={{ fontSize: "14px" }}>
            시뮬레이션 횟수:
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
            size="small"
            style={{ marginLeft: "10px", width: "80px" }}
          />
        </div>

        {/* 시뮬레이션 버튼 */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Button
            type="primary"
            onClick={() => onSimulate(maxCount)}
            disabled={simulationRunning}
            loading={simulationRunning}
            size="small"
            style={{
              fontWeight: "bold",
              padding: "4px 12px",
            }}
          >
            {simulationRunning ? "진행 중..." : "시뮬레이션 시작"}
          </Button>
        </div>
      </Space>
    </div>
  );
};

export default SimulationControls;

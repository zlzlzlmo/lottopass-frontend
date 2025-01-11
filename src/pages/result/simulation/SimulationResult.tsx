import NumberContainer from "@/components/common/number/NumberContainer";
import COLORS from "@/constants/colors";
import { Card, Progress } from "antd";
import { Typography } from "antd";
import React from "react";

const { Title } = Typography;

interface SimulationResultProps {
  progress: number;
  simulationCount: number;
  simulatedNumbers: string;
  rankCounts: {
    first: number;
    second: number;
    third: number;
    fourth: number;
    fifth: number;
  };
}

const SimulationResult: React.FC<SimulationResultProps> = ({
  progress,
  simulationCount,
  simulatedNumbers,
  rankCounts,
}) => {
  return (
    <>
      <div>
        <Title level={5}>진행 횟수: {simulationCount}</Title>
        <Progress
          percent={progress}
          status="active"
          strokeColor={{
            from: COLORS.NAVY_BLUE,
            to: COLORS.BABY_BLUE,
          }}
          style={{ maxWidth: "400px", margin: "0 auto" }}
        />
        <div
          style={{
            fontSize: "1.2em",
            fontWeight: "bold",
            margin: "20px 0",
          }}
        >
          <Title level={5}>현재 번호 조합</Title>
          {
            <NumberContainer
              numbers={simulatedNumbers.split(",").map(Number)}
            />
          }
        </div>
      </div>

      {/* 실시간 결과 */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Card
          style={{
            borderRadius: "12px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            {[
              { rank: "1등", count: rankCounts.first, color: "#ff6f61" },
              { rank: "2등", count: rankCounts.second, color: "#ff914d" },
              { rank: "3등", count: rankCounts.third, color: "#ffc107" },
              { rank: "4등", count: rankCounts.fourth, color: "#8bc34a" },
              { rank: "5등", count: rankCounts.fifth, color: "#03a9f4" },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: item.color + "20",
                }}
              >
                <span style={{ fontWeight: "bold", color: item.color }}>
                  {item.rank}
                </span>
                <span style={{ fontSize: "16px", fontWeight: "600" }}>
                  {item.count.toLocaleString()}번
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default SimulationResult;

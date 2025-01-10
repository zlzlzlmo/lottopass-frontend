import NumberContainer from "@/components/common/number/NumberContainer";
import { Card } from "antd";
import { Typography } from "antd";
import React from "react";

const { Title } = Typography;

interface SimulationResultProps {
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
  simulationCount,
  simulatedNumbers,
  rankCounts,
}) => {
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Title level={5}>진행 횟수: {simulationCount}</Title>
        <div
          style={{
            fontSize: "1.2em",
            fontWeight: "bold",
            margin: "20px 0",
          }}
        >
          <div>현재 번호 조합</div>
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
            padding: "24px",
            background: "#f9f9f9",
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

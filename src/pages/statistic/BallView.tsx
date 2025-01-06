import React, { useState } from "react";
import { Slider, Row, Col, InputNumber, Button, Space } from "antd";
import BallSection from "./BallSection";
import ChartSection from "./ChartSection";
import SortDropdown from "@/components/common/dropDown/SortDropDown";

interface LottoDraw {
  drawNumber: number;
  date: string;
  winningNumbers: number[];
  bonusNumber: number;
}

interface BallViewProps {
  data: LottoDraw[];
}

const BallView: React.FC<BallViewProps> = ({ data }) => {
  const maxDraw = Math.max(...data.map((draw) => draw.drawNumber));
  const minDraw = Math.min(...data.map((draw) => draw.drawNumber));

  const [range, setRange] = useState<[number, number]>([
    Math.max(minDraw, maxDraw - 10),
    maxDraw,
  ]);
  const [sortKey, setSortKey] = useState<"number" | "count">("number");
  const [currentView, setCurrentView] = useState<"balls" | "chart">("balls");

  // 회차 범위에 따른 데이터 필터링
  const filteredDraws = data.filter(
    (draw) => draw.drawNumber >= range[0] && draw.drawNumber <= range[1]
  );

  // 번호별 통계 계산
  const calculateStatistics = () => {
    const counts: Record<number, number> = {};
    filteredDraws.forEach((draw) => {
      draw.winningNumbers.forEach((num) => {
        counts[num] = (counts[num] || 0) + 1;
      });
      counts[draw.bonusNumber] = (counts[draw.bonusNumber] || 0) + 1;
    });
    return Array.from({ length: 45 }, (_, i) => ({
      number: i + 1,
      count: counts[i + 1] || 0,
    }));
  };

  const statistics = calculateStatistics();

  const handleRangeChange = (value: [number, number]) => {
    setRange(value);
  };

  const handleInputChange = (value: number, index: 0 | 1) => {
    const newRange = [...range] as [number, number];
    newRange[index] = value;
    setRange(newRange);
  };
  return (
    <div style={{ padding: "20px", maxWidth: "640px", margin: "0 auto" }}>
      {/* 회차 범위 선택 */}
      <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>
        회차 범위 선택
      </h3>
      <Slider
        range
        min={minDraw}
        max={maxDraw}
        value={range}
        onChange={(value) => handleRangeChange(value as [number, number])}
        tooltip={{
          formatter: (value) => `${value}회`,
        }}
        style={{ marginBottom: "20px" }}
      />
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <InputNumber
            min={minDraw}
            max={maxDraw}
            value={range[0]}
            onChange={(value) => handleInputChange(value || minDraw, 0)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12}>
          <InputNumber
            min={minDraw}
            max={maxDraw}
            value={range[1]}
            onChange={(value) => handleInputChange(value || maxDraw, 1)}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Space>
          <Button
            type={currentView === "balls" ? "primary" : "default"}
            onClick={() => setCurrentView("balls")}
          >
            공 보기
          </Button>
          <Button
            type={currentView === "chart" ? "primary" : "default"}
            onClick={() => setCurrentView("chart")}
          >
            차트 보기
          </Button>
        </Space>
        {currentView === "balls" && (
          <SortDropdown
            currentSort={sortKey}
            onSortChange={setSortKey}
            sortOptions={[
              { key: "number", label: "번호순" },
              { key: "count", label: "당첨 횟수순" },
            ]}
          />
        )}
      </div>

      {currentView === "balls" ? (
        <BallSection data={statistics} sortKey={sortKey} />
      ) : (
        <ChartSection data={statistics} />
      )}
    </div>
  );
};

export default BallView;

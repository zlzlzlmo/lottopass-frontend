import React, { useState, useEffect } from "react";
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
  const [range, setRange] = useState<[number, number] | null>(null); // 초기값을 null로 설정
  const [sortKey, setSortKey] = useState<"number" | "count">("count");
  const [currentView, setCurrentView] = useState<"balls" | "chart">("balls");

  const maxDraw =
    data.length > 0 ? Math.max(...data.map((draw) => draw.drawNumber)) : 0;
  const minDraw =
    data.length > 0 ? Math.min(...data.map((draw) => draw.drawNumber)) : 0;

  // 데이터가 로드된 후 초기값 설정
  useEffect(() => {
    if (data.length > 0 && range === null) {
      setRange([Math.max(minDraw, maxDraw - 50), maxDraw]);
    }
  }, [data, range, minDraw, maxDraw]);

  const filteredDraws = range
    ? data.filter(
        (draw) => draw.drawNumber >= range[0] && draw.drawNumber <= range[1]
      )
    : [];

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
    if (range) {
      const newRange = [...range] as [number, number];
      newRange[index] = value;
      setRange(newRange);
    }
  };

  if (!range) {
    return <div>데이터를 로드 중입니다...</div>;
  }

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

      {/* 상단 메뉴 */}
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

      {/* 섹션 렌더링 */}
      {currentView === "balls" ? (
        <BallSection data={statistics} sortKey={sortKey} />
      ) : (
        <ChartSection data={statistics} />
      )}
    </div>
  );
};

export default BallView;

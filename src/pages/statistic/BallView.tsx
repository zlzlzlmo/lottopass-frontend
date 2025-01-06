import React, { useState, useEffect } from "react";
import { Button, Space } from "antd";
import BallSection from "./BallSection";
import ChartSection from "./ChartSection";
import { RangeSelector, SortDropDown } from "@/components/common";

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

  if (!range) {
    return <div>데이터를 로드 중입니다...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "640px", margin: "0 auto" }}>
      {/* 회차 범위 선택 */}
      <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>
        회차 범위 선택
      </h3>

      <RangeSelector
        min={minDraw}
        max={maxDraw}
        value={range}
        onChange={handleRangeChange}
      />

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
          <SortDropDown
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

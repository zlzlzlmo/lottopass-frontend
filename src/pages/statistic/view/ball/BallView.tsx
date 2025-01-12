import React, { useState } from "react";
import { Button, Space } from "antd";
import BallSection from "./BallSection";
import ChartSection from "./ChartSection";
import {
  LoadingIndicator,
  RangeSelector,
  SortDropDown,
} from "@/components/common";
import { useRangeSelector } from "@/features/range/hooks/useRangeSelect";
import { LottoDraw } from "lottopass-shared";

interface BallViewProps {
  data: LottoDraw[];
}

const BallView: React.FC<BallViewProps> = ({ data }) => {
  const { minDraw, maxDraw, range, filteredDraws, handleRangeChange } =
    useRangeSelector<LottoDraw>({
      data,
      defaultMinRange: 50,
      getDrawNumber: (item) => item.drawNumber,
    });
  const [sortKey, setSortKey] = useState<"number" | "count">("count");
  const [currentView, setCurrentView] = useState<"balls" | "chart">("balls");

  const calculateStatistics = () => {
    const counts: Record<number, number> = {};
    filteredDraws.forEach((draw) => {
      draw.winningNumbers.forEach((num) => {
        counts[num] = (counts[num] || 0) + 1;
      });
    });
    return Array.from({ length: 45 }, (_, i) => ({
      number: i + 1,
      count: counts[i + 1] || 0,
    }));
  };

  const statistics = calculateStatistics();

  if (!filteredDraws) {
    return <div>데이터를 로드 중입니다...</div>;
  }

  if (!range)
    return (
      <>
        <LoadingIndicator />
      </>
    );

  return (
    <>
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
    </>
  );
};

export default BallView;

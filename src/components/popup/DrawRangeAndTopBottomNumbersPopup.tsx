import React, { useState } from "react";
import { Button } from "antd";
import RangeSelector from "../common/rangeSelector/RangeSelector";
import { LottoDraw } from "lottopass-shared";
import ControlNumberItem from "../common/numberSelector/ControlNumberItem";
import { useRangeSelector } from "@/features/range/hooks/useRangeSelect";
import { LoadingIndicator } from "../common";

interface DrawRangeAndTopBottomNumbersPopupProps {
  onClose: () => void;
  onConfirm: (min: number, max: number, topCount: number) => void;
  draws: LottoDraw[];
  type: "top" | "bottom";
}

const DrawRangeAndTopBottomNumbersPopup: React.FC<
  DrawRangeAndTopBottomNumbersPopupProps
> = ({ onClose, onConfirm, draws, type }) => {
  const defaultMinRange = 50;

  const { maxDraw, range, handleRangeChange } = useRangeSelector<LottoDraw>({
    data: draws,
    defaultMinRange,
    getDrawNumber: (item) => item.drawNumber,
  });

  const [topCount, setTopCount] = useState<number>(20);

  if (!range)
    return (
      <>
        <LoadingIndicator />
      </>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <RangeSelector
        min={maxDraw - defaultMinRange}
        max={maxDraw}
        value={range ?? [0, 0]}
        onChange={handleRangeChange}
      />

      <ControlNumberItem
        label={(type === "top" ? "상위" : "하위") + "번호 개수"}
        value={topCount}
        onChange={(val) => setTopCount(val)}
        min={1}
        max={45}
      />

      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: "#e2e8f0",
            border: "none",
            color: "#000",
            fontWeight: "bold",
          }}
        >
          취소
        </Button>
        <Button
          type="primary"
          onClick={() => {
            const [min, max] = range;
            onConfirm(min, max, topCount);
          }}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default DrawRangeAndTopBottomNumbersPopup;

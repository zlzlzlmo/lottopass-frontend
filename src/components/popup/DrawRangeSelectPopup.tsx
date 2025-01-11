import { Button } from "antd";
import RangeSelector from "../common/rangeSelector/RangeSelector";
import { useRangeSelector } from "@/features/range/hooks/useRangeSelect";
import { LottoDraw } from "lottopass-shared";
import FlexContainer from "../common/container/FlexContainer";
import { LoadingIndicator } from "../common";

interface DrawRangeSelectPopupProps {
  onClose: () => void;
  onConfirm: (min: number, max: number) => void;
  draws: LottoDraw[];
}

const DrawRangeSelectPopup: React.FC<DrawRangeSelectPopupProps> = ({
  onClose,
  onConfirm,
  draws,
}) => {
  const defaultMinRange = 50;

  const { maxDraw, range, handleRangeChange } = useRangeSelector<LottoDraw>({
    data: draws,
    defaultMinRange,
    getDrawNumber: (item) => item.drawNumber,
  });

  if (!range)
    return (
      <>
        <LoadingIndicator />
      </>
    );

  return (
    <>
      <RangeSelector
        min={maxDraw - defaultMinRange}
        max={maxDraw}
        value={range ?? [0, 0]}
        onChange={handleRangeChange}
      />
      <FlexContainer justify="center" align="center">
        <Button onClick={onClose} style={{ marginRight: "8px" }}>
          취소
        </Button>
        <Button
          type="primary"
          onClick={() => {
            const [min, max] = range;
            onConfirm(min, max);
          }}
        >
          확인
        </Button>
      </FlexContainer>
    </>
  );
};

export default DrawRangeSelectPopup;

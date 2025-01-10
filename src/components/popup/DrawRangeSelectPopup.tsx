import { Button } from "antd";
import RangeSelector from "../common/rangeSelector/RangeSelector";
import { useAppSelector } from "@/redux/hooks";
import { useRangeSelector } from "@/features/range/hooks/useRangeSelect";
import { LottoDraw } from "lottopass-shared";
import FlexContainer from "../common/container/FlexContainer";
import { LoadingIndicator } from "../common";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface DrawRangeSelectPopupProps {
  onClose: () => void;
  onConfirm: (min: number, max: number) => void;
}

const DrawRangeSelectPopup: React.FC<DrawRangeSelectPopupProps> = ({
  onClose,
  onConfirm,
}) => {
  const location = useLocation();

  const defaultMinRange = 20;
  const allDraws = useAppSelector((state) => state.draw.allDraws);
  const isSimulation = location.pathname === ROUTES.S_NUMBER_GENERATION.path;
  const start = isSimulation ? 1 : 0;
  const reDrawedAllDraws = allDraws.slice(start);
  const { maxDraw, range, handleRangeChange } = useRangeSelector<LottoDraw>({
    data: reDrawedAllDraws,
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

import React from "react";
import { Typography } from "antd";
import { ViewType } from "../StatisticPage";
import BallView from "./ball/BallView";
import { LottoDraw } from "lottopass-shared";
import MatchView from "./match/MatchView";
import NumberPairView from "./numberPair/NumberPairView";
const { Text } = Typography;

interface ViewContainerProps {
  viewType: ViewType;
  data: LottoDraw[];
}

const views: Record<ViewType, string> = {
  ball: "역대 모든 당첨 회차의 각 번호들의 출현 횟수를 통계로 나타냅니다.",
  match:
    "각 회차의 당첨 번호와 바로 이전 회차의 당첨 번호를 비교하여 역대 일치했던 번호의 개수를 통계로 나타냅니다.",
  numberPair:
    "역대 모든 회차 중 자주 등장했던 번호들의 두쌍, 세쌍 조합의 빈도수를 통계로 나타냅니다.",
};

const ViewContainer: React.FC<ViewContainerProps> = ({ viewType, data }) => {
  const renderView = () => {
    if (viewType === "ball") return <BallView data={data} />;
    if (viewType === "match") return <MatchView data={data} />;
    if (viewType === "numberPair") return <NumberPairView data={data} />;
    return <></>;
  };
  return (
    <div style={{ marginTop: 16 }}>
      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        {views[viewType]}
      </Text>
      {renderView()}
    </div>
  );
};

export default ViewContainer;

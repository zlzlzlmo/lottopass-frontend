import { Collapse, Typography } from "antd";
import React from "react";

import { LottoDraw } from "lottopass-shared";
import { QueryParams } from "./hooks/useGenerateNumbers";

const { Panel } = Collapse;
const { Text } = Typography;

interface CombinationDescriptionProps {
  queryParams: QueryParams;
  latestDraw: LottoDraw;
}

const CombinationDescription: React.FC<CombinationDescriptionProps> = ({
  queryParams,
  latestDraw,
}) => {
  const {
    type,
    selectedNumbers,
    confirmType,
    drawCount,
    min,
    max,
    minCount,
    even,
    odd,
    topNumber,
  } = queryParams;

  const renderCombinationDescription = (latestDraw: LottoDraw) => {
    if (!latestDraw) return;
    switch (type) {
      case "numberSelect":
        if (selectedNumbers && selectedNumbers.length <= 0)
          return "선택된 번호가 존재하지 않아 모든 경우의 수를 조합합니다.";
        return `선택된 번호 ${selectedNumbers
          ?.sort((a, b) => a - b)
          .join(", ")} 가 ${
          confirmType === "require" ? "포함" : "제외"
        }된 조합입니다.`;
      case "numberControl": {
        const includedDrawNumbers = Array.from(
          { length: drawCount! },
          (_, i) => latestDraw.drawNumber - i - 1
        );

        return `최근 ${drawCount}회차 (${includedDrawNumbers
          .map((num) => num.toString() + "회")
          .join(", ")})의 ${
          confirmType === "require" ? "출현" : "미출현"
        } 번호 중 최소 ${minCount}개의 번호를 사용하는 조합입니다.`;
      }
      case "rangeSelect": {
        const text = confirmType === "require" ? "출현 번호" : "미출현 번호";
        return `${min}회차부터 ${max}회차 사이의 ${text}를 사용하는 조합입니다.`;
      }
      case "evenOddControl":
        return `짝수 ${even ?? 0}개와 홀수 ${odd ?? 0}개를 가진 조합입니다.`;
      case "rangeAndTopNumberSelect": {
        const text = confirmType === "require" ? "출현 번호" : "미출현 번호";

        return `${min}회차부터 ${max}회차 사이의 ${text}중 출현 횟수 상위 ${topNumber}개 번호를 사용하여 만든 조합입니다.`;
      }
      case "rangeAndBottomNumberSelect": {
        const text = confirmType === "require" ? "출현 번호" : "미출현 번호";

        return `${min}회차부터 ${max}회차 사이의 ${text}중 출현 횟수 하위 ${topNumber}개 번호를 사용하여 만든 조합입니다.`;
      }
      default:
        return "알 수 없는 조합입니다.";
    }
  };

  return (
    <Collapse
      style={{
        marginBottom: "20px",
        background: "#f5f5f5",
        borderRadius: "5px",
      }}
    >
      <Panel header="적용 중인 조합 보기" key="1">
        <Text>{renderCombinationDescription(latestDraw)}</Text>
      </Panel>
    </Collapse>
  );
};

export default CombinationDescription;

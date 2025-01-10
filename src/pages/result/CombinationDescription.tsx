import { Collapse, Typography } from "antd";
import React from "react";
import { getCombinationType, QueryParams } from "./result-service";
import { LottoDraw } from "lottopass-shared";
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
  const { type, data } = getCombinationType(queryParams);

  const renderCombinationDescription = () => {
    switch (type) {
      case "numberSelect":
        return `선택된 번호 ${data.selectedNumbers
          ?.sort((a, b) => a - b)
          .join(", ")} 가 ${
          data.confirmType === "require" ? "포함" : "제외"
        }된 조합입니다.`;
      case "numberControl": {
        const latestDrawNumber = latestDraw?.drawNumber || 0;
        const includedDrawNumbers = Array.from(
          { length: data.drawCount! },
          (_, i) => latestDrawNumber - i - 1
        );

        return `최근 ${data.drawCount}회차 (${includedDrawNumbers
          .map((num) => num.toString() + "회")
          .join(", ")})의 ${
          data.confirmType === "require" ? "출현" : "미출현"
        } 번호 중 최소 ${data.minCount}개의 번호를 사용하는 조합입니다.`;
      }
      case "rangeSelect":
        return `${data.min}회차부터 ${data.max}회차 사이의 당첨 번호를 사용하는 조합입니다.`;
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
        <Text>{renderCombinationDescription()}</Text>
      </Panel>
    </Collapse>
  );
};

export default CombinationDescription;

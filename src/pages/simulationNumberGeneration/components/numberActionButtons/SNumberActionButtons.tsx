/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Select } from "antd";
import styles from "./SNumberActionButtons.module.scss";
import PopupManager from "@/components/popup/PopupManager";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import {
  createSearchParams,
  getRecentDraws,
} from "@/pages/numberGeneration/components/numberActionButtons/utils";
import { generateOptions } from "@/pages/numberGeneration/components/numberActionButtons/options";
import { LottoDraw } from "lottopass-shared";

const { Text } = Typography;
const { Option } = Select;

const SNumberActionButtons = () => {
  const nonRemovedAllDraws = useAppSelector((state) => state.draw.allDraws);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [selectedDraws, setSelectedDraws] = useState<LottoDraw[]>(
    nonRemovedAllDraws.slice(selectedIdx)
  );

  const navigate = useNavigate();
  const [popupProps, setPopupProps] = useState<any | null>(null);

  const TOTAL_NUMBERS = Array.from({ length: 45 }, (_, i) => i + 1);

  const navigateToResult = (numbers: number[], minCount?: number) => {
    const queryParams = createSearchParams(numbers, minCount);
    queryParams.set("standardIdx", selectedIdx.toString());

    navigate(`/s-result?${queryParams.toString()}`);
  };

  const filterNumbers = (
    sourceNumbers: number[],
    confirmType: "exclude" | "require"
  ): number[] => {
    return confirmType === "require"
      ? sourceNumbers
      : TOTAL_NUMBERS.filter((num) => !sourceNumbers.includes(num));
  };

  // 번호 직접 선택
  const confirmNumberSelection = (
    numbers: number[],
    confirmType: "exclude" | "require"
  ) => {
    const filteredNumbers = filterNumbers(numbers, confirmType);
    navigateToResult(filteredNumbers);
  };

  // 회차와 최소 포함 개수 설정
  const confirmMinCountDrawSelection = (
    drawCount: number,
    minCount: number,
    confirmType: "exclude" | "require"
  ) => {
    const recentNumbers = getRecentDraws(selectedDraws, drawCount).flatMap(
      (round) => round.winningNumbers
    );

    const uniqueNumbers = Array.from(new Set(recentNumbers)).map(Number);
    const filteredNumbers = filterNumbers(uniqueNumbers, confirmType);

    navigateToResult(filteredNumbers, minCount);
  };

  // 특정 회차 범위의 번호 생성
  const generateRangeNumbers = (min: number, max: number) => {
    const draws = selectedDraws.filter(
      ({ drawNumber }) => drawNumber >= min && drawNumber <= max
    );

    const winningNumbers = draws
      .map(({ winningNumbers }) => winningNumbers)
      .flat()
      .map(Number);
    const uniqueNumbers = [...new Set(winningNumbers)];

    navigateToResult(uniqueNumbers);
  };

  const options = generateOptions(
    confirmNumberSelection,
    confirmMinCountDrawSelection,
    generateRangeNumbers,
    setPopupProps
  );

  useEffect(() => {
    setSelectedDraws(nonRemovedAllDraws.slice(selectedIdx + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdx]);

  return (
    <>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Text strong>시뮬레이션 당첨 회차 기준:</Text>
        <Select
          style={{ marginLeft: "10px", width: "200px" }}
          onChange={(value) => {
            setSelectedIdx(Number(value));
          }}
          value={selectedIdx}
        >
          {nonRemovedAllDraws.slice(1).map((draw, index) => (
            <Option value={index}>{draw.drawNumber}회</Option>
          ))}
        </Select>
      </div>
      <div className={styles.container}>
        <Row gutter={[24, 24]} justify="center">
          {options.map((option, index) => (
            <Col key={index} xs={24} sm={12}>
              <Card
                hoverable
                className={styles.optionCard}
                onClick={option.action}
              >
                <Text strong>{option.label.replace("\\n", "\n")}</Text>
              </Card>
            </Col>
          ))}
        </Row>
        <p className={styles.note}>
          <Text strong className={styles.highlight}>
            1~45
          </Text>
          의 모든 번호에서 생성합니다.
        </p>
      </div>
      {popupProps && <PopupManager {...popupProps} draws={selectedDraws} />}
    </>
  );
};

export default SNumberActionButtons;

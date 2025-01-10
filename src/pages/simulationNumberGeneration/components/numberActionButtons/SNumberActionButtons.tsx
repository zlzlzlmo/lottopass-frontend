/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Row, Col, Card, Typography } from "antd";
import styles from "./SNumberActionButtons.module.scss";
import PopupManager from "@/components/popup/PopupManager";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import {
  createSearchParams,
  getRecentDraws,
} from "@/pages/numberGeneration/components/numberActionButtons/utils";
import { generateOptions } from "@/pages/numberGeneration/components/numberActionButtons/options";

const { Text } = Typography;

const SNumberActionButtons = () => {
  const nonRemovedAllDraws = useAppSelector((state) => state.draw.allDraws);
  const allDraws = nonRemovedAllDraws.slice(1);

  const navigate = useNavigate();
  const [popupProps, setPopupProps] = useState<any | null>(null);

  const TOTAL_NUMBERS = Array.from({ length: 45 }, (_, i) => i + 1);

  const navigateToResult = (numbers: number[], minCount?: number) => {
    const queryParams = createSearchParams(numbers, minCount);
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
    const recentNumbers = getRecentDraws(allDraws, drawCount).flatMap(
      (round) => round.winningNumbers
    );

    const uniqueNumbers = Array.from(new Set(recentNumbers)).map(Number);
    const filteredNumbers = filterNumbers(uniqueNumbers, confirmType);

    navigateToResult(filteredNumbers, minCount);
  };

  // 특정 회차 범위의 번호 생성
  const generateRangeNumbers = (min: number, max: number) => {
    const draws = allDraws.filter(
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

  return (
    <>
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
      {popupProps && <PopupManager {...popupProps} />}
    </>
  );
};

export default SNumberActionButtons;

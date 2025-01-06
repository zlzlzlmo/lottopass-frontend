/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Row, Col, Card, Typography } from "antd";
import styles from "./NumberActionButtons.module.scss";
import PopupManager from "@/components/popup/PopupManager";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { options } from "./options.ts";
import { createSearchParams, getRecentDraws } from "./utils.ts";

const { Text } = Typography;

const NumberActionButtons = () => {
  const allDraws = useAppSelector((state) => state.draw.allDraws);
  const navigate = useNavigate();
  const [popupProps, setPopupProps] = useState<any | null>(null);

  const handleSelectConfirm = (
    selectedNumbers: number[],
    confirmType: "exclude" | "require"
  ) => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const res =
      confirmType === "require"
        ? selectedNumbers
        : allNumbers.filter((num) => !selectedNumbers.includes(num));
    const queryParams = createSearchParams(res);
    navigate(`/result?${queryParams.toString()}`);
  };

  const handleControlConfirm = (
    roundCount: number,
    minCount: number,
    confirmType: "exclude" | "require"
  ) => {
    const recentNumbers = getRecentDraws(allDraws, roundCount).flatMap(
      (round) => round.winningNumbers
    );
    const uniqueNumbers = Array.from(new Set(recentNumbers));
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const res =
      confirmType === "require"
        ? uniqueNumbers
        : allNumbers.filter((num) => !uniqueNumbers.includes(num));

    const queryParams = createSearchParams(res, minCount);
    navigate(`/result?${queryParams.toString()}`);
  };

  const handleRangeSelect = (min: number, max: number) => {
    const draws = allDraws.filter(
      ({ drawNumber }) => drawNumber >= min && drawNumber <= max
    );

    const winningNumbers = draws
      .map(({ winningNumbers }) => winningNumbers)
      .flat()
      .map(Number);
    const uniqueWinningNumbers = [...new Set(winningNumbers)];
    console.log("winningNumbers :", uniqueWinningNumbers);
  };

  return (
    <>
      <div className={styles.container}>
        <Row gutter={[24, 24]} justify="center">
          {options(
            handleSelectConfirm,
            handleControlConfirm,
            setPopupProps,
            handleRangeSelect
          ).map((option, index) => (
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

export default NumberActionButtons;

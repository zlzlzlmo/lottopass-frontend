/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Row, Col, Card, Typography } from "antd";
import styles from "./NumberActionButtons.module.scss";
import PopupManager from "@/components/popup/PopupManager";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { generateOptions } from "./options.ts";
import { createQueryParams } from "./utils.ts";
import { QueryParams } from "@/pages/result/result-service.ts";

const { Text } = Typography;

const NumberActionButtons = () => {
  const allDraws = useAppSelector((state) => state.draw.allDraws);
  const navigate = useNavigate();
  const [popupProps, setPopupProps] = useState<any | null>(null);

  const navigateToResult = (param: QueryParams) => {
    const queryParams = createQueryParams(param);
    navigate(`/result${queryParams}`);
  };

  const confirmNumberSelection = (
    selectedNumbers: number[],
    confirmType: "exclude" | "require"
  ) => {
    navigateToResult({ selectedNumbers, confirmType });
  };

  // 회차와 최소 포함 개수 설정
  const confirmMinCountDrawSelection = (
    drawCount: number,
    minCount: number,
    confirmType: "exclude" | "require"
  ) => {
    navigateToResult({ drawCount, minCount, confirmType });
  };

  // 특정 회차 범위의 번호 생성
  const generateRangeNumbers = (min: number, max: number) => {
    navigateToResult({ min, max });
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
      {popupProps && <PopupManager {...popupProps} draws={allDraws} />}
    </>
  );
};

export default NumberActionButtons;

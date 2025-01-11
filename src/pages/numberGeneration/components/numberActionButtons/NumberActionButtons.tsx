/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Row, Col, Card, Typography } from "antd";

import PopupManager from "@/components/popup/PopupManager";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { generateOptions } from "./options.ts";
import { createQueryParams } from "./utils.ts";
import { QueryParams } from "@/pages/result/result-service.ts";
import COLORS from "@/constants/colors.ts";
import { ROUTES } from "@/constants/routes.ts";

const { Text } = Typography;

const NumberActionButtons = () => {
  const allDraws = useAppSelector((state) => state.draw.allDraws);
  const navigate = useNavigate();
  const [popupProps, setPopupProps] = useState<any | null>(null);
  const location = useLocation();
  const navigateToResult = (param: QueryParams) => {
    const queryParams = createQueryParams(param);

    if (location.pathname === ROUTES.NUMBER_GENERATION.path) {
      navigate(`/result${queryParams}`);
      return;
    }

    navigate(`/s-result${queryParams}`);
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
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            color: COLORS.PRIMARY,
          }}
        >
          <Text strong style={{ color: COLORS.PRIMARY }}>
            1~45
          </Text>
          의 모든 번호에서 생성합니다.
        </div>
        <Row justify="center" style={{ gap: "10px" }}>
          {options.map((option, index) => (
            <Col key={index} xs={8} sm={8}>
              <Card
                hoverable
                onClick={option.action}
                style={{ textAlign: "center", borderColor: COLORS.NAVY_BLUE }}
              >
                <Text strong style={{ whiteSpace: "pre-line" }}>
                  {option.label.replace("\\n", "\n")}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {popupProps && <PopupManager {...popupProps} draws={allDraws} />}
    </>
  );
};

export default NumberActionButtons;

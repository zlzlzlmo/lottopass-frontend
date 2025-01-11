/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Row, Card, Typography } from "antd";

import PopupManager from "@/components/popup/PopupManager";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { generateOptions } from "./options.ts";
import { createQueryParams } from "./utils.ts";
import { QueryParams } from "@/pages/result/result-service.ts";
import COLORS from "@/constants/colors.ts";
import { ROUTES } from "@/constants/routes.ts";

const { Text } = Typography;

export type ConfirmType = "exclude" | "require";

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
    confirmType: ConfirmType
  ) => {
    navigateToResult({ selectedNumbers, confirmType, type: "numberSelect" });
  };

  // 회차와 최소 포함 개수 설정
  const confirmMinCountDrawSelection = (
    drawCount: number,
    minCount: number,
    confirmType: ConfirmType
  ) => {
    navigateToResult({
      drawCount,
      minCount,
      confirmType,
      type: "numberControl",
    });
  };

  // 특정 회차 범위의 번호 생성
  const generateRangeNumbers = (
    min: number,
    max: number,
    confirmType: ConfirmType
  ) => {
    navigateToResult({ min, max, confirmType, type: "rangeSelect" });
  };

  const confirmEvenOddSelection = (
    even: number,
    odd: number,
    confirmType: ConfirmType
  ) => {
    navigateToResult({ even, odd, confirmType, type: "evenOddControl" });
  };
  const options = generateOptions(
    setPopupProps,
    confirmNumberSelection,
    confirmMinCountDrawSelection,
    generateRangeNumbers,
    confirmEvenOddSelection
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
        <Row
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {options.map((option, index) => (
            <Card
              key={index}
              hoverable
              onClick={option.action}
              style={{
                textAlign: "center",
                borderColor: COLORS.NAVY_BLUE,
                width: "100%",
                height: "100%",
              }}
            >
              <Text strong style={{ whiteSpace: "pre-line" }}>
                {option.label.replace("\\n", "\n")}
              </Text>
            </Card>
          ))}
        </Row>
      </div>
      {popupProps && <PopupManager {...popupProps} draws={allDraws} />}
    </>
  );
};

export default NumberActionButtons;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
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

  const generateRangeAndTopNumbers = (
    min: number,
    max: number,
    topNumber: number,
    confirmType: ConfirmType
  ) => {
    navigateToResult({
      min,
      max,
      confirmType,
      topNumber,
      type:
        confirmType === "require"
          ? "rangeAndTopNumberSelect"
          : "rangeAndBottomNumberSelect",
    });
  };

  const options = generateOptions(
    setPopupProps,
    confirmNumberSelection,
    confirmMinCountDrawSelection,
    generateRangeNumbers,
    confirmEvenOddSelection,
    generateRangeAndTopNumbers,
    generateRangeAndTopNumbers
  );

  const totalCards = options.length;
  const comingSoonCards = totalCards % 2 === 0 ? 2 : 1;

  const extendedOptions = [
    ...options,
    ...Array.from({ length: comingSoonCards }).map(() => ({
      label: "COMING SOON",
      action: () => {},
    })),
  ];

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
          {extendedOptions.map((option, index) => (
            <Card
              key={index}
              hoverable={option.label !== "COMING SOON"}
              onClick={option.action}
              style={{
                textAlign: "center",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                borderColor: COLORS.NAVY_BLUE,
                width: "100%",
                height: "100%",
                backgroundColor:
                  option.label === "COMING SOON" ? COLORS.NEUTRAL : undefined,
              }}
            >
              <Text
                strong
                style={{
                  whiteSpace: "pre-line",
                  color:
                    option.label === "COMING SOON" ? COLORS.PRIMARY : undefined,
                }}
              >
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

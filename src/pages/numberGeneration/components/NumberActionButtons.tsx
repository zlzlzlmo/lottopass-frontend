/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Row, Col, Card, Typography } from "antd";
import styles from "./NumberActionButtons.module.scss";
import PopupManager from "@/components/popup/PopupManager";
import {
  setRequiredNumbers,
  setMinCount,
} from "@/context/lottoNumber/lottoNumberActions";
import { useLotto } from "@/context/lottoNumber/lottoNumberContext";
import { useRounds } from "@/context/rounds/roundsContext";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface Option {
  label: string;
  action?: () => void;
  tooltip?: string;
}

interface PopupProps {
  popupType: "numberSelect" | "numberControl";
  onClose: () => void;
  onConfirm: (...args: any[]) => void;
  [key: string]: any;
}

const NumberActionButtons = () => {
  const navigate = useNavigate();
  const { state } = useRounds();
  const { allRounds } = state;
  const [popupProps, setPopupProps] = useState<PopupProps | null>(null);

  const { dispatch } = useLotto();

  const getRecentRounds = (roundCount: number) => {
    return allRounds.slice(0, roundCount);
  };

  const handleSelectConfirm = (
    selectedNumbers: number[],
    confirmType: "exclude" | "require"
  ) => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const nonSelectedNumbers = allNumbers.filter(
      (num) => !selectedNumbers.includes(num)
    );

    const res =
      confirmType === "require" ? selectedNumbers : nonSelectedNumbers;

    dispatch(setRequiredNumbers(res));
    navigate("/result");
  };

  const handleControlConfirm = (
    roundCount: number,
    minCount: number,
    confirmType: "exclude" | "require"
  ) => {
    const recentRounds = getRecentRounds(roundCount);

    const recentNumbers = [
      ...new Set(recentRounds.flatMap((round) => round.winningNumbers)),
    ];

    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

    const nonRecentNumbers = allNumbers.filter(
      (num) => !recentNumbers.includes(num)
    );

    const res = confirmType === "require" ? recentNumbers : nonRecentNumbers;
    dispatch(setRequiredNumbers(res));
    dispatch(setMinCount(minCount));

    navigate("/result");
  };

  const createPopupAction = (
    popupType: PopupProps["popupType"],
    confirmType: "exclude" | "require",
    onConfirm: (...args: any[]) => void
  ) => {
    return () => {
      setPopupProps({
        popupType,
        confirmType,
        onClose: () => setPopupProps(null),
        onConfirm,
      });
    };
  };

  const options: Option[] = [
    {
      label: "제외 번호\n직접 선택",
      action: createPopupAction(
        "numberSelect",
        "exclude",
        (numbers: number[]) => handleSelectConfirm(numbers, "exclude")
      ),
    },
    {
      label: "필수 번호\n직접 선택",
      action: createPopupAction(
        "numberSelect",
        "require",
        (numbers: number[]) => handleSelectConfirm(numbers, "require")
      ),
    },
    {
      label: "미출현 번호\n조합",
      action: createPopupAction(
        "numberControl",
        "exclude",
        (roundCount: number, minCount: number) =>
          handleControlConfirm(roundCount, minCount, "exclude")
      ),
    },
    {
      label: "출현 번호\n조합",
      action: createPopupAction(
        "numberControl",
        "require",
        (roundCount: number, minCount: number) =>
          handleControlConfirm(roundCount, minCount, "require")
      ),
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <Row gutter={[24, 24]} justify="center" style={{ columnGap: 16 }}>
          {options.map((option, index) => (
            <Col key={index} xs={24} sm={11}>
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

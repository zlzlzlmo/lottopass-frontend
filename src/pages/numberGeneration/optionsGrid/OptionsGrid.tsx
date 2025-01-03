/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import styles from "./OptionsGrid.module.scss";
import { useNavigate } from "react-router-dom";
import PopupManager from "../../../components/popup/PopupManager";
import { useRounds } from "../../../context/rounds/roundsContext";
import { useLotto } from "../../../context/lottoNumber/lottoNumberContext";
import {
  setMinCount,
  setRequiredNumbers,
} from "../../../context/lottoNumber/lottoNumberActions";
import PageTitle from "../../../components/common/text/title/PageTitle";

interface Option {
  label: string; // 옵션의 텍스트
  rank: string | null; // 순위 표시
  action?: () => void; // 실행할 작업
  tooltip?: string; // 툴팁 내용
}

interface PopupProps {
  popupType: "numberSelect" | "numberControl";
  onClose: () => void;
  onConfirm: (...args: any[]) => void;
  [key: string]: any; // 추가 속성 허용
}

const OptionsGrid: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useRounds();
  const { allRounds } = state;
  const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

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
    // 그냥 미출현은 미출현 데이터가, 출현은 출현데이터가 필수 넘버면됨
    // 그리고 minCount는 그냥 따로 저장해서 minCount ~ 6개의 넘버로 랜덤뽑고
    // required를 shuffled하고 slice를 하면됨
    // 이걸 available에 저장하고, 뒤에 allNumber 중복값 제거해서 붙이고 slice 0 6하면됨.

    // 최근 N회차 데이터 가져오기
    const recentRounds = getRecentRounds(roundCount);

    // 최근 N회차 당첨 번호 추출
    const recentNumbers = [
      ...new Set(recentRounds.flatMap((round) => round.winningNumbers)),
    ];
    console.log("Recent Numbers:", recentNumbers);

    // 전체 번호: 1~45
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

    // 미출현 번호 = 전체 번호 - 최근 N회차 당첨 번호
    const nonRecentNumbers = allNumbers.filter(
      (num) => !recentNumbers.includes(num)
    );

    // const randomCount = getRandomNum(minCount, len);

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
      rank: null,
      action: createPopupAction(
        "numberSelect",
        "exclude",
        (numbers: number[]) => handleSelectConfirm(numbers, "exclude")
      ),
    },
    {
      label: "필수 번호\n직접 선택",
      rank: null,
      action: createPopupAction(
        "numberSelect",
        "require",
        (numbers: number[]) => handleSelectConfirm(numbers, "require")
      ),
    },
    {
      label: "미출현 번호\n조합",
      rank: null,
      action: createPopupAction(
        "numberControl",
        "exclude",
        (roundCount: number, minCount: number) =>
          handleControlConfirm(roundCount, minCount, "exclude")
      ),
      tooltip: "최근 N회차 동안 미출현 번호를 포함한 조합",
    },
    {
      label: "출현 번호\n조합",
      rank: null,
      action: createPopupAction(
        "numberControl",
        "require",
        (roundCount: number, minCount: number) =>
          handleControlConfirm(roundCount, minCount, "require")
      ),
      tooltip: "최근 N회차 동안 당첨된 번호를 포함한 조합",
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <PageTitle>로또번호 생성 방식을 선택하세요</PageTitle>
        <div className={styles.optionsGrid}>
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.optionButton}
              onClick={option.action}
              onMouseEnter={() => setTooltipIndex(index)}
              onMouseLeave={() => setTooltipIndex(null)}
            >
              <span>{option.label.replace("\\n", "\n")}</span>
              {tooltipIndex === index && option.tooltip && (
                <div className={styles.tooltip}>{option.tooltip}</div>
              )}
            </div>
          ))}
        </div>

        <p className={styles.note}>
          <span className={styles.highlight}>1~45</span>의 모든 번호에서
          생성합니다.
        </p>
      </div>

      {popupProps && <PopupManager {...popupProps} />}
    </>
  );
};

export default OptionsGrid;

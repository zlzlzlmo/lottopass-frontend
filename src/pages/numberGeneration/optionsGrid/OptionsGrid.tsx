import React, { useState } from "react";
import styles from "./OptionsGrid.module.scss";
import { useNavigate } from "react-router-dom";
import PopupManager from "../../../components/popup/PopupManager";
import { shuffle } from "../../../utils/number";
import { useRounds } from "../../../context/rounds/roundsContext";
import { useLotto } from "../../../context/lottoNumber/lottoNumberContext";
import {
  setExcludeNumbers,
  setMinCount,
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
  const { allRounds } = useRounds();
  const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const { dispatch } = useLotto();

  const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

  const getRecentRounds = (roundCount: number) => {
    return allRounds.slice(-roundCount);
  };

  const handleConfirm = (
    selectedNumbers: number[],
    confirmType: "exclude" | "require"
  ) => {
    if (confirmType === "exclude") {
      dispatch(setExcludeNumbers(selectedNumbers));
    } else {
      const excludedNums = allNumbers.filter(
        (num) => !selectedNumbers.includes(num)
      );

      dispatch(setExcludeNumbers(excludedNums));
    }
    navigate("/result");
  };

  const handleControlConfirm = (
    roundCount: number,
    minCount: number,
    confirmType: "exclude" | "require"
  ) => {
    const recentRounds = getRecentRounds(roundCount);
    const recentNumbers = shuffle(
      recentRounds.flatMap((round) => round.winningNumbers)
    );

    const uniqueNumbers = [...new Set(recentNumbers)];

    let filteredNumbers;

    if (confirmType === "exclude") {
      filteredNumbers = allNumbers.filter((num) => uniqueNumbers.includes(num));
    } else {
      filteredNumbers = allNumbers.filter(
        (num) => !uniqueNumbers.includes(num)
      );
    }

    const excludedNums = shuffle(filteredNumbers);
    dispatch(setMinCount(minCount));
    dispatch(setExcludeNumbers(excludedNums));

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
        (numbers: number[]) => handleConfirm(numbers, "exclude")
      ),
    },
    {
      label: "필수 번호\n직접 선택",
      rank: null,
      action: createPopupAction(
        "numberSelect",
        "require",
        (numbers: number[]) => handleConfirm(numbers, "require")
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

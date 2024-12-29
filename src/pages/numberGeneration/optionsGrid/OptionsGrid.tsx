import React, { useState } from "react";
import styles from "./OptionsGrid.module.scss";
import { useNavigate } from "react-router-dom";
import { useLottoNumber } from "../../../context/lottoNumbers";
import PopupManager from "../../../components/popup/PopupManager";

interface Option {
  label: string; // 옵션의 텍스트
  rank: string | null; // 순위 표시
  action?: () => void; // 실행할 작업
  tooltip?: string; // 툴팁 내용
}

interface PopupProps {
  popupType: "numberSelect" | "recentRounds";
  maxSelection: number;
  confirmType: "exclude" | "require";
  onClose: () => void;
  onConfirm: (selectedNumbers: number[]) => void;
}

const OptionsGrid: React.FC = () => {
  const navigate = useNavigate();
  const [popupProps, setPopupProps] = useState<PopupProps | null>(null);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const {
    state: { excludedNumbers },
    dispatch,
  } = useLottoNumber();

  const handleConfirm = (
    selectedNumbers: number[],
    confirmType: "exclude" | "require"
  ) => {
    if (confirmType === "exclude") {
      dispatch({ type: "SET_EXCLUDED_NUMBERS", payload: selectedNumbers });
    } else if (confirmType === "require") {
      const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
      const excludedNums = allNumbers.filter(
        (num) => !selectedNumbers.includes(num)
      );

      dispatch({ type: "SET_EXCLUDED_NUMBERS", payload: excludedNums });
    }
    navigate("/result");
  };

  const maxExcludeSelection = 45 - 6; // 제외 번호 최대 선택 가능 수
  const maxRequireSelection = Math.max(6 - excludedNumbers.length, 1); // 필수 번호 최대 선택 가능 수

  const options: Option[] = [
    {
      label: "제외 번호\n직접 선택",
      rank: null,
      action: () => {
        setPopupProps({
          popupType: "numberSelect",
          maxSelection: maxExcludeSelection,
          confirmType: "exclude",
          onClose: () => setPopupProps(null),
          onConfirm: (numbers) => handleConfirm(numbers, "exclude"),
        });
      },
    },
    {
      label: "필수 번호\n직접 선택",
      rank: null,
      action: () => {
        setPopupProps({
          popupType: "numberSelect",
          maxSelection: maxRequireSelection,
          confirmType: "require",
          onClose: () => setPopupProps(null),
          onConfirm: (numbers) => handleConfirm(numbers, "require"),
        });
      },
    },
    {
      label: "미출현 번호\n조합",
      rank: null,
      action: () => {
        setPopupProps({
          popupType: "numberSelect",
          maxSelection: maxRequireSelection,
          confirmType: "require",
          onClose: () => setPopupProps(null),
          onConfirm: (numbers) => handleConfirm(numbers, "require"),
        });
      },
      tooltip: "최근 N회차 동안 당첨되지 않은 번호를 제외한 조합",
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.subtitle}>로또번호 생성 방식을 선택하세요.</h2>
        <div className={styles.optionsGrid}>
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.optionButton}
              onClick={() => {
                if (option.action) option.action();
              }}
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

import React, { useState } from "react";
import styles from "./OptionsGrid.module.scss";
import { useNavigate } from "react-router-dom";
import { useLottoNumber } from "../../../context/lottoNumbers";
import PopupManager from "../../../components/popup/PopupManager";

// 옵션 타입 정의
interface Option {
  label: string; // 옵션의 텍스트
  rank: string | null; // 순위 표시 (예: "1위")
  action?: () => void; // 실행할 작업
}

// PopupProps 타입 정의
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
      dispatch({ type: "SET_REQUIRED_NUMBERS", payload: selectedNumbers });
    }
    navigate("/result");
  };

  const maxExcludeSelection = 45 - 6; // 제외 번호 최대 선택 가능 수
  const maxRequireSelection = Math.max(6 - excludedNumbers.length, 1); // 필수 번호 최대 선택 가능 수

  // 옵션 배열
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
      label: `필수 번호\n직접 선택`,
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
                if (option.action) option.action(); // 작업 실행
              }}
            >
              <span>{option.label.replace("\\n", "\n")}</span>
              {option.rank && (
                <div className={styles.rankTag}>선택 {option.rank}</div>
              )}
            </div>
          ))}
        </div>

        <p className={styles.note}>
          <span className={styles.highlight}>1~45</span>의 모든 번호에서
          생성합니다.
        </p>
      </div>

      {/* PopupManager */}
      {popupProps && <PopupManager {...popupProps} />}
    </>
  );
};

export default OptionsGrid;

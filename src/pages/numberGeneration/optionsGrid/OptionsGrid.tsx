import React, { useState } from "react";
import styles from "./OptionsGrid.module.scss";
import { useNavigate } from "react-router-dom";
import PopupModal from "../../../components/common/popup/PopupModal";
import { useLottoNumber } from "../../../context/lottoNumbers";
import { useRounds } from "../../../context/rounds";
import { shuffle } from "../../../utils/number";

// 옵션 타입 정의
interface Option {
  label: string; // 옵션의 텍스트
  rank: string | null; // 순위 표시 (예: "1위")
  path: string; // 이동할 경로
  action?: () => void; // 실행할 작업
}

const OptionsGrid: React.FC = () => {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState<boolean>(false); // 팝업 표시 여부
  const recentRoundsNum = 5;

  const {
    state: { roundCount },
    dispatch,
  } = useLottoNumber();

  const { getRecentRounds } = useRounds();

  const handleRecentRounds = () => {
    const recentRounds = getRecentRounds(roundCount);

    const recentWinningRounds = new Set(
      recentRounds.flatMap((round) => round.winningNumbers)
    );

    const requiredNumbers = shuffle([...recentWinningRounds].map(Number));
    dispatch({ type: "SET_REQUIRED_NUMBERS", payload: requiredNumbers });
  };

  // 옵션 배열
  const options: Option[] = [
    {
      label: "제외 번호\n직접 선택",
      rank: null,
      path: "/exclude-numbers",
    },
    {
      label: `최근 ${recentRoundsNum}회차\n번호 조합`,
      rank: null,
      path: "/result",
      action: () => {
        handleRecentRounds();
      },
    },
    { label: "제외 없이\n번호 생성", rank: "1위", path: "/result" },
    {
      label: "최근 N회차\n최소 K개\n번호조합",
      rank: null,
      path: "",
      action: () => {
        setShowPopup(true);
      },
    },
    { label: "미 출현\n번호조합", rank: null, path: "/missing-numbers" },
    { label: "직전 회차\n번호제외", rank: null, path: "/exclude-last-round" },
    { label: "짝수 4개\n홀수 2개", rank: null, path: "/even-4-odd-2" },
    { label: "홀수 4개\n짝수 2개", rank: null, path: "/odd-4-even-2" },
    { label: "짝수 3개\n홀수 3개", rank: "3위", path: "/even-3-odd-3" },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>로또번호 생성 방식을 선택하세요.</h2>
      <div className={styles.optionsGrid}>
        {options.map((option, index) => (
          <div
            key={index}
            className={styles.optionButton}
            onClick={() => {
              if (option.action) option.action(); // 작업 실행
              if (option.path) navigate(option.path); // 경로 이동
            }}
          >
            <span>{option.label.replace("\\n", "\n")}</span>
            {option.rank && (
              <div className={styles.rankTag}>선택 {option.rank}</div>
            )}
          </div>
        ))}
      </div>
      {showPopup && (
        <PopupModal
          onConfirm={() => {
            handleRecentRounds();
            navigate("/result");
          }} // 팝업에서 입력한 값 처리
          onClose={() => setShowPopup(false)} // 팝업 닫기
        />
      )}
      <p className={styles.note}>
        <span className={styles.highlight}>1~45</span>의 모든 번호에서
        생성합니다.
      </p>
    </div>
  );
};

export default OptionsGrid;

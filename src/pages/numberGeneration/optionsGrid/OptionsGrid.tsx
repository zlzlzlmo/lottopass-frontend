import React from "react";
import styles from "./OptionsGrid.module.scss";
import { useNavigate } from "react-router-dom";

const OptionsGrid: React.FC = () => {
  const navigate = useNavigate();
  const options = [
    { label: "제외 번호\n직접 선택", rank: null, path: "/exclude-numbers" },
    { label: "최근 당첨\n번호 조합", rank: null },
    { label: "제외 없이\n번호 생성", rank: "1위" },
    { label: "수동으로\n번호 선택", rank: null },
    { label: "미 출현\n번호조합", rank: null },
    { label: "직전 회차\n번호제외", rank: null },
    { label: "짝수 4개\n홀수 2개", rank: null },
    { label: "홀수 4개\n짝수 2개", rank: null },
    { label: "짝수 3개\n홀수 3개", rank: "3위" },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>로또번호 생성 방식을 선택하세요.</h2>
      <div className={styles.optionsGrid}>
        {options.map((option, index) => (
          <div
            key={index}
            className={styles.optionButton}
            onClick={() => navigate(option.path ?? "")}
          >
            <span>{option.label.replaceAll("\\n", "\n")}</span>
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
      <button className={styles.confirmButton} onClick={() => {}}>
        확인 →
      </button>
    </div>
  );
};

export default OptionsGrid;

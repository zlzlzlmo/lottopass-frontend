import React, { useState } from "react";
import styles from "./Result.module.scss";
import Layout from "../../components/layout/Layout";
import { getBallColor } from "../../utils/ballColor";
import { useLotto } from "../../context/lottoNumber/lottoNumberContext";

const Result: React.FC = () => {
  const maxResultsLen = 20;

  const { generateNumbers } = useLotto();

  // 초기 결과 복원
  const [results, setResults] = useState<number[][]>(() =>
    Array.from({ length: 5 }, () => generateNumbers())
  );

  // 결과 추가
  const handleAddResult = () => {
    if (results.length >= maxResultsLen) {
      alert(`최대 ${maxResultsLen}줄까지만 추가할 수 있습니다.`);
      return;
    }

    const newResult = generateNumbers();
    setResults([...results, newResult]);
  };

  // 특정 결과 삭제
  const handleDeleteResult = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>완성 조합</h1>
        {}
        <div className={styles.list}>
          {results.map((result, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.numbers}>
                {result.map((num, idx) => (
                  <div
                    key={idx}
                    className={`${styles.number}`}
                    style={{ backgroundColor: getBallColor(num) }}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteResult(index)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className={styles.footer}>
          <button className={styles.addButton} onClick={handleAddResult}>
            +
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Result;

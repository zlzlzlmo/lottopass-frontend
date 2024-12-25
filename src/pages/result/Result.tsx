import React, { useState } from "react";
import styles from "./Result.module.scss";
import Layout from "../../components/layout/Layout";
import { useLottoNumber } from "../../context/lottoNumbers";

const Result: React.FC = () => {
  const maxResultsLen = 20;
  const { generateNumbers } = useLottoNumber();

  // 초기값: generateNumbers를 5번 실행하여 배열 생성
  const initialResults = Array.from({ length: 5 }, () => generateNumbers());
  const [results, setResults] = useState<number[][]>(initialResults);

  const handleAddResult = () => {
    if (results.length >= maxResultsLen) {
      alert(`최대 ${maxResultsLen}줄까지만 추가할 수 있습니다.`);
      return;
    }

    const newResult = generateNumbers();
    setResults([...results, newResult]);
  };

  const handleDeleteResult = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>결과 페이지</h1>
        <div className={styles.list}>
          {results.map((result, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.numbers}>
                {result.map((num, idx) => (
                  <div
                    key={idx}
                    className={`${styles.number} ${
                      num <= 10
                        ? styles.yellow
                        : num <= 20
                        ? styles.blue
                        : num <= 30
                        ? styles.red
                        : num <= 40
                        ? styles.gray
                        : styles.green
                    }`}
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
        <button className={styles.addButton} onClick={handleAddResult}>
          +
        </button>
      </div>
    </Layout>
  );
};

export default Result;

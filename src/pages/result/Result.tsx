import React, { useEffect, useState } from "react";
import styles from "./Result.module.scss";
import Layout from "../../components/layout/Layout";
import { useLottoNumber } from "../../context/lottoNumbers";

const Result: React.FC = () => {
  const maxResultsLen = 20; // 최대 결과 줄 수
  const {
    generateNumbers,
    dispatch,
    state: { excludedNumbers, requiredNumbers },
  } = useLottoNumber();

  // 초기 결과 조합
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

  // 상태 초기화
  useEffect(() => {
    return () => {
      dispatch({ type: "RESET" });
    };
  }, [dispatch]);

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>결과 페이지</h1>

        {/* 제외 번호 및 필수 번호 표시 */}
        <div className={styles.conditions}>
          <h2>선택 조건</h2>
          <p>
            <strong>제외 번호:</strong>{" "}
            {excludedNumbers.length
              ? excludedNumbers.join(", ")
              : "선택된 제외 번호 없음"}
          </p>
          <p>
            <strong>필수 번호:</strong>{" "}
            {requiredNumbers.length
              ? requiredNumbers.join(", ")
              : "선택된 필수 번호 없음"}
          </p>
        </div>

        {/* 결과 리스트 */}
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

        {/* 결과 추가 버튼 */}
        <button className={styles.addButton} onClick={handleAddResult}>
          +
        </button>
      </div>
    </Layout>
  );
};

export default Result;

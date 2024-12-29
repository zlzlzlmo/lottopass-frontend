import React, { useEffect, useState } from "react";
import styles from "./Result.module.scss";
import Layout from "../../components/layout/Layout";
import { useLottoNumber } from "../../context/lottoNumbers";
import { getBallColor } from "../../utils/ballColor";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
} from "../../utils/storage";

const Result: React.FC = () => {
  const maxResultsLen = 20; // 최대 결과 줄 수
  const localStorageKey = "lottoResults";

  const {
    generateNumbers,
    state: { excludedNumbers, requiredNumbers },
    dispatch,
  } = useLottoNumber();

  // 초기 결과 복원
  const [results, setResults] = useState<number[][]>(() =>
    loadFromLocalStorage<number[][]>(
      localStorageKey,
      Array.from({ length: 5 }, () => generateNumbers())
    )
  );

  // 결과 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    const storageResults =
      results.length <= 0
        ? Array.from({ length: 5 }, () => generateNumbers())
        : results;
    saveToLocalStorage(localStorageKey, storageResults);
  }, [results]);

  // 컴포넌트 언마운트 시 상태 초기화
  useEffect(() => {
    return () => {
      dispatch({ type: "RESET" });
    };
  }, [dispatch]);

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
        {/* 조건 표시 */}
        <div className={styles.conditions}>
          <p>
            <strong>제외 번호:</strong>{" "}
            {excludedNumbers.length
              ? excludedNumbers.sort((a, b) => a - b).join(", ")
              : "선택된 제외 번호 없음"}
          </p>
          <p>
            <strong>필수 번호:</strong>{" "}
            {requiredNumbers.length
              ? requiredNumbers.sort((a, b) => a - b).join(", ")
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

        {/* 하단 버튼 */}
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

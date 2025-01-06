import React, { useState } from "react";
import styles from "./ResultPage.module.scss";
import Layout from "../../components/layout/Layout";
import { getRandomNum, shuffle } from "@/utils/number";
import { useSearchParams } from "react-router-dom";
import NumberContainer from "@/components/common/number/NumberContainer";
import PageTitle from "@/components/common/text/title/PageTitle";

const ResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const minCount = searchParams.get("minCount") ?? 6;
  const requiredNumbers =
    searchParams.get("requiredNumbers")?.split(",").map(Number) ?? [];
  const maxResultsLen = 20;

  const generateNumbers = (): number[] => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const randomIdx = getRandomNum(Number(minCount), 6);
    const availableNumbers = shuffle(requiredNumbers).slice(0, randomIdx);

    return Array.from(new Set([...availableNumbers, ...shuffle(allNumbers)]))
      .slice(0, 6)
      .sort((a, b) => a - b);
  };

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
        <PageTitle>완성된 번호 조합</PageTitle>
        {}
        <div className={styles.list}>
          {results.map((numbers, index) => (
            <div key={index} className={styles.card}>
              <NumberContainer numbers={numbers} />
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

export default ResultPage;

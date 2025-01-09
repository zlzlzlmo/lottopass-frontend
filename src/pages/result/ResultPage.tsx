import React, { useState } from "react";
import styles from "./ResultPage.module.scss";
import Layout from "../../components/layout/Layout";
import { getRandomNum, shuffle } from "@/utils/number";
import { useSearchParams } from "react-router-dom";
import { Button, Space, message } from "antd";

import LuckyNumberCard from "@/components/common/card/LuckyNumberCard";
import StatisticsPopup from "@/components/popup/StatisticPopup";
import { useAppSelector } from "@/redux/hooks";

const ResultPage: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [searchParams] = useSearchParams();
  const lottoHistory = useAppSelector((state) => state.draw.allDraws);

  const minCount = searchParams.get("minCount") ?? 6;
  const requiredNumbers =
    searchParams.get("requiredNumbers")?.split(",").map(Number) ?? [];
  const maxResultsLen = 20;

  const generateNumbers = (): number[] => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const len = requiredNumbers.length;
    const randomIdx = getRandomNum(Math.min(Number(minCount), len), len);

    const availableNumbers = shuffle(requiredNumbers).slice(0, randomIdx);

    return Array.from(new Set([...availableNumbers, ...shuffle(allNumbers)]))
      .slice(0, 6)
      .sort((a, b) => a - b);
  };

  const [results, setResults] = useState<number[][]>(() =>
    Array.from({ length: 5 }, () => generateNumbers())
  );

  const [savedStatus, setSavedStatus] = useState<boolean[]>(
    Array.from({ length: results.length }, () => false)
  );

  const handleAddResult = () => {
    if (results.length >= maxResultsLen) {
      message.warning(`최대 ${maxResultsLen}줄까지만 추가할 수 있습니다.`);
      return;
    }

    const newResult = generateNumbers();
    setResults([...results, newResult]);
    setSavedStatus([...savedStatus, false]);
  };

  const handleDeleteResult = (index: number) => {
    const updatedResults = results.filter((_, i) => i !== index);
    setResults(updatedResults);

    const updatedSavedStatus = savedStatus.filter((_, i) => i !== index);
    setSavedStatus(updatedSavedStatus);

    message.success("번호 조합이 삭제되었습니다.");
  };

  // const handleSaveResult = async (numbers: number[], index: number) => {
  //   try {
  //     await numberService.setNumberCombination(numbers);

  //     const updatedSavedStatus = [...savedStatus];
  //     updatedSavedStatus[index] = true;
  //     setSavedStatus(updatedSavedStatus);

  //     message.success("번호 조합이 저장되었습니다.");
  //   } catch (error) {
  //     console.error("error :", error);
  //     message.error("저장에 실패했습니다. 다시 시도해주세요.");
  //   }
  // };

  const handleRegenerate = (index: number) => {
    const updatedResults = results.map((numbers, i) =>
      i === index ? generateNumbers() : numbers
    );
    setResults(updatedResults);

    const updatedSavedStatus = [...savedStatus];
    updatedSavedStatus[index] = false;
    setSavedStatus(updatedSavedStatus);

    message.info("번호가 다시 생성되었습니다.");
  };

  const handleViewStatistics = (index: number) => {
    setNumbers(results[index]);
    setVisible(true);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", padding: "0 16px" }}
        >
          {results.map((numbers, index) => (
            <LuckyNumberCard
              numbers={numbers}
              index={index}
              onDelete={handleDeleteResult}
              onViewStatistics={handleViewStatistics}
              onRegenerate={handleRegenerate}
            />
          ))}
        </Space>
        {
          <StatisticsPopup
            visible={visible}
            onClose={() => {
              setVisible(false);
              setNumbers([]);
            }}
            numbers={numbers}
            lottoHistory={lottoHistory}
          />
        }

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={handleAddResult}
          >
            +
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ResultPage;

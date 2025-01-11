import React, { useCallback, useEffect, useState } from "react";
import styles from "./ResultPage.module.scss";
import Layout from "../../components/layout/Layout";
import { getRandomNum, shuffle } from "@/utils/number";
import { useSearchParams } from "react-router-dom";
import { Button, Space, message } from "antd";

import LuckyNumberCard from "@/components/common/card/LuckyNumberCard";
import StatisticsPopup from "@/components/popup/StatisticPopup";
import { parseQueryParams } from "../numberGeneration/components/numberActionButtons/utils";
import { QueryParams, setRequiredNumbers } from "./result-service";
import CombinationDescription from "./CombinationDescription";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import { useAllDraws } from "@/features/draw/hooks/useAllDraws";
import LogoLoading from "@/components/common/loading/LogoLoading";
import { ErrorMessage } from "@/components/common";

const ResultPage: React.FC = () => {
  const { data: allDraws, isLoading, isError } = useAllDraws();

  const [visible, setVisible] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [searchParams] = useSearchParams();

  const queryParams = parseQueryParams(searchParams) as QueryParams;

  const minCount = queryParams.minCount ?? 6;

  const maxResultsLen = 20;

  const [results, setResults] = useState<number[][]>([]);

  const [savedStatus, setSavedStatus] = useState<boolean[]>(
    Array.from({ length: results.length }, () => false)
  );

  const generateNumbers = useCallback((): number[] => {
    if (!allDraws || allDraws.length <= 0) return [];
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);

    const requiredNumbers = setRequiredNumbers(queryParams, allDraws, allDraws);
    const len = requiredNumbers.length;
    const randomIdx = getRandomNum(Math.min(Number(minCount), len), len);

    const availableNumbers = shuffle(requiredNumbers).slice(0, randomIdx);

    return Array.from(new Set([...availableNumbers, ...shuffle(allNumbers)]))
      .slice(0, 6)
      .sort((a, b) => a - b);
  }, [allDraws, minCount, queryParams]);

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

  useEffect(() => {
    if (allDraws && allDraws.length > 0) {
      const newNumbers = Array.from({ length: 5 }, () => generateNumbers());
      setResults((prev) => [...prev, ...newNumbers]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDraws]);

  if (isLoading) {
    return <LogoLoading text="잠시만 기다려주세요" />;
  }

  if (isError) {
    return (
      <Layout>
        <ErrorMessage />
      </Layout>
    );
  }

  if (allDraws)
    return (
      <Layout>
        <Container>
          <Banner>
            🔑 완벽한 조합! <br /> 조합별 상세 통계까지 제공!
            <br />
            이제 당신의 선택만 남았습니다!
          </Banner>
          <CombinationDescription
            latestDraw={allDraws[0]}
            queryParams={queryParams}
          />
          <div className={styles.container}>
            <Space
              direction="vertical"
              size="large"
              style={{ width: "100%", padding: "0 8px" }}
            >
              {results.map((numbers, index) => (
                <LuckyNumberCard
                  key={index}
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
        </Container>
      </Layout>
    );
};

export default ResultPage;

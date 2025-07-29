import React, { useState } from "react";
import styles from "./ResultPage.module.scss";
import Layout from "../../components/layout/Layout";
import { useSearchParams } from "react-router-dom";
import { Button, Space } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";

import LuckyNumberCard from "@/components/common/card/LuckyNumberCard";
import StatisticsPopup from "@/components/popup/StatisticPopup";
import { parseQueryParams } from "../numberGeneration/components/numberActionButtons/utils";
import CombinationDescription from "./CombinationDescription";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import LogoLoading from "@/components/common/loading/LogoLoading";
import { ErrorMessage } from "@/components/common";
import { useResultManagement } from "./hooks/useResultManagement";
import { QueryParams } from "./hooks/useGenerateNumbers";
import { ShareCardModal, useShareCard } from "@/features/share-card";

const ResultPage: React.FC = () => {
  const {
    results,
    allDraws,
    isLoading,
    isError,
    error,
    addNewCombination,
    deleteCombination,
    regenerateCombination,
  } = useResultManagement({ maxResultsLen: 20 });

  const [visible, setVisible] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [searchParams] = useSearchParams();

  const queryParams = parseQueryParams(searchParams) as QueryParams;
  
  const {
    isModalVisible,
    cardData,
    openShareCard,
    closeShareCard,
    createNumbersCard,
  } = useShareCard();

  const handleViewStatistics = (index: number) => {
    setNumbers(results[index]);
    setVisible(true);
  };

  const handleShare = () => {
    const cardData = createNumbersCard(
      results,
      queryParams.method || '자동 생성'
    );
    openShareCard(cardData);
  };

  if (isLoading) {
    return <LogoLoading text="잠시만 기다려주세요" />;
  }

  if (isError || !allDraws) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : undefined}
      />
    );
  }

  return (
    <Layout>
      <Container>
        <Banner>
          🔑 완벽한 조합! <br /> 조합별 상세 통계까지 제공!
          <br />
          이제 당신의 선택만 남았습니다!
        </Banner>
        <CombinationDescription
          queryParams={queryParams}
          latestDraw={allDraws[0]}
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
                onDelete={deleteCombination}
                onViewStatistics={handleViewStatistics}
                onRegenerate={regenerateCombination}
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
            <Space size="middle">
              <Button
                type="primary"
                shape="round"
                size="large"
                onClick={addNewCombination}
              >
                +
              </Button>
              <Button
                type="default"
                shape="round"
                size="large"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
              >
                공유하기
              </Button>
            </Space>
          </div>
        </div>
        
        {cardData && (
          <ShareCardModal
            visible={isModalVisible}
            onClose={closeShareCard}
            cardData={cardData}
          />
        )}
      </Container>
    </Layout>
  );
};

export default ResultPage;

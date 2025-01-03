import React from "react";
import styles from "./Detail.module.scss";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import PageTitle from "../../components/common/text/title/PageTitle";
import StoreCard from "../storeInfo/storeList/storeCard/StoreCard";
import { Table } from "antd";
import { useParams } from "react-router-dom";
import { useRounds } from "../../context/rounds/roundsContext";

const Detail: React.FC = () => {
  const { drawNumber } = useParams<{ drawNumber: string }>();
  const { getRound } = useRounds();
  if (isNaN(Number(drawNumber)) || !drawNumber) return;
  const round = getRound(drawNumber);
  if (!round) return;
  // 더미 데이터
  // 순위별 당첨 데이터 (더미)
  const prizes = [
    {
      rank: "1등",
      totalPrize: "30,602,238,380원",
      winnerCount: "35",
      prizePerWinner: "874,349,668원",
    },
    {
      rank: "2등",
      totalPrize: "5,100,373,115원",
      winnerCount: "79",
      prizePerWinner: "64,561,685원",
    },
    {
      rank: "3등",
      totalPrize: "5,100,374,136원",
      winnerCount: "3,354",
      prizePerWinner: "1,520,684원",
    },
    {
      rank: "4등",
      totalPrize: "7,344,500,000원",
      winnerCount: "146,890",
      prizePerWinner: "50,000원",
    },
    {
      rank: "5등",
      totalPrize: "12,204,020,000원",
      winnerCount: "2,440,804",
      prizePerWinner: "5,000원",
    },
  ];

  // Ant Design Table 컬럼 설정
  const columns = [
    {
      title: "순위",
      dataIndex: "rank",
      key: "rank",
      align: "center" as const,
    },
    {
      title: "총 당첨금액",
      dataIndex: "totalPrize",
      key: "totalPrize",
      align: "center" as const,
    },
    {
      title: "당첨게임 수",
      dataIndex: "winnerCount",
      key: "winnerCount",
      align: "center" as const,
    },
    {
      title: "1게임당 당첨금액",
      dataIndex: "prizePerWinner",
      key: "prizePerWinner",
      align: "center" as const,
    },
  ];

  // 1등 당첨점 데이터 (더미)
  const winningLocations = [
    {
      storeName: "행운복권방",
      address: "서울 강남구 테헤란로 123",
      district: "역삼동",
      coordinates: { lat: 37.496494, lng: 127.029047 },
      drawNumbers: [1152],
      distance: 1.5,
    },
    {
      storeName: "복권천국",
      address: "부산 해운대구 중동로 456",
      district: "좌동",
      coordinates: { lat: 35.163452, lng: 129.163027 },
      drawNumbers: [1152],
      distance: 10.2,
    },
  ];

  return (
    <Layout>
      <div className={styles.detailContainer}>
        <PageTitle>{drawNumber ?? "-"}</PageTitle>
        {/* 상단: 카드 컴포넌트 */}
        <RoundCard {...round} />

        {/* 중단: 순위별 당첨금 테이블 */}
        <div className={styles.prizesTable}>
          <h2>순위별 당첨 정보</h2>
          <Table
            columns={columns}
            dataSource={prizes}
            pagination={false} // 페이지네이션 비활성화
            bordered
            rowKey={(record) => record.rank} // 고유 키 설정
            scroll={{ x: "100%" }} // 가로 스크롤 활성화
          />
        </div>

        {/* 하단: 1등 당첨점 목록 */}
        <div className={styles.winningLocations}>
          <h2>1등 당첨점 목록</h2>
          <ul>
            {winningLocations.map((location) => (
              <StoreCard location={location} />
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;

import React, { useEffect, useState } from "react";
import styles from "./Detail.module.scss";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import { Table } from "antd";
import { useParams } from "react-router-dom";
import { useRounds } from "../../context/rounds/roundsContext";
import { getDrawDetail } from "../../api/axios/lottoApi";
import { formatNumberWithCommas } from "../../utils/number";
import StoreCard from "../../components/common/card/StoreCard";
import { getWinningRegionsByDrawNumber } from "../../api/axios/regionApi";
import FlexContainer from "../../components/common/container/FlexContainer";
import { DetailDraw, WinningRegion } from "lottopass-shared";
import GeoLocationButton from "@/features/location/components/GeoLocationButton/GeoLocationButton";

const Detail: React.FC = () => {
  const { drawNumber } = useParams<{ drawNumber: string }>();
  const { getRound } = useRounds();
  const [formattedDrawDetail, setFormattedDrawDetail] = useState<DetailDraw[]>(
    []
  );
  const [winningStores, setWinningStores] = useState<WinningRegion[]>([]);

  const parsedDrawNumber = Number(drawNumber);
  const isValidDrawNumber = !isNaN(parsedDrawNumber) && drawNumber;

  const round = isValidDrawNumber ? getRound(parsedDrawNumber) : null;

  const [detailLoading, setDetailLoading] = useState<boolean>(true);

  const fetchDrawDetail = async () => {
    setDetailLoading(true);
    const response = await getDrawDetail(parsedDrawNumber);

    if (response.status === "success") {
      const formatted = response.data.map((detail) => ({
        ...detail,
        winnerCount: formatNumberWithCommas(Number(detail.winnerCount)),
        totalPrize: `${Number(detail.totalPrize).toLocaleString()}원`,
        prizePerWinner: `${Number(detail.prizePerWinner).toLocaleString()}원`,
      }));
      setFormattedDrawDetail(formatted);
    } else {
      console.error("Error fetching draw details:", response.message);
    }
    setDetailLoading(false);
  };

  const fetchWinningStores = async () => {
    const response = await getWinningRegionsByDrawNumber(parsedDrawNumber);

    if (response.status === "success") {
      setWinningStores(response.data);
    } else {
      console.error("Error fetching winning stores:", response.message);
    }
  };

  useEffect(() => {
    fetchDrawDetail();
    fetchWinningStores();
  }, []);

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

  if (!isValidDrawNumber) return <div>잘못된 회차입니다.</div>;
  if (!round) return <div>회차 정보를 찾을 수 없습니다.</div>;

  return (
    <Layout>
      <div className={styles.detailContainer}>
        <RoundCard {...round} />
        <div className={styles.prizesTable}>
          <h2 className={styles.sectionHeader}>순위별 당첨 정보</h2>
          <Table
            loading={detailLoading}
            columns={columns}
            dataSource={formattedDrawDetail}
            pagination={false}
            bordered
            rowKey={(record) => record.id.toString()}
            scroll={{ x: "100%" }}
          />
        </div>

        <div className={styles.winningLocations}>
          <FlexContainer
            justify="space-between"
            align="center"
            className={styles.sectionHeader}
          >
            <h2>1등 당첨점 목록</h2>
            <GeoLocationButton />
          </FlexContainer>
          <FlexContainer direction="column" gap={10}>
            {winningStores.map((store) => (
              <StoreCard
                key={store.id}
                method={store.method}
                address={store.address}
                storeName={store.storeName}
                coordinates={store.coordinates}
              />
            ))}
          </FlexContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;

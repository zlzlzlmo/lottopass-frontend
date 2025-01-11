import React from "react";
import styles from "./DetailPage.module.scss";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import { useNavigate, useParams } from "react-router-dom";
import { useOneDraw } from "@/features/draw/hooks/useOneDraw";
import { Table } from "antd";
import { useDetailOneDraw } from "@/features/draw/hooks/useDetailOneDraw";
import FlexContainer from "@/components/common/container/FlexContainer";
import { useWinningStoresByDrawNumber } from "@/features/region/hooks/useWinningStoresByDrawNumber";
import WinningStoreList from "../../features/region/components/stores/winningStore/WinningStoreList";
import Container from "@/components/layout/container/Container";

const DetailPage: React.FC = () => {
  const { drawNumber: drawNumberStr } = useParams<{ drawNumber: string }>();
  const drawNumber = Number(drawNumberStr);
  const navigate = useNavigate();
  const {
    data: oneDraw,
    isLoading: drawLoading,
    isError,
  } = useOneDraw({ drawNumber });
  const { data: detailDraw, isLoading: detailLoading } = useDetailOneDraw({
    drawNumber,
  });

  const { data: winningStores } = useWinningStoresByDrawNumber({ drawNumber });

  if (!drawNumber) {
    navigate("/detail");
    return;
  }

  const parsedDrawNumber = Number(drawNumber);
  const isValidDrawNumber = !isNaN(parsedDrawNumber) && drawNumber;

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

  if (drawLoading || isError) return <></>;
  // if (!round) return <div>회차 정보를 찾을 수 없습니다.</div>;
  if (oneDraw)
    return (
      <Layout>
        <Container>
          <RoundCard {...oneDraw} />
          <div className={styles.prizesTable}>
            <h2 className={styles.sectionHeader}>순위별 당첨 정보</h2>
            <Table
              loading={detailLoading}
              columns={columns}
              dataSource={detailDraw}
              pagination={false}
              bordered
              rowKey={(record) => record.id.toString()}
              scroll={{ x: "100%" }}
            />
          </div>

          <div className={styles.winningLocations}>
            <FlexContainer direction="column" gap={10}>
              <WinningStoreList
                data={winningStores ?? []}
                locationButtonVisible={true}
              />
            </FlexContainer>
          </div>
        </Container>
      </Layout>
    );
};

export default DetailPage;

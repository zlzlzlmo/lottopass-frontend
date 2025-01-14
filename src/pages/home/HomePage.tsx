import Hero from "./hero/Hero";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import { useNavigate } from "react-router-dom";
import { useLatestDraw } from "@/features/draw/hooks/useLatestDraw";
import SkeletonRoundCard from "@/components/common/skeleton/SkeletonRoundCard";
import InfoCards from "./hero/InfoCards";
import { Divider, Typography } from "antd";
import Container from "@/components/layout/container/Container";

import QRScanner from "@/components/QRScanner";

const HomePage = () => {
  const { data: latestRound, isLoading, isError } = useLatestDraw();
  const navigate = useNavigate();
  const renderCard = () => {
    if (isLoading) {
      return <SkeletonRoundCard />;
    } else if (latestRound) {
      return (
        <RoundCard
          {...latestRound}
          linkAction={() => {
            navigate("/history");
          }}
          linkText="모든 회차 보기 >"
        />
      );
    }
  };

  return (
    <Layout>
      <Container>
        <Hero />
        {!isError && renderCard()}

        <Divider style={{ margin: "20px 0" }} />
        <Typography.Title
          level={4}
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          로또 서비스 활용하기
        </Typography.Title>
        <InfoCards />
      </Container>
      <QRScanner />
    </Layout>
  );
};

export default HomePage;

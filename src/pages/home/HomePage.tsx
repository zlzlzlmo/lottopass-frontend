import Hero from "./hero/Hero";
import styles from "./HomePage.module.scss";

import Generation from "./generation/Generation";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import Margin from "../../components/common/gap/Margin";
import { useNavigate } from "react-router-dom";
import { useLatestDraw } from "@/features/draw/hooks/useLatestDraw";
import { ErrorMessage } from "@/components/common";
import SkeletonRoundCard from "@/components/common/skeleton/SkeletonRoundCard";
import StatisticsPopup from "@/components/popup/StatisticPopup";
import { useAppSelector } from "@/redux/hooks";

const HomePage = () => {
  const { data: latestRound, isLoading, isError } = useLatestDraw();
  const navigate = useNavigate();
  const lottoHistory = useAppSelector((state) => state.draw.allDraws);
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

  if (isError) {
    return (
      <Layout>
        <ErrorMessage message={"데이터를 가져오는 중 문제가 발생했습니다."} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Hero />
        <StatisticsPopup
          lottoHistory={lottoHistory}
          visible={false}
          numbers={[6, 11, 17, 19, 40, 43]}
          onClose={() => {}}
        />
        {renderCard()}
        <Margin size={20} />
        <Generation />
      </div>
    </Layout>
  );
};

export default HomePage;

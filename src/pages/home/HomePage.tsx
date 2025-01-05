import Hero from "./hero/Hero";
import styles from "./HomePage.module.scss";

import Generation from "./generation/Generation";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import Margin from "../../components/common/gap/Margin";
import { useNavigate } from "react-router-dom";
import { useLatestDraw } from "@/features/draw/hooks/useLatestDraw";
import { LoadingIndicator, ErrorMessage } from "@/components/common";

const HomePage = () => {
  const { data: latestRound, isLoading, isError } = useLatestDraw();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Layout>
        <LoadingIndicator />
      </Layout>
    );
  }

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
        {latestRound && (
          <RoundCard
            {...latestRound}
            linkAction={() => {
              navigate("/history");
            }}
            linkText="모든 회차 보기 >"
          />
        )}
        <Margin size={20} />
        <Generation />
      </div>
    </Layout>
  );
};

export default HomePage;

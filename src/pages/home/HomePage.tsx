import Hero from "./hero/Hero";
import styles from "./HomePage.module.scss";

import Generation from "./generation/Generation";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import Margin from "../../components/common/gap/Margin";
import { useNavigate } from "react-router-dom";
import { useLatestRound } from "@/features/draw/hooks/useLatestRound";
import { LoadingIndicator, ErrorMessage } from "@/components/common";

const HomePage = () => {
  const { data, isLoading, error } = useLatestRound();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Layout>
        <LoadingIndicator />
      </Layout>
    );
  }

  if (error || (data && data.status === "error")) {
    return (
      <Layout>
        <ErrorMessage
          message={data?.status === "error" ? data.message : undefined}
        />
      </Layout>
    );
  }

  if (data && data.status === "success") {
    // 성공 상태
    const latestRound = data.data;
    return (
      <Layout>
        <div className={styles.container}>
          <Hero />
          <RoundCard
            {...latestRound}
            linkAction={() => {
              navigate("/history");
            }}
            linkText="모든 회차 보기 >"
          />
          <Margin size={20} />
          <Generation />
        </div>
      </Layout>
    );
  }

  return null;
};

export default HomePage;

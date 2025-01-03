import Hero from "./hero/Hero";
import styles from "./Home.module.scss";

import Generation from "./generation/Generation";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import { useRounds } from "../../context/rounds/roundsContext";
import SkeletonRoundCard from "../../components/common/skeleton/SkeletonRoundCard";
import Margin from "../../components/common/gap/Margin";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { state } = useRounds();
  const { latestRound, isLoading } = state;
  const navigate = useNavigate();
  return (
    <Layout>
      <div className={styles.container}>
        <Hero />
        {isLoading ? (
          <SkeletonRoundCard />
        ) : latestRound ? (
          <RoundCard
            {...latestRound}
            linkAction={() => {
              navigate("/history");
            }}
            linkText="모든 회차 보기 >"
          />
        ) : (
          <div>Error</div>
        )}
        <Margin size={20} />
        <Generation />
      </div>
    </Layout>
  );
};

export default Home;

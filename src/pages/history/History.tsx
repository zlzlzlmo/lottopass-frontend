import styles from "./History.module.scss";
import { useRounds } from "../../context/rounds/roundsContext";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import SkeletonRoundCard from "../../components/common/skeleton/SkeletonRoundCard";
import { useState, useEffect } from "react";
import useIntersection from "../../hooks/useIntersection";
import { LottoDraw } from "lottopass-shared";
import PageTitle from "../../components/common/text/title/PageTitle";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();
  const { state } = useRounds();
  const { allRounds, isLoading, error } = state;
  const [visibleRounds, setVisibleRounds] = useState<LottoDraw[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const roundsPerPage = 10;

  // 데이터가 로드될 때 page 초기화
  useEffect(() => {
    if (allRounds && allRounds.length > 0 && visibleRounds.length === 0) {
      setPage(1);
    }
  }, [allRounds]);

  // 데이터 로드 로직
  useEffect(() => {
    if (!allRounds || allRounds.length === 0) return;

    const start = (page - 1) * roundsPerPage;
    const end = page * roundsPerPage;

    const newRounds = allRounds.slice(start, end);
    setVisibleRounds((prev) => [...prev, ...newRounds]);

    if (end >= allRounds.length) {
      setHasMore(false);
    }
  }, [page, allRounds]);

  const loadMore = (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting && hasMore && allRounds.length > 0) {
      setPage((prev) => prev + 1);
    }
  };

  const observerRef = useIntersection(loadMore, { threshold: 1 });

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.historyContainer}>
          <PageTitle>전 회차 당첨번호</PageTitle>
          <div className={styles.cards}>
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonRoundCard key={index} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.historyContainer}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.historyContainer}>
        <PageTitle>전 회차 당첨번호</PageTitle>
        <div className={styles.cards}>
          {visibleRounds.map((round) => (
            <RoundCard
              key={round.drawNumber}
              {...round}
              linkAction={() => navigate(`/history/${round.drawNumber}`)}
              linkText="자세히보기 >"
            />
          ))}

          {hasMore &&
            Array.from({ length: 2 }).map((_, index) => (
              <SkeletonRoundCard key={`skeleton-${index}`} />
            ))}
        </div>

        {hasMore && <div ref={observerRef} className={styles.observer} />}
      </div>
    </Layout>
  );
};

export default History;

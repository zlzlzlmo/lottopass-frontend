import React, { useState } from "react";
import styles from "./HistoryPage.module.scss";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import SkeletonRoundCard from "../../components/common/skeleton/SkeletonRoundCard";
import PageTitle from "../../components/common/text/title/PageTitle";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import useIntersection from "@/hooks/useIntersection";

const ITEMS_PER_PAGE = 10; // 한 번에 로드할 아이템 수

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const allDraws = useAppSelector((state) => state.draw.allDraws);
  const [visibleItems, setVisibleItems] = useState<number>(ITEMS_PER_PAGE); // 렌더링된 아이템 수
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태

  const loadMore = () => {
    if (visibleItems < allDraws.length) {
      setLoading(true);
      setTimeout(() => {
        setVisibleItems((prev) =>
          Math.min(prev + ITEMS_PER_PAGE, allDraws.length)
        );
        setLoading(false);
      }, 1000); // 스켈레톤 로딩 시간
    }
  };

  const observerRef = useIntersection(
    () => {
      if (!loading && visibleItems < allDraws.length) {
        loadMore();
      }
    },
    { threshold: 1.0, rootMargin: "0px 0px 100px 0px" }
  );

  return (
    <Layout>
      <div className={styles.historyContainer}>
        <PageTitle>전 회차 당첨번호</PageTitle>
        <div className={styles.cards}>
          {allDraws.slice(0, visibleItems).map((round) => (
            <RoundCard
              key={round.drawNumber}
              {...round}
              linkAction={() => navigate(`/history/${round.drawNumber}`)}
              linkText="자세히보기 >"
            />
          ))}
          {loading &&
            Array.from({ length: 2 }).map((_, index) => (
              <SkeletonRoundCard key={`skeleton-${index}`} />
            ))}
        </div>
        {visibleItems < allDraws.length && (
          <div ref={observerRef} className={styles.observer} />
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;

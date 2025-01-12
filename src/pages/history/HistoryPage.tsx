import React, { useState } from "react";
import styles from "./HistoryPage.module.scss";
import Layout from "../../components/layout/Layout";
import RoundCard from "../../components/common/card/RoundCard";
import SkeletonRoundCard from "../../components/common/skeleton/SkeletonRoundCard";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import useSingleIntersection from "@/hooks/useSingleIntersection";
import Banner from "@/components/common/banner/Banner";
import Container from "@/components/layout/container/Container";

const ITEMS_PER_PAGE = 10; // 한 번에 로드할 아이템 수

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const allDraws = useAppSelector((state) => state.draw.allDraws);
  const [visibleItems, setVisibleItems] = useState<number>(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState<boolean>(false);

  const loadMore = () => {
    if (visibleItems < allDraws.length) {
      setLoading(true);
      setTimeout(() => {
        setVisibleItems((prev) =>
          Math.min(prev + ITEMS_PER_PAGE, allDraws.length)
        );
        setLoading(false);
      }, 1000);
    }
  };

  const observerRef = useSingleIntersection(
    () => {
      if (!loading && visibleItems < allDraws.length) {
        loadMore();
      }
    },
    { threshold: 1.0, rootMargin: "0px 0px 100px 0px" }
  );

  return (
    <Layout>
      <Container>
        <Banner>
          🎉 역대 로또 회차 정보를 확인해보세요! <br />
          <strong>{allDraws.length}회</strong> 데이터가 제공됩니다.
        </Banner>

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
      </Container>
    </Layout>
  );
};

export default HistoryPage;

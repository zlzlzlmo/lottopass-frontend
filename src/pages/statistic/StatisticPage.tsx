import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Layout from "@/components/layout/Layout";
import ViewContainer from "./view/ViewContainer";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewType = "ball" | "match" | "numberPair";

const StatisticPage: React.FC = () => {
  const defaultViewType: ViewType = "ball";
  const [viewType, setViewType] = useState<ViewType>(defaultViewType);
  const [currentActiveLink, setCurrentActiveLink] = useState<string>("#ball");

  const data = useAppSelector((state) => state.draw.allDraws);

  return (
    <Layout>
      <Container>
        <Banner>🚀 당첨 확률, 이제는 데이터로 예측하세요!</Banner>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={viewType === "ball" ? "default" : "outline"}
            onClick={() => {
              setViewType("ball");
              setCurrentActiveLink("#ball");
            }}
            className={cn(
              "transition-all",
              viewType === "ball" && "shadow-lg"
            )}
          >
            번호들 출현 횟수 보기
          </Button>
          <Button
            variant={viewType === "match" ? "default" : "outline"}
            onClick={() => {
              setViewType("match");
              setCurrentActiveLink("#match");
            }}
            className={cn(
              "transition-all",
              viewType === "match" && "shadow-lg"
            )}
          >
            전 회차와 매치 수 보기
          </Button>
          <Button
            variant={viewType === "numberPair" ? "default" : "outline"}
            onClick={() => {
              setViewType("numberPair");
              setCurrentActiveLink("#numberPair");
            }}
            className={cn(
              "transition-all",
              viewType === "numberPair" && "shadow-lg"
            )}
          >
            자주 등장한 번호 조합
          </Button>
        </div>
        <ViewContainer viewType={viewType} data={data} />
      </Container>
    </Layout>
  );
};

export default StatisticPage;

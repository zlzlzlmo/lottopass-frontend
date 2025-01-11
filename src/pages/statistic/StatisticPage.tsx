import React, { useState } from "react";
import { Anchor } from "antd";
import { useAppSelector } from "@/redux/hooks";
import Layout from "@/components/layout/Layout";
import ViewContainer from "./view/ViewContainer";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";

const { Link } = Anchor;

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
        <Anchor
          affix={false}
          onClick={(e) => {
            e.preventDefault();
            const target = e.target as HTMLAnchorElement;
            const href = target.getAttribute("href") || defaultViewType;
            setViewType(href.replace("#", "") as ViewType);
            setCurrentActiveLink(href);
          }}
          getCurrentAnchor={() => currentActiveLink} // 현재 활성 링크 설정
        >
          <Link href="#ball" title="번호들 출현 횟수 보기" />
          <Link href="#match" title="전 회차와 매치 수 보기" />
          <Link href="#numberPair" title="자주 등장한 번호 조합" />
        </Anchor>
        <ViewContainer viewType={viewType} data={data} />
      </Container>
    </Layout>
  );
};

export default StatisticPage;

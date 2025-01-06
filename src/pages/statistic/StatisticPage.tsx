import React, { useState } from "react";
import { Anchor } from "antd";
import BallView from "./BallView";
import { useAppSelector } from "@/redux/hooks";
import PageTitle from "@/components/common/text/title/PageTitle";
import Layout from "@/components/layout/Layout";

const { Link } = Anchor;

const StatisticPage: React.FC = () => {
  const [viewType, setViewType] = useState<"ball">("ball");
  const lottoData = useAppSelector((state) => state.draw.allDraws);

  return (
    <Layout>
      <PageTitle>로또 통계</PageTitle>
      <Anchor
        onClick={(e) => {
          e.preventDefault();
          const target = e.target as HTMLAnchorElement;
          setViewType(target.getAttribute("href")?.replace("#", "") as "ball");
        }}
      >
        <Link href="#ball" title="로또 공 형식 보기" />
      </Anchor>

      <div style={{ marginTop: "20px" }}>
        {viewType === "ball" && <BallView data={lottoData} />}
      </div>
    </Layout>
  );
};

export default StatisticPage;

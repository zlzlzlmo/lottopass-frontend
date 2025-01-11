import React from "react";
import styles from "./WinningStoresPage.module.scss";
import Layout from "../../components/layout/Layout";
import { Spin } from "antd";
import WinningStoreList from "../../features/region/components/stores/winningStore/WinningStoreList";
import { useWinningStoresByRegion } from "@/features/region/hooks/useWinningStoresByRegion";
import SearchRegions from "@/features/region/components/SearchRegions";
import { showError } from "@/utils/error";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import PlaceholderContent from "../../components/common/PlaceholderContent";

const WinningStoresPage: React.FC = () => {
  const { data, isLoading, isError, handleClick } = useWinningStoresByRegion();

  if (isError) {
    showError();
    return;
  }

  return (
    <Layout>
      <Container>
        <Banner>
          💰 행운의 당첨 매장을 지금 확인하세요! <br />
          성공은 한 발짝 앞에!
        </Banner>
        <SearchRegions handleClick={handleClick} />
        {data.length <= 0 ? (
          <PlaceholderContent />
        ) : (
          <div className={styles.results}>
            {isLoading && (
              <div className={styles.loading}>
                <Spin size="large" tip="로딩 중..." />
              </div>
            )}

            {!isLoading && <WinningStoreList data={data} />}
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default WinningStoresPage;

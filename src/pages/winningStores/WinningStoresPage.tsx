import React from "react";
import styles from "./WinningStoresPage.module.scss";
import Layout from "../../components/layout/Layout";
import { Spin } from "antd";
import WinningStoreList from "../../features/region/components/stores/winningStore/WinningStoreList";
import { useWinningStoresByRegion } from "@/features/region/hooks/useWinningStoresByRegion";
import SearchRegions from "@/features/region/components/SearchRegions";
import { showError } from "@/utils/error";

const WinningStoresPage: React.FC = () => {
  const { data, isLoading, isError, handleClick } = useWinningStoresByRegion();

  if (isError) {
    showError();
    return;
  }

  return (
    <Layout pageTitle="당첨점 확인">
      <div className={styles.container}>
        <SearchRegions handleClick={handleClick} />
        <div className={styles.results}>
          {isLoading && (
            <div className={styles.loading}>
              <Spin size="large" tip="로딩 중..." />
            </div>
          )}

          {!isLoading && data.length > 0 && <WinningStoreList data={data} />}
        </div>
      </div>
    </Layout>
  );
};

export default WinningStoresPage;

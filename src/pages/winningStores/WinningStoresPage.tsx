import React from "react";
import styles from "./WinningStoresPage.module.scss";
import Layout from "../../components/layout/Layout";
import { Spin } from "antd";
import StoreList from "./storeList/StoreList";
import { useWinningStoresByRegion } from "@/features/region/hooks/useWinningStoresByRegion";
import SearchRegions from "@/features/region/components/SearchRegions";

const WinningStoresPage: React.FC = () => {
  const { data, isLoading, isError, handleClick } = useWinningStoresByRegion();

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
          {isError && <p className={styles.error}>에러</p>}
          {!isLoading && data.length > 0 && <StoreList data={data} />}
        </div>
      </div>
    </Layout>
  );
};

export default WinningStoresPage;

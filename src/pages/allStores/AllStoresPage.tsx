import React from "react";
import styles from "./AllStoresPage.module.scss";
import Layout from "../../components/layout/Layout";
import { Spin } from "antd";
import SearchRegions from "@/features/region/components/SearchRegions";
import { useAllStoresByRegion } from "@/features/region/hooks/useAllStoresByRegion";
import AllStoresList from "@/features/region/components/AllStoresList";
import { showError } from "@/utils/error";

const AllStoresPage: React.FC = () => {
  const { data, isLoading, isError, handleClick } = useAllStoresByRegion();

  if (isError) {
    showError();
    return;
  }

  return (
    <Layout pageTitle="로또 판매점 확인">
      <div className={styles.container}>
        <SearchRegions handleClick={handleClick} />
        <div className={styles.results}>
          {isLoading && (
            <div className={styles.loading}>
              <Spin size="large" tip="로딩 중..." />
            </div>
          )}
          {!isLoading && data.length > 0 && <AllStoresList data={data} />}
        </div>
      </div>
    </Layout>
  );
};

export default AllStoresPage;

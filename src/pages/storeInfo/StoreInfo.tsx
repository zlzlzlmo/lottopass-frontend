import React from "react";
import styles from "./StoreInfo.module.scss";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/button/Button";

import { useStoreInfo } from "./hooks/useStoreInfo";
import SelectBox from "./selectBox/SelectBox";
import StoreList from "./storeList/StoreList";

const StoreInfo: React.FC = () => {
  const { handleSearchAndSort } = useStoreInfo();

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>1등 당첨 지역 조회</h1>
        <SelectBox />
        <Button
          width="100%"
          onClick={handleSearchAndSort}
          className={styles.searchButton}
        >
          검색
        </Button>
        <StoreList />
      </div>
    </Layout>
  );
};

export default StoreInfo;

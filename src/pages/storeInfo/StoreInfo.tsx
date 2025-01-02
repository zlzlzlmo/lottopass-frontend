import React from "react";
import styles from "./StoreInfo.module.scss";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/button/Button";

import { useStoreInfo } from "./hooks/useStoreInfo";
import SelectBox from "./selectBox/SelectBox";
import StoreList from "./storeList/StoreList";
import PageTitle from "../../components/common/text/title/PageTitle";

const StoreInfo: React.FC = () => {
  const { handleSearchAndSort } = useStoreInfo();

  return (
    <Layout>
      <div className={styles.container}>
        <PageTitle>1등 당첨 지역 조회</PageTitle>
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

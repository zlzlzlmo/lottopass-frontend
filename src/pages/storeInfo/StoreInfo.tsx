import React, { useState } from "react";
import styles from "./StoreInfo.module.scss";
import Layout from "../../components/layout/Layout";
import SelectBox from "./selectBox/SelectBox";
import { Button, Spin } from "antd";
import { useStore } from "../../context/store/storeContext";
import StoreList from "./storeList/StoreList";
import { getWinningRegionsByLocation } from "../../api/axios/regionApi";
import { WinningRegion } from "lottopass-shared";
import LocationButton from "../../components/common/button/location/LocationButton";

const StoreInfo: React.FC = () => {
  const { state } = useStore();
  const { selectedRegion } = state;

  const [winningRegions, setWinningRegions] = useState<WinningRegion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!selectedRegion.province) return;

    setLoading(true);
    setError(null); // 초기화

    try {
      const response = await getWinningRegionsByLocation(
        selectedRegion.province,
        selectedRegion.city
      );

      if (response.status === "success") {
        setWinningRegions(response.data);
      } else {
        setError(response.message || "데이터를 가져오는데 실패했습니다.");
      }
    } catch (err) {
      setError("서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.controls}>
          <SelectBox />
          <Button
            type="primary"
            size="large"
            block
            onClick={handleSearch}
            className={styles.searchButton}
            disabled={!selectedRegion.province}
          >
            검색
          </Button>
          <LocationButton />
        </div>
        <div className={styles.results}>
          {loading && (
            <div className={styles.loading}>
              <Spin size="large" tip="로딩 중..." />
            </div>
          )}
          {error && <p className={styles.error}>{error}</p>}
          {!loading && winningRegions.length > 0 && (
            <StoreList data={winningRegions} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StoreInfo;

import React, { useState } from "react";
import styles from "./WinningStoresPage.module.scss";
import Layout from "../../components/layout/Layout";
import { Button, Spin } from "antd";
import StoreList from "./storeList/StoreList";
import RegionSelectBox from "./selectBox/RegionSelectBox";
import GeoLocationButton from "@/features/location/components/GeoLocationButton/GeoLocationButton";
import { useWinningStoresByRegion } from "@/features/region/hooks/useWinningStoresByRegion";

const WinningStoresPage: React.FC = () => {
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const { data, isLoading, isError, handleClick } = useWinningStoresByRegion();

  const handleLocationSelect = (
    selectedProvince: string,
    selectedCity: string
  ) => {
    setProvince(selectedProvince);
    setCity(selectedCity);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.controls}>
          <RegionSelectBox
            city={city ?? ""}
            province={province ?? ""}
            onCitySelect={(city) => setCity(city)}
            onProvinceSelect={(province) => setProvince(province)}
          />
          <Button
            type="primary"
            size="large"
            block
            onClick={handleClick.bind(this, province, city)}
            className={styles.searchButton}
            disabled={!province}
          >
            검색
          </Button>
          <GeoLocationButton onLocationSelect={handleLocationSelect} />
        </div>
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

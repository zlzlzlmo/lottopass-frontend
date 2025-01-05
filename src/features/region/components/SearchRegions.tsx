import GeoLocationButton from "@/features/location/components/GeoLocationButton/GeoLocationButton";
import RegionSelectBox from "@/pages/winningStores/selectBox/RegionSelectBox";
import { Button } from "antd";
import React, { useState } from "react";
import styles from "./SearchRegions.module.scss";

interface SearchRegionsProps {
  handleClick: (province: string, city?: string) => Promise<void>;
}

const SearchRegions: React.FC<SearchRegionsProps> = ({ handleClick }) => {
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const handleLocationSelect = (
    selectedProvince: string,
    selectedCity: string
  ) => {
    setProvince(selectedProvince);
    setCity(selectedCity);
  };
  return (
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
  );
};

export default SearchRegions;

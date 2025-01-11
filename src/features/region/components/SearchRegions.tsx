import GeoLocationButton from "@/features/location/components/GeoLocationButton/GeoLocationButton";
import RegionSelectBox from "@/pages/winningStores/selectBox/RegionSelectBox";
import { Button } from "antd";
import React, { useState } from "react";

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
    <div>
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
        disabled={!province}
        style={{ marginTop: "20px", height: "40px", borderRadius: "6px" }}
      >
        검색
      </Button>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <GeoLocationButton onLocationSelect={handleLocationSelect} />
      </div>
    </div>
  );
};

export default SearchRegions;

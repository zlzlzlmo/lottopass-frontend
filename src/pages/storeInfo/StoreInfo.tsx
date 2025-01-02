import React, { useEffect, useState } from "react";
import styles from "./StoreInfo.module.scss";
import NavigationIcon from "@mui/icons-material/Navigation";
import Layout from "../../components/layout/Layout";
import {
  getUniqueRegions,
  getWinningRegionsByLocation,
} from "../../api/axios/regionApi";
import Button from "../../components/common/button/Button";

interface MergedLocation {
  storeName: string;
  address: string;
  district: string;
  coordinates?: { lat: number; lng: number };
  drawNumbers: number[];
  distance?: number;
}

const StoreInfo: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [uniqueRegion, setUniqueRegion] = useState<Record<string, string[]>>(
    {}
  );
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [mergedLocations, setMergedLocations] = useState<MergedLocation[]>([]);

  useEffect(() => {
    const getRegions = async () => {
      const result = await getUniqueRegions();
      if (result.status === "success") {
        const regions: Record<string, string[]> = {};
        for (const region of result.data) {
          if (!regions[region.province]) regions[region.province] = [];
          if (!regions[region.province].includes(region.city)) {
            regions[region.province].push(region.city);
          }
        }
        setUniqueRegion(regions);
      }
    };
    getRegions();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {}
    );
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      setFilteredCities(uniqueRegion[selectedRegion] || []);
      setSelectedCity("");
    } else {
      setFilteredCities([]);
    }
  }, [selectedRegion, uniqueRegion]);

  const calculateDistance = (
    current: { lat: number; lng: number },
    target?: { lat: number; lng: number }
  ): number => {
    if (!target) return Infinity;
    const R = 6371;
    const dLat = ((target.lat - current.lat) * Math.PI) / 180;
    const dLng = ((target.lng - current.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((current.lat * Math.PI) / 180) *
        Math.cos((target.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSearchAndSort = async () => {
    if (!selectedRegion || !selectedCity) return;

    const result = await getWinningRegionsByLocation(
      selectedRegion,
      selectedCity
    );

    if (result.status === "success") {
      const mergedData: Record<string, MergedLocation> = {};
      for (const location of result.data) {
        const key = `${location.storeName}-${location.address}`;
        if (!mergedData[key]) {
          mergedData[key] = {
            storeName: location.storeName,
            address: location.address!,
            district: location.district,
            coordinates: location.coordinates,
            drawNumbers: [location.drawNumber],
          };
        } else {
          mergedData[key].drawNumbers.push(location.drawNumber);
        }
      }
      const mergedArray = Object.values(mergedData);
      if (currentLocation) {
        mergedArray.forEach((item) => {
          item.distance = calculateDistance(currentLocation, item.coordinates);
        });
        mergedArray.sort((a, b) => (a.distance! > b.distance! ? 1 : -1));
      }
      setMergedLocations(mergedArray);
    }
  };

  const handleNavigate = (
    coordinates?: { lat: number; lng: number },
    storeName?: string
  ) => {
    if (!coordinates) return;
    const kakaoUrl = `https://map.kakao.com/link/to/${storeName},${coordinates.lat},${coordinates.lng}`;
    window.open(kakaoUrl, "_blank");
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>1등 당첨 지역 조회</h1>
        <div className={styles.selectBox}>
          <select
            className={styles.select}
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">도/시를 선택하세요</option>
            {Object.keys(uniqueRegion).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!filteredCities.length}
          >
            <option value="">시(구/군)을 선택하세요</option>
            {filteredCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <Button
          width="100%"
          onClick={handleSearchAndSort}
          className={styles.searchButton}
        >
          검색
        </Button>
        <ul className={styles.storeList}>
          {mergedLocations.map((location, index) => (
            <li className={styles.storeCard} key={index}>
              <div className={styles.cardHeader}>
                <div className={styles.tagContainer}>
                  {location.drawNumbers.map((num) => (
                    <span className={styles.tag} key={num}>
                      {num}회
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.storeInfo}>
                <div>
                  <h2 className={styles.storeName}>{location.storeName}</h2>
                  <p>{location.district}</p>
                  <p className={styles.storeAddress}>{location.address}</p>
                  <p className={styles.storeDistance}>
                    거리:{" "}
                    {location.distance ? location.distance.toFixed(2) : "-"} km
                  </p>
                </div>
                <button
                  className={styles.navigateButton}
                  onClick={() =>
                    handleNavigate(location.coordinates, location.storeName)
                  }
                >
                  <NavigationIcon
                    style={{ fontSize: "24px", color: "#3b82f6" }}
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default StoreInfo;

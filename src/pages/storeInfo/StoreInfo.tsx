import React, { useEffect, useState } from "react";
import styles from "./StoreInfo.module.scss";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Layout from "../../components/layout/Layout";
import { getUniqueRegions } from "../../api/axios/regionApi";

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: string;
  region: string; // 시/도
  city: string; // 구/군/동
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
  const [sortedLocations, setSortedLocations] = useState<Location[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    const getRegions = async () => {
      try {
        const result = await getUniqueRegions();
        if (result.status === "success") {
          const regions: Record<string, string[]> = {};

          for (const region of result.data) {
            if (!regions[region.province]) {
              regions[region.province] = [];
            }
            if (!regions[region.province].includes(region.city)) {
              regions[region.province].push(region.city);
            }
          }

          setUniqueRegion(regions); // 상태 업데이트
        } else {
          console.error("Failed to fetch regions:", result.message);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    getRegions();
  }, []);

  // 사용자 위치 가져오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        console.error("위치를 가져오지 못했습니다.");
      }
    );
  }, []);

  // 시/도 선택 시 동(구/군) 옵션 업데이트
  useEffect(() => {
    if (selectedRegion) {
      setFilteredCities(uniqueRegion[selectedRegion] || []);
      setSelectedCity(""); // 시/도를 바꾸면 동 초기화
    } else {
      setFilteredCities([]);
    }
  }, [selectedRegion, uniqueRegion]);

  // 거리 계산 함수
  const calculateDistance = (
    current: { lat: number; lng: number },
    target: { lat: number; lng: number }
  ): number => {
    const R = 6371; // 지구 반지름 (km)
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

  // 검색 및 정렬 기능
  const handleSearchAndSort = () => {
    const locations: Location[] = []; // 실제 데이터를 여기에 넣어야 함
    const filtered = locations.filter(
      (location) =>
        (selectedRegion ? location.region === selectedRegion : true) &&
        (selectedCity ? location.city === selectedCity : true) &&
        (location.name.includes(searchKeyword) ||
          location.address.includes(searchKeyword))
    );
    if (currentLocation) {
      filtered.sort((a, b) => {
        const distanceA = calculateDistance(currentLocation, a.coordinates);
        const distanceB = calculateDistance(currentLocation, b.coordinates);
        return distanceA - distanceB;
      });
    }
    setSortedLocations(filtered);
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
        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="매장 이름 또는 주소 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button className={styles.searchButton} onClick={handleSearchAndSort}>
            검색
          </button>
        </div>
        <ul className={styles.storeList}>
          {sortedLocations.map((location) => (
            <li className={styles.storeCard} key={location.id}>
              <div className={styles.storeInfo}>
                <h2 className={styles.storeName}>{location.name}</h2>
                <p className={styles.storeAddress}>{location.address}</p>
                <p className={styles.storeDistance}>
                  거리:{" "}
                  {currentLocation
                    ? calculateDistance(
                        currentLocation,
                        location.coordinates
                      ).toFixed(2)
                    : "-"}{" "}
                  km
                </p>
                <p className={styles.storeHours}>영업 시간: {location.hours}</p>
              </div>
              <div className={styles.storeActions}>
                <a
                  className={styles.phoneButton}
                  href={`tel:${location.phone}`}
                >
                  전화
                </a>
                <a
                  className={styles.navigateButton}
                  href={`https://map.kakao.com/link/to/${location.name},${location.coordinates.lat},${location.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  길찾기
                </a>
              </div>
            </li>
          ))}
        </ul>
        {currentLocation && (
          <Map
            center={{
              lat: currentLocation.lat,
              lng: currentLocation.lng,
            }}
            style={{ width: "100%", height: "400px", marginTop: "20px" }}
            level={3}
          >
            {sortedLocations.map((location) => (
              <MapMarker
                key={location.id}
                position={{
                  lat: location.coordinates.lat,
                  lng: location.coordinates.lng,
                }}
                title={location.name}
              />
            ))}
          </Map>
        )}
      </div>
    </Layout>
  );
};

export default StoreInfo;

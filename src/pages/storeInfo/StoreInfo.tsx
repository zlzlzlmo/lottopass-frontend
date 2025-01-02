import React, { useEffect, useState } from "react";
import styles from "./StoreInfo.module.scss";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Layout from "../../components/layout/Layout";

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
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [sortedLocations, setSortedLocations] = useState<Location[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const cityData: { [key: string]: string[] } = {
    서울: ["강남구", "송파구", "서초구"],
    부산: ["해운대구", "수영구", "동래구"],
  };

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

    // 예시 매장 데이터
    setLocations([
      {
        id: 1,
        name: "강남점",
        address: "서울 강남구 테헤란로 123",
        phone: "010-1234-5678",
        coordinates: { lat: 37.4979, lng: 127.0276 },
        hours: "09:00 ~ 22:00",
        region: "서울",
        city: "강남구",
      },
      {
        id: 2,
        name: "송파점",
        address: "서울 송파구 올림픽로 321",
        phone: "010-2345-6789",
        coordinates: { lat: 37.5141, lng: 127.1046 },
        hours: "10:00 ~ 21:00",
        region: "서울",
        city: "송파구",
      },
      {
        id: 3,
        name: "해운대점",
        address: "부산 해운대구 해운대로 456",
        phone: "010-3456-7890",
        coordinates: { lat: 35.1631, lng: 129.1635 },
        hours: "10:00 ~ 20:00",
        region: "부산",
        city: "해운대구",
      },
    ]);
  }, []);

  // 시/도 선택 시 동(구/군) 옵션 업데이트
  useEffect(() => {
    if (selectedRegion) {
      setFilteredCities(cityData[selectedRegion] || []);
      setSelectedCity(""); // 시/도를 바꾸면 동 초기화
    } else {
      setFilteredCities([]);
    }
  }, [selectedRegion]);

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
            <option value="">시/도를 선택하세요</option>
            {Object.keys(cityData).map((region) => (
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
            <option value="">동(구/군)을 선택하세요</option>
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

import React, { useState, useEffect } from "react";
import { StoreInfo } from "lottopass-shared";
import styles from "./StoreList.module.scss";
import { useAppSelector } from "@/redux/hooks";
import SortDropDown from "@/components/common/dropDown/SortDropDown";
import GeoLocationButton from "@/features/location/components/GeoLocationButton/GeoLocationButton";
import FlexContainer from "@/components/common/container/FlexContainer";
import StoreCard from "./StoreCard";

const sortOptions = [
  { key: "distance", label: "거리순" },
  { key: "name", label: "이름순" },
];

interface ExtendedWinningRegion extends StoreInfo {
  distance?: number;
}

interface AllStoresList {
  locationButtonVisible?: boolean;
  data: StoreInfo[];
}

const StoreList: React.FC<AllStoresList> = ({
  data,
  locationButtonVisible = false,
}) => {
  const myLocation = useAppSelector((state) => state.location.myLocation);
  const [sortedData, setSortedData] = useState<ExtendedWinningRegion[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>(
    myLocation ? "distance" : "name" // 기본값 설정
  );

  // 거리 계산 함수
  const calculateDistanceFromMyLocation = (target?: {
    lat: number;
    lng: number;
  }): number => {
    if (!target) return Infinity;
    if (!myLocation) return Infinity;

    const R = 6371; // 지구 반지름 (km)
    const dLat = ((target.lat - myLocation.latitude) * Math.PI) / 180;
    const dLng = ((target.lng - myLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((myLocation.latitude * Math.PI) / 180) *
        Math.cos((target.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 초기 데이터 준비 및 정렬
  useEffect(() => {
    const enrichedData = data.map((region) => {
      const coorditate = {
        lat: region.latitude,
        lng: region.longitude,
      };
      return {
        ...region,
        distance: coorditate
          ? calculateDistanceFromMyLocation(coorditate)
          : Infinity,
      };
    });

    // 초기 정렬 실행
    onSortChange(selectedSort, enrichedData);
  }, [data, myLocation]);

  // 정렬 핸들러
  const onSortChange = (
    sortKey: string,
    dataToSort: ExtendedWinningRegion[] = sortedData
  ) => {
    const sorted = [...dataToSort];
    switch (sortKey) {
      case "distance":
        sorted.sort(
          (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
        );
        break;
      case "name":
        sorted.sort((a, b) =>
          (a.storeName || "").localeCompare(b.storeName || "")
        );
        break;
      // case "draw":
      //   sorted.sort((a, b) => (b.drawNumber || 0) - (a.drawNumber || 0));
      //   break;
      default:
        break;
    }
    setSortedData(sorted); // 정렬된 데이터 업데이트
    setSelectedSort(sortKey); // 선택된 정렬 기준 업데이트
  };

  return (
    <div className={styles.container}>
      <FlexContainer
        className={styles.header}
        justify="space-between"
        align="center"
      >
        {locationButtonVisible && (
          <GeoLocationButton onLocationSelect={() => {}} />
        )}

        <SortDropDown
          onSortChange={onSortChange}
          currentSort={selectedSort}
          sortOptions={sortOptions}
        />
      </FlexContainer>
      <ul className={styles.storeList}>
        {sortedData.map((region, i) => (
          <StoreCard key={i} {...region} />
        ))}
      </ul>
    </div>
  );
};

export default StoreList;

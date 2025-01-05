import React, { useState, useEffect } from "react";
import StoreCard from "../../../components/common/card/StoreCard";
import { WinningRegion } from "lottopass-shared";
import styles from "./StoreList.module.scss";
import SortDropdown from "@/components/common/DropDown/SortDropDown";
import { useAppSelector } from "@/redux/hooks";

interface ExtendedWinningRegion extends WinningRegion {
  distance?: number; // 거리 속성 추가
}

interface StoreListProps {
  data: WinningRegion[];
}

const StoreList: React.FC<StoreListProps> = ({ data }) => {
  const myLocation = useAppSelector((state) => state.location.myLocation);
  const [sortedData, setSortedData] = useState<ExtendedWinningRegion[]>([]);

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

  // 초기 데이터에 거리 계산 및 정렬
  useEffect(() => {
    const enrichedData = data.map((region) => ({
      ...region,
      distance: region.coordinates
        ? calculateDistanceFromMyLocation(region.coordinates)
        : Infinity,
    }));

    // myLocation이 없으면 이름순으로 정렬
    const sorted =
      myLocation === null
        ? enrichedData.sort((a, b) =>
            (a.storeName || "").localeCompare(b.storeName || "")
          )
        : enrichedData.sort(
            (a, b) => (a.distance || Infinity) - (b.distance || Infinity)
          );

    setSortedData(sorted);
  }, [data, myLocation]);

  // 정렬 기준 변경 핸들러
  const onSortChange = (sortKey: string) => {
    const sorted = [...sortedData];
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
      case "draw":
        sorted.sort((a, b) => (b.drawNumber || 0) - (a.drawNumber || 0));
        break;
      default:
        break;
    }
    setSortedData(sorted);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SortDropdown onSortChange={onSortChange} />
      </div>
      <ul className={styles.storeList}>
        {sortedData.map((region) => (
          <StoreCard key={region.id} {...region} />
        ))}
      </ul>
    </div>
  );
};

export default StoreList;

import React, { useState, useEffect } from "react";
import StoreCard from "../../../components/common/card/StoreCard";
import { WinningRegion } from "lottopass-shared";
import styles from "./StoreList.module.scss";
import { useAppSelector } from "@/redux/hooks";
import SortDropDown from "@/components/common/dropDown/SortDropDown";
import GeoLocationButton from "@/features/location/components/GeoLocationButton/GeoLocationButton";
import FlexContainer from "@/components/common/container/FlexContainer";

const sortOptions = [
  { key: "distance", label: "거리순" },
  { key: "name", label: "이름순" },
  { key: "count", label: "당첨 횟수순" },
];

interface ExtendedWinningRegion extends WinningRegion {
  distance?: number;
  drawNumbers?: number[];
}

interface StoreListProps {
  locationButtonVisible?: boolean;
  data: WinningRegion[];
}

const StoreList: React.FC<StoreListProps> = ({
  data,
  locationButtonVisible = false,
}) => {
  const myLocation = useAppSelector((state) => state.location.myLocation);
  const [sortedData, setSortedData] = useState<ExtendedWinningRegion[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>(
    myLocation ? "distance" : "name"
  );

  const calculateDistanceFromMyLocation = (target?: {
    lat: number;
    lng: number;
  }): number => {
    if (!target || !myLocation) return Infinity;

    const R = 6371; // 지구 반지름 (km)
    const dLat = ((target.lat - myLocation.latitude) * Math.PI) / 180;
    const dLng = ((target.lng - myLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((myLocation.latitude * Math.PI) / 180) *
        Math.cos((target.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const groupDataByStore = (data: WinningRegion[]): ExtendedWinningRegion[] => {
    const grouped: { [key: string]: ExtendedWinningRegion } = {};

    data.forEach((region) => {
      const key = region.coordinates
        ? `${region.coordinates.lat},${region.coordinates.lng}`
        : region.address || region.uniqueIdentifier;

      if (!grouped[key]) {
        grouped[key] = {
          ...region,
          drawNumbers: [region.drawNumber], // 초기화
        };
      } else {
        grouped[key].drawNumbers?.push(region.drawNumber);
      }
    });

    return Object.values(grouped).map((region) => ({
      ...region,
      drawNumbers: region.drawNumbers?.sort((a, b) => b - a), // 내림차순
    }));
  };

  useEffect(() => {
    const groupedData = groupDataByStore(data).map((region) => ({
      ...region,
      distance: region.coordinates
        ? calculateDistanceFromMyLocation(region.coordinates)
        : Infinity,
    }));

    handleSortChange(selectedSort, groupedData);
  }, [data, myLocation]);

  const handleSortChange = (
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
      case "count":
        sorted.sort(
          (a, b) => (b.drawNumbers?.length || 0) - (a.drawNumbers?.length || 0)
        );
        break;
      default:
        break;
    }
    setSortedData(sorted);
    setSelectedSort(sortKey);
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
          onSortChange={handleSortChange}
          currentSort={selectedSort}
          sortOptions={sortOptions}
        />
      </FlexContainer>
      <ul className={styles.storeList}>
        {sortedData.map((region) => (
          <StoreCard
            key={region.id}
            {...region}
            drawNumbers={region.drawNumbers}
          />
        ))}
      </ul>
    </div>
  );
};

export default StoreList;

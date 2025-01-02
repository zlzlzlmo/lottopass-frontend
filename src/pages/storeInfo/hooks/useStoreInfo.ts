import { useEffect } from "react";
import {
  getUniqueRegions,
  getWinningRegionsByLocation,
} from "../../../api/axios/regionApi";
import {
  setUniqueRegion,
  setLocation,
  setFilteredCities,
  setSelectedCity,
  setMergedLocations,
} from "../../../context/store/storeActions";
import { MergedLocation } from "../../../context/store/storeReducer";
import { calculateDistance } from "../../../utils/distance";
import { useStore } from "../../../context/store/storeContext";

export const useStoreInfo = () => {
  const { state, dispatch } = useStore();

  // 지역 정보 가져오기
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const result = await getUniqueRegions();
        if (result.status === "success") {
          const regions: Record<string, string[]> = {};
          result.data.forEach((region) => {
            if (!regions[region.province]) regions[region.province] = [];
            if (!regions[region.province].includes(region.city)) {
              regions[region.province].push(region.city);
            }
          });
          dispatch(setUniqueRegion(regions));
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();
  }, [dispatch]);

  // 사용자 위치 가져오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        );
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, [dispatch]);

  // 선택된 도/시에 따라 시/군 필터링
  useEffect(() => {
    if (state.selectedRegion) {
      const cities = state.uniqueRegion[state.selectedRegion] || [];
      dispatch(setFilteredCities(cities));
      dispatch(setSelectedCity(""));
    } else {
      dispatch(setFilteredCities([]));
    }
  }, [state.selectedRegion, state.uniqueRegion, dispatch]);

  // 검색 및 거리 계산
  const handleSearchAndSort = async () => {
    if (!state.selectedRegion || !state.selectedCity) return;

    try {
      const result = await getWinningRegionsByLocation(
        state.selectedRegion,
        state.selectedCity
      );

      if (result.status === "success") {
        const mergedData: Record<string, MergedLocation> = {};

        result.data.forEach((location) => {
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
        });

        const mergedArray = Object.values(mergedData);

        if (state.currentLocation) {
          mergedArray.forEach((item) => {
            item.distance = calculateDistance(
              state.currentLocation!,
              item.coordinates
            );
          });
          mergedArray.sort((a, b) => (a.distance! > b.distance! ? 1 : -1));
        }

        dispatch(setMergedLocations(mergedArray));
      }
    } catch (error) {
      console.error("Error fetching winning regions:", error);
    }
  };

  return { state, handleSearchAndSort, dispatch };
};

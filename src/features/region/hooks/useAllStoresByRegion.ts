import { useState } from "react";
import { regionService } from "@/api";
import { StoreInfo } from "lottopass-shared";

export const useAllStoresByRegion = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<StoreInfo[]>([]);

  const handleClick = async (province: string, city: string = "") => {
    setIsLoading(true);
    setIsError(false);

    try {
      // API 호출
      const result = await regionService.getAllStoresByRegion(province, city);
      setData(result); // 성공한 데이터 상태 업데이트
    } catch (error) {
      setIsError(true);
      console.error(error); // 에러 처리 (로그)
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, handleClick };
};

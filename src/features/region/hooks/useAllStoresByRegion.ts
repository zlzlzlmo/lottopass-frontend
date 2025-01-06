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
      const result = await regionService.getAllStoresByRegion(province, city);
      setData(result);
    } catch (error) {
      setIsError(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, handleClick };
};

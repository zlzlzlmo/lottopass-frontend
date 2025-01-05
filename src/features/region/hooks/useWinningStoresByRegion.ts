import { regionService } from "@/api";
import { WinningRegion } from "lottopass-shared";
import { useState } from "react";

export const useWinningStoresByRegion = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<WinningRegion[]>([]);

  const handleClick = async (province: string, city: string = "") => {
    const response = await regionService.getWinningStoresByRegion(
      province,
      city
    );

    console.log("test ; ", response);
    setIsLoading(true);
    try {
      const response = await regionService.getWinningStoresByRegion(
        province,
        city
      );
      if (response.status === "success") {
        setData(response.data);
        console.log("sdfsafas");
        return response.data;
      } else {
        setIsError(true);
        throw new Error(response.message || "Failed to fetch winning stores");
      }
    } catch (error: unknown) {
      setIsError(true);
      if (error instanceof Error) throw new Error(error.message);

      throw new Error('"An error occurred while fetching winning stores"');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, handleClick };
};

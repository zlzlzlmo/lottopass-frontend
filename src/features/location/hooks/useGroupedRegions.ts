import { regionService } from "@/api";
import { groupBy } from "@/utils/group";
import { UniqueRegion } from "lottopass-shared";
import { useQuery } from "react-query";

const fetchRegions = async (): Promise<UniqueRegion[]> => {
  try {
    const response = await regionService.getAllRegions();
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('"An error occurred while fetching regions"');
  }
};

export const useGroupedRegions = () => {
  const { data, isLoading, isError } = useQuery<UniqueRegion[]>(
    "regions",
    fetchRegions,
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const groupedData = data ? groupBy(data, "province") : null;

  return { groupedData, isLoading, isError };
};

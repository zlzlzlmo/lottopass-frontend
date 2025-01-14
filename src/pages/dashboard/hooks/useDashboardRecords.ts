import { recordService } from "@/api";
import { Record } from "@/api/recordService";
import { message } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";

export interface DateRange {
  start?: dayjs.Dayjs;
  end?: dayjs.Dayjs;
}

export const useDashboardRecords = () => {
  const {
    data: records = [],
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery<Record[]>("record", async () => await recordService.getAll());

  const [dateRange, setDateRange] = useState<DateRange>({
    start: dayjs(records[0]?.purchaseDate || undefined),
    end: dayjs(records[records.length - 1]?.purchaseDate || undefined),
  });

  const [filteredRecords, setFilteredRecords] = useState<Record[]>(records);

  const filterRecords = () => {
    const { start, end } = dateRange;

    if (start && end) {
      const filtered = records.filter((record) => {
        const recordDate = dayjs(record.purchaseDate);
        return (
          recordDate.isSameOrAfter(start, "day") &&
          recordDate.isSameOrBefore(end, "day")
        );
      });

      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  };

  const handleRefetch = async () => {
    await refetch();
    filterRecords();
  };

  const { mutate: deleteRecord } = useMutation(
    async (id: string) => await recordService.deleteOne(id),
    {
      onSuccess: async () => {
        message.success("성공적으로 삭제가 됐습니다.");
        handleRefetch();
      },
      onError: () => {
        message.error("삭제 실패");
      },
    }
  );

  // 날짜 변경 핸들러
  const handleDateChange = (
    name: "start" | "end",
    value: dayjs.Dayjs | null
  ) => {
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    filterRecords();
  }, [dateRange, records]);

  useEffect(() => {
    // 데이터가 로드된 후 기본값으로 전체 기간 설정
    if (records.length > 0) {
      setDateRange({
        start: dayjs(records[0]?.purchaseDate),
        end: dayjs(records[records.length - 1]?.purchaseDate),
      });
    }
  }, [records]);

  return {
    records,
    isError,
    error,
    isLoading,
    filteredRecords,
    dateRange,
    deleteRecord,
    handleDateChange,
    handleRefetch,
  };
};

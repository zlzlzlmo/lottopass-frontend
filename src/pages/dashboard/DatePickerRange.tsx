import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { DateRange } from "./hooks/useDashboardRecords";

interface DatePickerRangeProps {
  dateRange: DateRange;
  handleDateChange: (name: "start" | "end", value: dayjs.Dayjs | null) => void;
}

const DatePickerRange: React.FC<DatePickerRangeProps> = ({
  dateRange,
  handleDateChange,
}) => {
  const { start, end } = dateRange;
  return (
    <div
      style={{
        padding: "16px",
        marginBottom: "20px",
        display: "flex",
        gap: "16px",
      }}
    >
      <DatePicker
        value={start}
        onChange={(date) => {
          handleDateChange("start", date);
        }}
        format="YYYY-MM-DD"
        style={{ width: "100%" }}
        placeholder="시작 날짜"
      />
      <DatePicker
        value={end}
        onChange={(date) => {
          handleDateChange("end", date);
        }}
        format="YYYY-MM-DD"
        style={{ width: "100%" }}
        placeholder="종료 날짜"
      />
    </div>
  );
};

export default DatePickerRange;

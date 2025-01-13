import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

interface DatePickerRangeProps {
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  onStartDateChange: (date: dayjs.Dayjs | null) => void;
  onEndDateChange: (date: dayjs.Dayjs | null) => void;
}

const DatePickerRange: React.FC<DatePickerRangeProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
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
        value={startDate}
        onChange={onStartDateChange}
        format="YYYY-MM-DD"
        style={{ width: "100%" }}
        placeholder="시작 날짜"
      />
      <DatePicker
        value={endDate}
        onChange={onEndDateChange}
        format="YYYY-MM-DD"
        style={{ width: "100%" }}
        placeholder="종료 날짜"
      />
    </div>
  );
};

export default DatePickerRange;

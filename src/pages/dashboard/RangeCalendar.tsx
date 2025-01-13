import React, { useState } from "react";
import { List, DatePicker, message } from "antd";
import LottoCard from "./LottoCard";
import dayjs from "dayjs";

const mockRecords = [
  {
    id: 1,
    drawNumber: 1154,
    combinations: [
      [4, 16, 26, 33, 34, 43],
      [6, 19, 22, 24, 40, 42],
    ],
    purchaseDate: "2025-01-10",
    memo: "이번 주 행운 번호",
  },
  {
    id: 2,
    drawNumber: 1155,
    combinations: [[7, 14, 21, 28, 35, 42]],
    purchaseDate: "2025-01-17",
    memo: "가족 추천 번호",
  },
  {
    id: 3,
    drawNumber: 1156,
    combinations: [[1, 3, 7, 23, 36, 44]],
    purchaseDate: "2025-01-20",
    memo: "테스트 메모",
  },
];

const RangeCalendar: React.FC = () => {
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    setEndDate(date);
  };

  const filteredRecords = mockRecords.filter((record) => {
    const recordDate = dayjs(record.purchaseDate);
    if (startDate && recordDate.isBefore(startDate)) return false;
    if (endDate && recordDate.isAfter(endDate)) return false;
    return true;
  });

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            시작 날짜
          </label>
          <DatePicker
            onChange={handleStartDateChange}
            value={startDate}
            format="YYYY-MM-DD"
            placeholder="시작 날짜 선택"
            getPopupContainer={(trigger) =>
              trigger.parentElement || document.body
            }
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            종료 날짜
          </label>
          <DatePicker
            onChange={handleEndDateChange}
            value={endDate}
            format="YYYY-MM-DD"
            placeholder="종료 날짜 선택"
            getPopupContainer={(trigger) =>
              trigger.parentElement || document.body
            }
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* 선택된 범위 표시 */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "16px",
          fontSize: "14px",
          color: "#555",
        }}
      >
        <strong>선택된 범위:</strong>{" "}
        {startDate ? startDate.format("YYYY-MM-DD") : "시작 날짜"} ~{" "}
        {endDate ? endDate.format("YYYY-MM-DD") : "종료 날짜"}
      </div>

      {/* Lotto Cards */}
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredRecords}
        renderItem={(item) => (
          <List.Item>
            <LottoCard
              drawNumber={item.drawNumber}
              combinations={item.combinations}
              purchaseDate={item.purchaseDate}
              memo={item.memo}
              onDelete={() => message.info(`Record ${item.id} 삭제`)}
              onShowStatistics={() =>
                message.info(`Record ${item.id} 통계 보기`)
              }
            />
          </List.Item>
        )}
      />

      {/* No Data Message */}
      {filteredRecords.length === 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#aaa",
            fontSize: "16px",
          }}
        >
          <strong>😢 No data</strong>
        </div>
      )}
    </div>
  );
};

export default RangeCalendar;

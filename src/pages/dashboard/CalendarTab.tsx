/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { List, message } from "antd";
import LottoCard from "./LottoCard";
import { Record } from "@/api/recordService";
import { recordService } from "@/api";

interface CalendarTabProps {
  filteredRecords: Record[];
}

const CalendarTab: React.FC<CalendarTabProps> = ({ filteredRecords }) => {
  const deleteCard = async (id: string) => {
    try {
      const isDeleted = await recordService.deleteOne(id);
      if (isDeleted) message.success("해당 카드 삭제가 완료되었습니다.");
    } catch (error: any) {
      message.error(error.message);
    }
  };
  return (
    <div>
      {filteredRecords.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredRecords}
          renderItem={(item) => (
            <List.Item>
              <LottoCard
                drawNumber={item.drawNumber}
                combinations={item.combinations}
                purchaseDate={item.purchaseDate}
                memo={item.memo ?? ""}
                onDelete={() => {
                  deleteCard(item.id);
                }}
              />
            </List.Item>
          )}
        />
      ) : (
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

export default CalendarTab;

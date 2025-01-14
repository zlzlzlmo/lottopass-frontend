import React from "react";
import { List } from "antd";
import LottoCard from "./LottoCard";
import { Record } from "@/api/recordService";

interface CalendarTabProps {
  filteredRecords: Record[];
  onDelete: (id: string) => void;
}

const CalendarTab: React.FC<CalendarTabProps> = ({
  filteredRecords,
  onDelete,
}) => {
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
                  onDelete(item.id);
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

import React, { useState } from "react";
import { List, Button, Typography } from "antd";

const { Text } = Typography;

interface WinningHistoryProps {
  results: { drawNumber: number; rank: string | null }[];
}

const WinningHistory: React.FC<WinningHistoryProps> = ({ results }) => {
  const [displayCount, setDisplayCount] = useState(5);

  const filteredResults = results.filter((result) => result.rank !== null);
  const displayedResults = filteredResults.slice(0, displayCount);

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 10); // 10개씩 추가 표시
  };

  return (
    <div style={{ marginTop: 16, textAlign: "center" }}>
      <List
        dataSource={displayedResults}
        renderItem={(item) => (
          <List.Item
            key={item.drawNumber}
            style={{
              borderBottom: "1px solid #f0f0f0",
              color: item.rank === "1등" ? "#ff4d4f" : "inherit",
            }}
          >
            <Text strong>{`제 ${item.drawNumber} 회차`}</Text> - {item.rank}
          </List.Item>
        )}
        style={{
          maxWidth: 400,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      />
      {displayCount < filteredResults.length && (
        <Button
          type="primary"
          onClick={handleShowMore}
          style={{ marginTop: 16 }}
        >
          더보기
        </Button>
      )}
    </div>
  );
};

export default WinningHistory;

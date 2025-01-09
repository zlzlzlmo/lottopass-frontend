import React, { useState } from "react";
import { List, Button, Typography } from "antd";

const { Text } = Typography;

interface WinningHistoryProps {
  results: { drawNumber: number; rank: string | null }[];
}

const WinningHistory: React.FC<WinningHistoryProps> = ({ results }) => {
  const [showAllResults, setShowAllResults] = useState(false);

  const filteredResults = results.filter((result) => result.rank !== null);
  const displayedResults = showAllResults
    ? filteredResults
    : filteredResults.slice(0, 10);

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
        style={{ maxHeight: 300, overflowY: "auto" }}
      />
      {filteredResults.length > 10 && (
        <Button
          type="link"
          onClick={() => setShowAllResults(!showAllResults)}
          style={{ marginTop: 8 }}
        >
          {showAllResults ? "간략히 보기" : "더보기"}
        </Button>
      )}
    </div>
  );
};

export default WinningHistory;

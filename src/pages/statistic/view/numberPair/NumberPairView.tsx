import React, { useState } from "react";
import { List, Typography, Button } from "antd";
import { LottoDraw } from "lottopass-shared";

const { Title, Text } = Typography;

interface NumberPairViewProps {
  data: LottoDraw[];
}

const calculatePairStatistics = (
  data: LottoDraw[]
): { pair: string; count: number }[] => {
  const pairCounts = new Map<string, number>();

  data.forEach((record) => {
    const { winningNumbers } = record;
    for (let i = 0; i < winningNumbers.length; i++) {
      for (let j = i + 1; j < winningNumbers.length; j++) {
        const pairKey = [winningNumbers[i], winningNumbers[j]]
          .sort((a, b) => a - b)
          .join(", ");
        pairCounts.set(pairKey, (pairCounts.get(pairKey) || 0) + 1);
      }
    }
  });

  return Array.from(pairCounts.entries())
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => b.count - a.count);
};

const calculateTripleStatistics = (
  data: LottoDraw[]
): { triple: string; count: number }[] => {
  const tripleCounts = new Map<string, number>();

  data.forEach((record) => {
    const { winningNumbers } = record;
    for (let i = 0; i < winningNumbers.length; i++) {
      for (let j = i + 1; j < winningNumbers.length; j++) {
        for (let k = j + 1; k < winningNumbers.length; k++) {
          const tripleKey = [
            winningNumbers[i],
            winningNumbers[j],
            winningNumbers[k],
          ]
            .sort((a, b) => a - b)
            .join(", ");
          tripleCounts.set(tripleKey, (tripleCounts.get(tripleKey) || 0) + 1);
        }
      }
    }
  });

  return Array.from(tripleCounts.entries())
    .map(([triple, count]) => ({ triple, count }))
    .sort((a, b) => b.count - a.count);
};

const NumberPairView: React.FC<NumberPairViewProps> = ({ data }) => {
  const [pairDisplayCount, setPairDisplayCount] = useState(10);
  const [tripleDisplayCount, setTripleDisplayCount] = useState(10);

  const pairStatistics = calculatePairStatistics(data);
  const tripleStatistics = calculateTripleStatistics(data);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={4}>두쌍 조합</Title>
        <List
          dataSource={pairStatistics.slice(0, pairDisplayCount)}
          renderItem={(item) => (
            <List.Item
              style={{
                borderBottom: "1px solid #f0f0f0",
                padding: "8px 16px",
              }}
            >
              <Text strong>{item.pair}</Text> - {item.count}회
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
        {pairDisplayCount < pairStatistics.length && (
          <Button
            type="primary"
            onClick={() => setPairDisplayCount((prev) => prev + 10)}
            style={{ marginTop: 16 }}
          >
            더보기
          </Button>
        )}
      </div>

      <div>
        <Title level={4}>세쌍 조합</Title>
        <List
          dataSource={tripleStatistics.slice(0, tripleDisplayCount)}
          renderItem={(item) => (
            <List.Item
              style={{
                borderBottom: "1px solid #f0f0f0",
                padding: "8px 16px",
              }}
            >
              <Text strong>{item.triple}</Text> - {item.count}회
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
        {tripleDisplayCount < tripleStatistics.length && (
          <Button
            type="primary"
            onClick={() => setTripleDisplayCount((prev) => prev + 10)}
            style={{ marginTop: 16 }}
          >
            더보기
          </Button>
        )}
      </div>
    </div>
  );
};

export default NumberPairView;

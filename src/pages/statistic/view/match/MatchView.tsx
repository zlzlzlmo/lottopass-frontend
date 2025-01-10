import React from "react";
import { List } from "antd";

interface MatchViewProps {
  data: { drawNumber: number; winningNumbers: number[] }[];
}

const calculateMatchStatistics = (
  data: { drawNumber: number; winningNumbers: number[] }[]
) => {
  const matchCounts = Array(7).fill(0);

  for (let i = 1; i < data.length; i++) {
    const currentNumbers = data[i].winningNumbers;
    const previousNumbers = data[i - 1].winningNumbers;

    const matches = currentNumbers.filter((num) =>
      previousNumbers.includes(num)
    ).length;

    matchCounts[matches]++;
  }

  return matchCounts;
};

const MatchView: React.FC<MatchViewProps> = ({ data: lottoHistory }) => {
  const matchStatistics = calculateMatchStatistics(lottoHistory);
  const labels = [
    "0개 일치",
    "1개 일치",
    "2개 일치",
    "3개 일치",
    "4개 일치",
    "5개 일치",
    "6개 일치",
  ];

  return (
    <List
      dataSource={matchStatistics.map((count, index) => ({
        label: labels[index],
        count,
      }))}
      renderItem={(item) => (
        <List.Item
          style={{ padding: "8px 16px", borderBottom: "1px solid #f0f0f0" }}
        >
          <span style={{ fontWeight: "bold" }}>{item.label}</span>: {item.count}
          회
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
  );
};

export default MatchView;

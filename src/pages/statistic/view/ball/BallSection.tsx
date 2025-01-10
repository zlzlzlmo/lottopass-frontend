import React from "react";
import { getBallColor } from "@/utils/ballColor";

interface NumberStatistics {
  number: number;
  count: number;
}

interface BallSectionProps {
  data: NumberStatistics[];
  sortKey: string;
}

const BallSection: React.FC<BallSectionProps> = ({ data, sortKey }) => {
  const sortedData = [...data].sort((a, b) =>
    sortKey === "number" ? a.number - b.number : b.count - a.count
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
        gap: "10px",
        justifyContent: "center",
      }}
    >
      {sortedData.map((stat) => (
        <div
          key={stat.number}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: getBallColor(stat.number),
            border: `2px solid ${getBallColor(stat.number)}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {stat.number}
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              color: "#fff",
            }}
          >
            {stat.count}회
          </span>
        </div>
      ))}
    </div>
  );
};

export default BallSection;

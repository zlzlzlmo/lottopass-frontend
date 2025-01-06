import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface NumberStatistics {
  number: number;
  count: number;
}

interface ChartSectionProps {
  data: NumberStatistics[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ data }) => {
  const chartData = {
    labels: data.map((stat) => stat.number),
    datasets: [
      {
        label: "당첨 횟수",
        data: data.map((stat) => stat.count),
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "번호별 당첨 횟수",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "번호",
        },
      },
      y: {
        title: {
          display: true,
          text: "횟수",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ChartSection;

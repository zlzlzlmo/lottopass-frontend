import React, { useState } from "react";
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
import { Modal, Button } from "antd";

// Chart.js 구성 요소 등록
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
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    maintainAspectRatio: false,
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

  const chartStyle = {
    minWidth: "600px",
    height: "300px",
  };

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <div>
      <div
        style={{
          overflowX: "auto",
          paddingBottom: "10px",
          maxWidth: "640px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            ...chartStyle,
          }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <Button type="dashed" onClick={showModal}>
          전체 화면 보기
        </Button>
      </div>

      <Modal
        visible={isModalVisible}
        title="전체 화면 차트"
        footer={null}
        onCancel={closeModal}
        width={800} // 모달 크기
      >
        <div style={{ width: "100%", height: "500px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </Modal>
    </div>
  );
};

export default ChartSection;

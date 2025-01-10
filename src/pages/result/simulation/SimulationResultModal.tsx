import React from "react";
import { Modal, Typography, Divider, Button } from "antd";

const { Title } = Typography;

interface SimulationResultModalProps {
  isVisible: boolean;
  onClose: () => void;
  rankCounts: { [key: string]: number };
  simulationCount: number;
}

const SimulationResultModal: React.FC<SimulationResultModalProps> = ({
  isVisible,
  onClose,
  rankCounts,
  simulationCount,
}) => {
  const generalProbabilities = {
    first: 1 / 8145060,
    second: 1 / 814506,
    third: 1 / 35756,
    fourth: 1 / 733,
    fifth: 1 / 45,
  };

  const rankNames = {
    first: "1등",
    second: "2등",
    third: "3등",
    fourth: "4등",
    fifth: "5등",
  } as const; // as const를 추가하여 키와 값을 고정

  type Rank = keyof typeof rankNames; // 키 타입을 추출

  // 시뮬레이션 확률 계산
  const calculateSimulationProbability = (rank: string) =>
    rankCounts[rank as keyof typeof rankCounts] / simulationCount || 0;

  // 팝업 내용 렌더링
  const renderModalContent = () => {
    return (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
            <th style={{ padding: "10px", fontWeight: "bold" }}>등수</th>
            <th style={{ padding: "10px", fontWeight: "bold" }}>당첨 횟수</th>
            <th style={{ padding: "10px", fontWeight: "bold" }}>
              시뮬레이션 확률
            </th>
            <th style={{ padding: "10px", fontWeight: "bold" }}>일반 확률</th>
            <th style={{ padding: "10px", fontWeight: "bold" }}>결과</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(rankNames).map((rank) => {
            const generalProb =
              generalProbabilities[rank as keyof typeof generalProbabilities];
            const simProb = calculateSimulationProbability(rank);
            const winCount = rankCounts[rank as keyof typeof rankCounts] || 0;
            const isLucky = simProb > generalProb;

            return (
              <tr key={rank} style={{ textAlign: "center" }}>
                <td style={{ padding: "10px" }}>{rankNames[rank as Rank]}</td>
                <td style={{ padding: "10px" }}>{winCount}회</td>
                <td style={{ padding: "10px" }}>
                  {(simProb * 100).toPrecision(2)}%
                </td>
                <td style={{ padding: "10px" }}>
                  {(generalProb * 100).toPrecision(2)}%
                </td>
                <td
                  style={{
                    padding: "10px",
                    color: isLucky ? "#52c41a" : "#f5222d",
                    fontWeight: "bold",
                  }}
                >
                  {isLucky ? "🎉 운이 좋습니다!" : "😞 운이 아쉽습니다."}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <Modal
      title="시뮬레이션 결과"
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          닫기
        </Button>,
      ]}
    >
      <Title level={5} style={{ textAlign: "center" }}>
        확률 비교
      </Title>
      <Divider />
      {renderModalContent()}
    </Modal>
  );
};

export default SimulationResultModal;

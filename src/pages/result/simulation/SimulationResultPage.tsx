import React, { useState, useRef } from "react";
import { Typography, Card, Divider, message } from "antd";
import Layout from "@/components/layout/Layout";
import { getRandomNum, shuffle } from "@/utils/number";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { parseQUeryParams } from "../../numberGeneration/components/numberActionButtons/utils";
import { QueryParams, setRequiredNumbers } from "../result-service";
import SimulationControls from "./SimulationControls";
import SimulationResult from "./SimulationResult";
import SimulationResultModal from "./SimulationResultModal";

const { Text } = Typography;

const SimulationResultPage: React.FC = () => {
  const allDraws = useAppSelector((state) => state.draw.allDraws);
  const [selectedDraw, setSelectedDraw] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [simulationData, setSimulationData] = useState({
    simulationRunning: false,
    simulationCount: 0,
    simulatedNumbers: "",
    rankCounts: { first: 0, second: 0, third: 0, fourth: 0, fifth: 0 },
  });

  const [searchParams] = useSearchParams();
  const queryParams = parseQUeryParams(searchParams) as QueryParams;

  const stopSimulation = useRef(false);

  const latestDraw = allDraws[selectedDraw];
  const minCount = queryParams.minCount ?? 6;
  const requiredNumbers = setRequiredNumbers(
    queryParams,
    allDraws.slice(selectedDraw + 1),
    allDraws
  );

  const generateNumbers = (): number[] => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const len = requiredNumbers.length;
    const randomIdx = getRandomNum(Math.min(Number(minCount), len), len);

    const availableNumbers = shuffle(requiredNumbers).slice(0, randomIdx);

    return Array.from(new Set([...availableNumbers, ...shuffle(allNumbers)]))
      .slice(0, 6)
      .sort((a, b) => a - b);
  };

  const calculateRank = (
    generatedNumbers: number[],
    winningNumbers: number[],
    bonusNumber: number
  ) => {
    const matchCount = generatedNumbers.filter((num) =>
      winningNumbers.includes(num)
    ).length;

    if (matchCount === 6) return "first";
    if (matchCount === 5 && generatedNumbers.includes(bonusNumber))
      return "second";
    if (matchCount === 5) return "third";
    if (matchCount === 4) return "fourth";
    if (matchCount === 3) return "fifth";
    return null;
  };

  const handleSimulate = async (maxCount: number) => {
    setSimulationData({
      simulationRunning: true,
      simulationCount: 0,
      simulatedNumbers: "",
      rankCounts: { first: 0, second: 0, third: 0, fourth: 0, fifth: 0 },
    });
    stopSimulation.current = false;

    const latestDraw = allDraws[selectedDraw];
    if (!latestDraw) {
      message.error("기준 회차 데이터가 없습니다. 다시 시도해주세요.");
      return;
    }
    const { winningNumbers, bonusNumber } = latestDraw;

    let count = 0;

    while (count < maxCount) {
      if (stopSimulation.current) break; // 중지 상태 확인
      count++;
      const generatedNumbers = generateNumbers();
      const rank = calculateRank(
        generatedNumbers,
        winningNumbers.map(Number),
        Number(bonusNumber)
      );
      if (rank) {
        setSimulationData((prev) => ({
          ...prev,
          rankCounts: {
            ...prev.rankCounts,
            [rank]: prev.rankCounts[rank] + 1,
          },
        }));
      }
      setSimulationData((prev) => ({
        ...prev,
        simulationCount: count,
        simulatedNumbers: generatedNumbers.join(","),
      }));

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    setSimulationData((prev) => ({ ...prev, simulationRunning: false }));
    if (!stopSimulation.current) {
      message.success("시뮬레이션이 완료되었습니다!");
      setIsModalVisible(true);
    }
  };

  const handleStopSimulation = () => {
    stopSimulation.current = true;
    message.info("시뮬레이션이 중지되었습니다!");
    setIsModalVisible(true);
  };

  const { simulationCount, rankCounts, simulatedNumbers } = simulationData;

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <Card style={{ maxWidth: 600, margin: "0 auto", borderRadius: 10 }}>
          <Text
            type="secondary"
            style={{ display: "block", textAlign: "center", marginBottom: 20 }}
          >
            로또 번호 조합 시뮬레이션을 통해 각 등수에 당첨된 횟수를 확인합니다.
          </Text>

          <Divider />

          <SimulationControls
            selectedDraw={selectedDraw}
            setSelectedDraw={setSelectedDraw}
            allDraws={allDraws}
            onSimulate={handleSimulate}
            onStop={handleStopSimulation} // 중지 버튼 콜백 전달
            simulationRunning={simulationData.simulationRunning}
            latestDraw={latestDraw}
          />

          <Divider />
          <SimulationResult
            rankCounts={rankCounts}
            simulatedNumbers={simulatedNumbers}
            simulationCount={simulationCount}
          />
        </Card>
      </div>

      <SimulationResultModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        rankCounts={rankCounts}
        simulationCount={simulationCount}
      />
    </Layout>
  );
};

export default SimulationResultPage;

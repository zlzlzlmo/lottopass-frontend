import React, { useState, useRef, useEffect } from "react";
import { Typography, Divider, message } from "antd";
import Layout from "@/components/layout/Layout";
import { useSearchParams } from "react-router-dom";
import { parseQueryParams as parseQueryParams } from "../../numberGeneration/components/numberActionButtons/utils";
import { QueryParams } from "../result-service";
import SimulationControls from "./SimulationControls";
import SimulationResult from "./SimulationResult";
import SimulationResultModal from "./SimulationResultModal";
import CombinationDescription from "../CombinationDescription";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import LogoLoading from "@/components/common/loading/LogoLoading";
import { ErrorMessage } from "@/components/common";
import { useGenerateNumbers } from "../hooks/useGenerateNumbers";

const { Text } = Typography;

const SimulationResultPage: React.FC = () => {
  const { allDraws, isError, isLoading, generateNumbers } =
    useGenerateNumbers();
  const [selectedDraw, setSelectedDraw] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [simulationData, setSimulationData] = useState({
    simulationRunning: false,
    simulationCount: 0,
    simulatedNumbers: "",
    rankCounts: { first: 0, second: 0, third: 0, fourth: 0, fifth: 0 },
  });

  const [searchParams] = useSearchParams();
  const queryParams = parseQueryParams(searchParams) as QueryParams;

  const stopSimulation = useRef(false);

  const latestDraw = allDraws && allDraws[selectedDraw];

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

  const resetSimulation = () => {
    setProgress(0);
    setSimulationData({
      simulationRunning: false,
      simulationCount: 0,
      simulatedNumbers: "",
      rankCounts: { first: 0, second: 0, third: 0, fourth: 0, fifth: 0 },
    });
    stopSimulation.current = false;
  };

  const handleSimulate = async (maxCount: number) => {
    if (!allDraws) return;
    const latestDraw = allDraws[selectedDraw];
    if (!latestDraw) {
      message.error("기준 회차 데이터가 없습니다. 다시 시도해주세요.");
      return;
    }
    const { winningNumbers, bonusNumber } = latestDraw;

    let count = 0;
    setSimulationData((prev) => ({ ...prev, simulationRunning: true }));
    while (count < maxCount) {
      if (stopSimulation.current) break; // 중지 상태 확인
      count++;
      const progress = Math.floor((count / maxCount) * 100);
      setProgress(progress);
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

  useEffect(() => {
    if (!isModalVisible) {
      resetSimulation();
    }
  }, [isModalVisible]);

  if (isLoading) {
    return <LogoLoading text="잠시만 기다려주세요" />;
  }

  if (isError) {
    return (
      <Layout>
        <ErrorMessage />
      </Layout>
    );
  }

  if (!latestDraw || !allDraws) return <></>;

  return (
    <Layout>
      <Container>
        <Banner>🌟 이 시뮬레이션이 당신의 다음 행운이 될 수 있습니다!</Banner>
        <CombinationDescription
          latestDraw={latestDraw!}
          queryParams={queryParams}
        />
        <div>
          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: 20,
            }}
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
            progress={progress}
            rankCounts={rankCounts}
            simulatedNumbers={simulatedNumbers}
            simulationCount={simulationCount}
          />
        </div>

        <SimulationResultModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          rankCounts={rankCounts}
          simulationCount={simulationCount}
        />
      </Container>
    </Layout>
  );
};

export default SimulationResultPage;

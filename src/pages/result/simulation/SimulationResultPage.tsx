import React, { useState } from "react";
import { Typography, Card, Divider, message } from "antd";
import Layout from "@/components/layout/Layout";
import { getRandomNum, shuffle } from "@/utils/number";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { parseQUeryParams } from "../../numberGeneration/components/numberActionButtons/utils";
import { QueryParams, setRequiredNumbers } from "../result-service";
import SimulationControls from "./SimulationControls";
import SimulationResult from "./SimulationResult";

const { Text } = Typography;

const SimulationResultPage: React.FC = () => {
  const allDraws = useAppSelector((state) => state.draw.allDraws);
  const [selectedDraw, setSelectedDraw] = useState<number>(0);

  const [simulationData, setSimulationData] = useState({
    simulationRunning: false,
    simulationCount: 0,
    simulatedNumbers: "",
    rankCounts: { first: 0, second: 0, third: 0, fourth: 0, fifth: 0 },
  });

  const [searchParams] = useSearchParams();

  const queryParams = parseQUeryParams(searchParams) as QueryParams;

  const latestDraw = allDraws[selectedDraw];
  const minCount = queryParams.minCount ?? 6;

  const requiredNumbers = setRequiredNumbers(
    queryParams,
    allDraws.slice(selectedDraw + 1)
  );

  // 번호 생성 함수
  const generateNumbers = (): number[] => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const len = requiredNumbers.length;
    const randomIdx = getRandomNum(Math.min(Number(minCount), len), len);

    const availableNumbers = shuffle(requiredNumbers).slice(0, randomIdx);

    return Array.from(new Set([...availableNumbers, ...shuffle(allNumbers)]))
      .slice(0, 6)
      .sort((a, b) => a - b);
  };

  // 등수 계산 함수
  const calculateRank = (
    generatedNumbers: number[],
    winningNumbers: number[],
    bonusNumber: number
  ) => {
    const matchCount = generatedNumbers.filter((num) =>
      winningNumbers.includes(num)
    ).length;

    if (matchCount === 6) return "first"; // 1등
    if (matchCount === 5 && generatedNumbers.includes(bonusNumber))
      return "second"; // 2등
    if (matchCount === 5) return "third"; // 3등
    if (matchCount === 4) return "fourth"; // 4등
    if (matchCount === 3) return "fifth"; // 5등

    return null; // 등수 없음
  };

  // 시뮬레이션 실행 함수

  const handleSimulate = async (maxCount: number) => {
    const latestDraw = allDraws[selectedDraw];
    if (!latestDraw) {
      message.error("기준 회차 데이터가 없습니다. 다시 시도해주세요.");
      return;
    }
    const { winningNumbers, bonusNumber } = latestDraw;

    setSimulationData((prev) => ({ ...prev, simulationRunning: true }));
    let count = 0;
    const finalRankCounts = {
      first: 0,
      second: 0,
      third: 0,
      fourth: 0,
      fifth: 0,
    };

    while (count < maxCount) {
      count++;
      const generatedNumbers = generateNumbers();
      const rank = calculateRank(
        generatedNumbers,
        winningNumbers.map(Number),
        Number(bonusNumber)
      );
      if (rank) finalRankCounts[rank]++;

      setSimulationData((prev) => ({
        ...prev,
        simulationCount: count,
        simulatedNumbers: generatedNumbers.join(","),
        rankCounts: { ...prev.rankCounts, [rank!]: prev.rankCounts[rank!] + 1 },
      }));

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    setSimulationData((prev) => ({ ...prev, simulationRunning: false }));
    message.success("시뮬레이션이 완료되었습니다!");
  };
  const { simulatedNumbers, simulationRunning, simulationCount, rankCounts } =
    simulationData;

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
            simulationRunning={simulationRunning}
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
    </Layout>
  );
};

export default SimulationResultPage;

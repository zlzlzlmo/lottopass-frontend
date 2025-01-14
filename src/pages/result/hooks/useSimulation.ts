import { useState, useRef } from "react";
import { message } from "antd";
import { LottoDraw } from "@/components/popup/StatisticPopup";

export const useSimulation = (
  allDraws: LottoDraw[],
  selectedDraw: number,
  generateNumbers: () => number[] | undefined
) => {
  const [progress, setProgress] = useState<number>(0);
  const [simulationData, setSimulationData] = useState({
    simulationRunning: false,
    simulationCount: 0,
    simulatedNumbers: "",
    rankCounts: { first: 0, second: 0, third: 0, fourth: 0, fifth: 0 },
  });
  const stopSimulation = useRef(false);

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
      if (!generatedNumbers) return;
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
    }
  };

  const handleStopSimulation = () => {
    stopSimulation.current = true;
    message.info("시뮬레이션이 중지되었습니다!");
  };

  return {
    progress,
    simulationData,
    handleSimulate,
    handleStopSimulation,
    resetSimulation,
  };
};

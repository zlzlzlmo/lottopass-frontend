import React, { useState, useEffect } from "react";
import { Typography, Divider } from "antd";
import Layout from "@/components/layout/Layout";
import { useSearchParams } from "react-router-dom";
import { parseQueryParams as parseQueryParams } from "../../numberGeneration/components/numberActionButtons/utils";

import SimulationControls from "./SimulationControls";
import SimulationResult from "./SimulationResult";
import SimulationResultModal from "./SimulationResultModal";
import CombinationDescription from "../CombinationDescription";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import LogoLoading from "@/components/common/loading/LogoLoading";
import { ErrorMessage } from "@/components/common";
import { QueryParams, useGenerateNumbers } from "../hooks/useGenerateNumbers";
import { useSimulation } from "../hooks/useSimulation";

const { Text } = Typography;
const SimulationResultPage: React.FC = () => {
  const [selectedDraw, setSelectedDraw] = useState<number>(0);
  const { allDraws, isError, isLoading, error, generateNumbers } =
    useGenerateNumbers({
      slicedStart: selectedDraw,
    });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    progress,
    simulationData,
    handleSimulate,
    handleStopSimulation,
    resetSimulation,
  } = useSimulation(allDraws ?? [], selectedDraw, generateNumbers);

  const [searchParams] = useSearchParams();
  const queryParams = parseQueryParams(searchParams) as QueryParams;

  const latestDraw = allDraws && allDraws[selectedDraw];

  useEffect(() => {
    if (!isModalVisible) {
      resetSimulation();
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (progress >= 100) {
      setIsModalVisible(true);
    }
  }, [progress]);

  if (isLoading) {
    return <LogoLoading text="잠시만 기다려주세요" />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : undefined}
      />
    );
  }

  if (!latestDraw || !allDraws) return <></>;

  return (
    <Layout>
      <Container>
        <Banner>🌟 이 시뮬레이션이 당신의 다음 행운이 될 수 있습니다!</Banner>
        <CombinationDescription
          queryParams={queryParams}
          latestDraw={latestDraw}
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
            onSimulate={(count) => {
              handleSimulate(count);
            }}
            onStop={() => {
              handleStopSimulation();
              setIsModalVisible(true);
            }}
            simulationRunning={simulationData.simulationRunning}
            latestDraw={latestDraw}
          />

          <Divider />
          <SimulationResult
            progress={progress}
            rankCounts={simulationData.rankCounts}
            simulatedNumbers={simulationData.simulatedNumbers}
            simulationCount={simulationData.simulationCount}
          />
        </div>

        <SimulationResultModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          rankCounts={simulationData.rankCounts}
          simulationCount={simulationData.simulationCount}
        />
      </Container>
    </Layout>
  );
};

export default SimulationResultPage;

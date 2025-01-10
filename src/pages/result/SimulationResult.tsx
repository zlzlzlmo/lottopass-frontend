/* eslint-disable no-constant-binary-expression */
import React, { useState } from "react";
import {
  Button,
  Typography,
  Card,
  Divider,
  Space,
  message,
  InputNumber,
  Modal,
} from "antd";
import Layout from "@/components/layout/Layout";
import { getRandomNum, shuffle } from "@/utils/number";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

const { Title, Text } = Typography;

const SimulationResultPage: React.FC = () => {
  const defaultMaxCount = 3000;
  const maxSimulationLimit = 1000000; // 최대 시뮬레이션 제한

  const [searchParams] = useSearchParams();
  const requiredNumbers =
    searchParams.get("requiredNumbers")?.split(",").map(Number) ?? [];
  const minCount = searchParams.get("minCount") ?? 6;
  const standardIdx = Number(searchParams.get("standardIdx")) ?? 0;

  const latestDraw = useAppSelector((state) => state.draw.allDraws)[
    standardIdx + 1
  ];

  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationCount, setSimulationCount] = useState(0);
  const [simulatedNumbers, setSimulatedNumbers] = useState<string>("");
  const [rankCounts, setRankCounts] = useState({
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 0,
  });
  const [maxCount, setMaxCount] = useState(defaultMaxCount); // 사용자 입력 시뮬레이션 횟수

  // 로또 기본 확률
  const lottoBaseProbabilities = {
    first: 1 / 8145060,
    second: 1 / 1357510,
    third: 1 / 35712,
    fourth: 1 / 733,
    fifth: 1 / 45,
  };

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

  const handleSimulate = async () => {
    if (!latestDraw) {
      message.error("기준 회차 데이터가 없습니다. 다시 시도해주세요.");
      return;
    }

    const winningNumbers = latestDraw.winningNumbers.map(Number);
    const bonusNumber = Number(latestDraw.bonusNumber);

    setSimulationRunning(true);
    setSimulationCount(0);
    setRankCounts({ first: 0, second: 0, third: 0, fourth: 0, fifth: 0 });

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
      setSimulatedNumbers(generatedNumbers.join(","));
      setSimulationCount(count);

      const rank = calculateRank(generatedNumbers, winningNumbers, bonusNumber);
      if (rank) {
        finalRankCounts[rank]++;
        setRankCounts((prev) => ({
          ...prev,
          [rank]: prev[rank] + 1,
        }));
      }

      await new Promise((resolve) => setTimeout(resolve, 0)); // 애니메이션 딜레이
    }

    setSimulationRunning(false);

    Modal.info({
      title: "시뮬레이션 결과",
      content: (
        <div>
          <p>총 {maxCount.toLocaleString()}번의 시뮬레이션 결과:</p>
          <p>
            1등: {finalRankCounts.first.toLocaleString()}번 (
            {((finalRankCounts.first / maxCount) * 100).toPrecision(2)}%)
            <br />
            <Text type="secondary">
              기본 확률: {(lottoBaseProbabilities.first * 100).toPrecision(2)}%
            </Text>
          </p>
          <p>
            2등: {finalRankCounts.second.toLocaleString()}번 (
            {((finalRankCounts.second / maxCount) * 100).toPrecision(2)}%)
            <br />
            <Text type="secondary">
              기본 확률: {(lottoBaseProbabilities.second * 100).toPrecision(2)}%
            </Text>
          </p>
          <p>
            3등: {finalRankCounts.third.toLocaleString()}번 (
            {((finalRankCounts.third / maxCount) * 100).toPrecision(2)}%)
            <br />
            <Text type="secondary">
              기본 확률: {(lottoBaseProbabilities.third * 100).toPrecision(2)}%
            </Text>
          </p>
          <p>
            4등: {finalRankCounts.fourth.toLocaleString()}번 (
            {((finalRankCounts.fourth / maxCount) * 100).toPrecision(2)}%)
            <br />
            <Text type="secondary">
              기본 확률: {(lottoBaseProbabilities.fourth * 100).toPrecision(2)}%
            </Text>
          </p>
          <p>
            5등: {finalRankCounts.fifth.toLocaleString()}번 (
            {((finalRankCounts.fifth / maxCount) * 100).toPrecision(2)}%)
            <br />
            <Text type="secondary">
              기본 확률: {(lottoBaseProbabilities.fifth * 100).toPrecision(2)}%
            </Text>
          </p>
        </div>
      ),
    });
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <Card style={{ maxWidth: 600, margin: "0 auto", borderRadius: 10 }}>
          <Text
            type="secondary"
            style={{ display: "block", textAlign: "center", marginBottom: 20 }}
          >
            로또 번호 조합 시뮬레이션을 통해 각 등수에 당첨된 횟수와 확률을
            확인합니다.
          </Text>

          <Divider />

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong>기준 회차:</Text>{" "}
              {latestDraw?.drawNumber ?? "데이터 없음"}
            </div>
            <div>
              <Text strong>당첨 번호:</Text>{" "}
              {latestDraw?.winningNumbers.join(", ") ?? "없음"}
            </div>
            <div>
              <Text strong>보너스 번호:</Text>{" "}
              {latestDraw?.bonusNumber ?? "없음"}
            </div>
          </Space>

          <Divider />

          {/* 시뮬레이션 횟수 설정 */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <Text strong>시뮬레이션 횟수 설정:</Text>
            <InputNumber
              min={1}
              max={maxSimulationLimit}
              value={maxCount}
              onChange={(value) => {
                if (
                  typeof value === "number" &&
                  value > 0 &&
                  value <= maxSimulationLimit
                ) {
                  setMaxCount(value);
                }
              }}
              style={{ marginLeft: "10px" }}
            />
          </div>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Button
              type="primary"
              onClick={handleSimulate}
              disabled={simulationRunning}
              shape="round"
              size="large"
            >
              {simulationRunning ? "시뮬레이션 진행 중..." : "시뮬레이션 시작"}
            </Button>
          </div>

          <Divider />

          <div style={{ textAlign: "center" }}>
            <Title level={5}>진행 횟수: {simulationCount}</Title>
            <div
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                margin: "20px 0",
              }}
            >
              <div>현재 번호 조합</div>
              <div>{simulatedNumbers}</div>
            </div>
          </div>

          {/* 실시간 결과 */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                background: "linear-gradient(to bottom, #ffffff, #f1f1f1)",
              }}
            >
              <Title level={4} style={{ color: "#595959" }}>
                실시간 결과
              </Title>
              <p style={{ fontSize: "16px", margin: "10px 0" }}>
                1등: <strong>{rankCounts.first.toLocaleString()}</strong>번
              </p>
              <p style={{ fontSize: "16px", margin: "10px 0" }}>
                2등: <strong>{rankCounts.second.toLocaleString()}</strong>번
              </p>
              <p style={{ fontSize: "16px", margin: "10px 0" }}>
                3등: <strong>{rankCounts.third.toLocaleString()}</strong>번
              </p>
              <p style={{ fontSize: "16px", margin: "10px 0" }}>
                4등: <strong>{rankCounts.fourth.toLocaleString()}</strong>번
              </p>
              <p style={{ fontSize: "16px", margin: "10px 0" }}>
                5등: <strong>{rankCounts.fifth.toLocaleString()}</strong>번
              </p>
            </Card>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SimulationResultPage;

import React, { useState } from "react";
import { Button, Typography, Card, Divider, Space, message } from "antd";
import Layout from "@/components/layout/Layout";
import { getRandomNum, shuffle } from "@/utils/number";
import { useLatestDraw } from "@/features/draw/hooks/useLatestDraw";
import { useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;

const SimulationResultPage: React.FC = () => {
  const maxCount = 30000;
  // 기준이 되는 가장 최근 회차
  const { data: latestDraw } = useLatestDraw();

  const [searchParams] = useSearchParams();
  const requiredNumbers =
    searchParams.get("requiredNumbers")?.split(",").map(Number) ?? [];
  const minCount = searchParams.get("minCount") ?? 6;
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationCount, setSimulationCount] = useState(0);
  const [simulatedNumbers, setSimulatedNumbers] = useState<string>("");
  const [simulationFailed, setSimulationFailed] = useState(false);

  const generateNumbers = (): number[] => {
    const allNumbers = Array.from({ length: 45 }, (_, i) => i + 1);
    const len = requiredNumbers.length;
    const randomIdx = getRandomNum(Math.min(Number(minCount), len), len);

    const availableNumbers = shuffle(requiredNumbers).slice(0, randomIdx);

    return Array.from(new Set([...availableNumbers, ...shuffle(allNumbers)]))
      .slice(0, 6)
      .sort((a, b) => a - b);
  };

  const handleSimulate = async () => {
    if (!latestDraw) {
      message.error("기준 회차 데이터가 없습니다. 다시 시도해주세요.");
      return;
    }

    const latestDrawWinningNumbers = latestDraw.winningNumbers.map(Number);
    const latestDrawWinningNumbersStr = latestDrawWinningNumbers.join(",");

    const firstCondition =
      requiredNumbers.length <= latestDrawWinningNumbers.length &&
      requiredNumbers.every((num) => latestDrawWinningNumbers.includes(num));

    const secondCondition =
      requiredNumbers.length > latestDrawWinningNumbers.length &&
      latestDrawWinningNumbers.every((num) => requiredNumbers.includes(num));

    const thirdCondition =
      requiredNumbers.filter((num) => latestDrawWinningNumbers.includes(num))
        .length >= Number(minCount);

    const isPossible = firstCondition || secondCondition || thirdCondition;

    if (!isPossible) {
      message.error(
        `현재 설정된 조합으로는 ${latestDraw.drawNumber}회 당첨이 불가능 합니다. 조합을 다시 설정해주세요.`
      );
      return;
    }

    setSimulationRunning(true);
    setSimulationFailed(false);
    setSimulationCount(0);
    let count = 0;

    const isMatching = (numbers: string) =>
      latestDrawWinningNumbersStr === numbers;

    while (true) {
      count++;
      const generatedNumbers = generateNumbers().join(",");
      setSimulatedNumbers(generatedNumbers);
      setSimulationCount(count);
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (isMatching(generatedNumbers) || count >= maxCount) {
        break;
      }
    }

    setSimulationRunning(false);

    if (count >= maxCount) {
      setSimulationFailed(true);
      message.warning("조건에 맞는 번호 조합을 찾을 수 없습니다.");
    } else {
      message.success(`${count}번 시도 끝에 당첨 조합을 찾았습니다!`);
    }
  };

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <Card style={{ maxWidth: 600, margin: "0 auto", borderRadius: 10 }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 10 }}>
            시뮬레이션 결과 페이지
          </Title>
          <Text
            type="secondary"
            style={{ display: "block", textAlign: "center", marginBottom: 20 }}
          >
            이 페이지는 로또 번호 조합 시뮬레이션을 통해 당첨 번호와 일치하는
            조합을 찾는 과정을 보여줍니다. 최대 {maxCount.toLocaleString()}번의
            시뮬레이션을 실행하며, 결과를 확인할 수 있습니다.
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

          {/* 진행 중 상태 */}
          {simulationRunning && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Card
                style={{
                  backgroundColor: "#e6f7ff",
                  borderColor: "#91d5ff",
                  textAlign: "center",
                }}
              >
                <Title level={4} style={{ color: "#1890ff" }}>
                  진행 중...
                </Title>
                <Text>시뮬레이션이 실행 중입니다. 잠시만 기다려주세요.</Text>
              </Card>
            </div>
          )}

          {/* 시뮬레이션 실패 상태 */}
          {simulationCount > 0 && !simulationRunning && simulationFailed && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Card
                style={{
                  backgroundColor: "#fff1f0",
                  borderColor: "#ffa39e",
                  textAlign: "center",
                }}
              >
                <Title level={4} style={{ color: "#cf1322" }}>
                  찾지 못함
                </Title>
                <Text>
                  {simulationCount}번 시도했지만 조건에 맞는 번호 조합을 찾을 수
                  없었습니다.
                </Text>
              </Card>
            </div>
          )}

          {/* 시뮬레이션 성공 상태 */}
          {simulationCount > 0 && !simulationRunning && !simulationFailed && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Card
                style={{
                  backgroundColor: "#f6ffed",
                  borderColor: "#b7eb8f",
                  textAlign: "center",
                }}
              >
                <Title level={4} style={{ color: "#389e0d" }}>
                  시뮬레이션 완료
                </Title>
                <Text>
                  {simulationCount}번 시도 끝에 당첨 조합을 찾았습니다!
                </Text>
              </Card>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default SimulationResultPage;

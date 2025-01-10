import React, { useState } from "react";
import {
  Button,
  Typography,
  Card,
  Divider,
  Space,
  message,
  InputNumber,
  Select,
} from "antd";
import Layout from "@/components/layout/Layout";
import { getRandomNum, shuffle } from "@/utils/number";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { parseQUeryParams } from "../../numberGeneration/components/numberActionButtons/utils";
import { QueryParams, setRequiredNumbers } from "../result-service";
import NumberContainer from "@/components/common/number/NumberContainer";

const { Title, Text } = Typography;
const { Option } = Select;

const SimulationResultPage: React.FC = () => {
  const defaultMaxCount = 3000;
  const maxSimulationLimit = 1000000;

  const allDraws = useAppSelector((state) => state.draw.allDraws); // 모든 회차 데이터 가져오기
  const [selectedDraw, setSelectedDraw] = useState<number>(0); // 기본값: 1회차 (가장 최근)

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
  const [maxCount, setMaxCount] = useState(defaultMaxCount);

  const [searchParams] = useSearchParams();

  const queryParams = parseQUeryParams(searchParams) as QueryParams;

  const latestDraw = allDraws[selectedDraw]; // 선택된 회차의 데이터 가져오기
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

    message.success("시뮬레이션이 완료되었습니다!");
  };

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

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong>기준 회차:</Text>
              <Select
                style={{ marginLeft: "10px", width: "150px" }}
                value={selectedDraw}
                onChange={(value) => setSelectedDraw(value)}
              >
                {allDraws.map((draw, index) => (
                  <Option key={draw.drawNumber} value={index}>
                    {draw.drawNumber}회
                  </Option>
                ))}
              </Select>
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
              loading={simulationRunning}
              style={{
                fontWeight: "bold",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
              }}
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
              {
                <NumberContainer
                  numbers={simulatedNumbers.split(",").map(Number)}
                />
              }
              {/* <div>{simulatedNumbers}</div> */}
            </div>
          </div>

          {/* 실시간 결과 */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                padding: "24px",
                background: "#f9f9f9",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "8px 16px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                {[
                  { rank: "1등", count: rankCounts.first, color: "#ff6f61" },
                  { rank: "2등", count: rankCounts.second, color: "#ff914d" },
                  { rank: "3등", count: rankCounts.third, color: "#ffc107" },
                  { rank: "4등", count: rankCounts.fourth, color: "#8bc34a" },
                  { rank: "5등", count: rankCounts.fifth, color: "#03a9f4" },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      backgroundColor: item.color + "20",
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: item.color }}>
                      {item.rank}
                    </span>
                    <span style={{ fontSize: "16px", fontWeight: "600" }}>
                      {item.count.toLocaleString()}번
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SimulationResultPage;

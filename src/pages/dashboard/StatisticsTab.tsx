import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Progress, Divider, Tooltip } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/redux/hooks";
import { drawService } from "@/api";
import { DetailDraw } from "lottopass-shared";
import { Record as RecordEntity } from "@/api/recordService";
import COLORS from "@/constants/colors";
import LottoBall from "@/components/common/number/LottoBall";

const { Title, Text } = Typography;

interface StatisticsTabProps {
  filteredRecords: RecordEntity[];
}
const rankMap: Record<string, number> = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
};

const StatisticsTab: React.FC<StatisticsTabProps> = ({ filteredRecords }) => {
  const allDraws = useAppSelector((state) => state.draw.allDraws);

  const [groupedDetails, setGroupedDetails] =
    useState<Record<number, DetailDraw[]>>();
  const [loading, setLoading] = useState(false);

  const groupDetailDrawsByDrawNumber = (
    detailDraws: DetailDraw[][]
  ): Record<number, DetailDraw[]> => {
    return detailDraws
      .flat()
      .reduce((grouped: Record<number, DetailDraw[]>, detail: DetailDraw) => {
        const { drawNumber } = detail;

        if (!grouped[drawNumber]) {
          grouped[drawNumber] = [];
        }

        grouped[drawNumber].push(detail);

        return grouped;
      }, {});
  };

  const calculateRank = (
    generatedNumbers: number[],
    winningNumbers: number[],
    bonusNumber: number
  ): string | null => {
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

  const parsePrize = (prize: number | string): number => {
    if (typeof prize === "number") return prize;
    return parseInt(prize.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const calculateTotalPrizes = (): number => {
    if (!groupedDetails) return 0; // groupedDetails가 없으면 0 반환

    return filteredRecords.reduce((totalPrize, record) => {
      const { drawNumber, combinations } = record;
      const drawDetails = groupedDetails[drawNumber] || [];
      const lottoDraw = allDraws.find((draw) => draw.drawNumber === drawNumber);

      if (!lottoDraw) return totalPrize;

      const { winningNumbers, bonusNumber } = lottoDraw;

      combinations.forEach((generatedNumbers) => {
        const rank = calculateRank(
          generatedNumbers,
          winningNumbers,
          bonusNumber
        );
        if (rank) {
          const rankDetail = drawDetails.find(
            (detail) => detail.rank === rankMap[rank]
          );

          if (rankDetail && rankDetail.prizePerWinner) {
            totalPrize += parsePrize(rankDetail.prizePerWinner);
          }
        }
      });

      return totalPrize;
    }, 0);
  };

  const getNumberFrequencies = () => {
    const numberFrequency: { [key: number]: number } = {};

    filteredRecords.forEach((record) => {
      record.combinations.forEach((combination) => {
        combination.forEach((number) => {
          numberFrequency[number] = (numberFrequency[number] || 0) + 1;
        });
      });
    });

    return Object.entries(numberFrequency)
      .map(([number, frequency]) => ({
        number: Number(number),
        frequency,
      }))
      .sort((a, b) => b.frequency - a.frequency);
  };

  const numberFrequencies = getNumberFrequencies();
  const frequencyCnt = 5;
  const totalCombinationLen = filteredRecords
    .map((record) => record.combinations)
    .flat().length;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const drawNumbers = [
          ...new Set(filteredRecords.map((record) => record.drawNumber)),
        ];

        const detailedDraws = await Promise.all(
          drawNumbers.map((drawNum) => drawService.getDetailOneDraw(drawNum))
        );
        setGroupedDetails(groupDetailDrawsByDrawNumber(detailedDraws));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filteredRecords]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card style={{ textAlign: "center", borderRadius: "10px" }}>
            <Title level={5} style={{ marginBottom: "10px" }}>
              총 구매 횟수
            </Title>
            <Text>{filteredRecords.length}회</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: "center", borderRadius: "10px" }}>
            <Title level={5} style={{ marginBottom: "10px" }}>
              총 지출 금액
            </Title>
            <Text>{(filteredRecords.length * 5000).toLocaleString()}원</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: "center", borderRadius: "10px" }}>
            <Title level={5} style={{ marginBottom: "10px" }}>
              총 당첨 금액
            </Title>
            <Tooltip title="모든 당첨 금액의 합산">
              <Text>{calculateTotalPrizes().toLocaleString()}원</Text>
            </Tooltip>
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: "30px 0" }} />

      <Card style={{ borderRadius: "10px" }}>
        <Title level={5} style={{ marginBottom: "20px" }}>
          구매 번호 빈도
        </Title>
        {numberFrequencies.slice(0, frequencyCnt).map((item) => (
          <div
            key={item.number}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <LottoBall number={item.number} size={30} />
            <Progress
              percent={(item.frequency / totalCombinationLen) * 100}
              strokeColor={COLORS.PRIMARY}
              format={() => `${item.frequency}회`}
              style={{ flex: 1, marginLeft: "10px" }}
            />
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <BarChartOutlined
            style={{ fontSize: "20px", color: COLORS.SECONDARY }}
          />
          <Text
            style={{
              marginLeft: "10px",
              fontSize: "14px",
              color: COLORS.TEXT_SECONDARY,
            }}
          >
            상위 {frequencyCnt}개의 번호 출현 빈도
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsTab;

import React from "react";
import { Modal, Table, Typography, List, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import NumberContainer from "../common/number/NumberContainer";
import { useAppSelector } from "@/redux/hooks";

const { Title } = Typography;

export interface LottoDraw {
  drawNumber: number;
  date: string;
  winningNumbers: number[];
  bonusNumber: number;
  prizeStatistics: {
    totalPrize: number;
    firstWinAmount: number;
    firstAccumAmount: number;
    firstPrizeWinnerCount: number;
  };
}

interface StatisticsProps {
  visible: boolean;
  numbers: number[];
  onClose: () => void;
}

const StatisticsPopup: React.FC<StatisticsProps> = ({
  visible,
  numbers,
  onClose,
}) => {
  const lottoHistory = useAppSelector((state) => state.draw.allDraws);

  const getLastAppearance = (number: number): number | null => {
    console.log("lottoHistory : ", lottoHistory);
    console.log("numbers :", numbers);
    for (const record of lottoHistory) {
      if (record.winningNumbers.includes(number)) {
        return record.drawNumber;
      }
    }
    return null;
  };

  const getTotalOccurrences = (number: number): number => {
    return lottoHistory.reduce(
      (count, record) =>
        count + (record.winningNumbers.includes(number) ? 1 : 0),
      0
    );
  };

  const getAverageGap = (number: number): number => {
    const appearances = lottoHistory
      .filter((record) => record.winningNumbers.includes(number))
      .map((record) => record.drawNumber)
      .sort((a, b) => a - b); // 오름차순 정렬

    if (appearances.length < 2) return 0;

    const gaps = appearances
      .slice(1)
      .map((draw, index) => draw - appearances[index]);
    return Math.abs(gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length); // 절대값으로 변환
  };

  const getPositionAverage = (number: number): number => {
    const positions = lottoHistory
      .map((record) => record.winningNumbers.indexOf(number) + 1)
      .filter((pos) => pos > 0);

    if (positions.length === 0) return 0;
    return positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
  };

  const getPairFrequencyForNumbers = (
    numbers: number[]
  ): { pair: string; count: number }[] => {
    const pairCounts = new Map<string, number>();

    lottoHistory.forEach((record) => {
      const relevantNumbers = record.winningNumbers.filter((num) =>
        numbers.includes(num)
      );
      for (let i = 0; i < relevantNumbers.length; i++) {
        for (let j = i + 1; j < relevantNumbers.length; j++) {
          const pairKey = [relevantNumbers[i], relevantNumbers[j]]
            .sort((a, b) => a - b)
            .join(",");
          pairCounts.set(pairKey, (pairCounts.get(pairKey) || 0) + 1);
        }
      }
    });

    return Array.from(pairCounts.entries())
      .map(([pair, count]) => ({ pair, count }))
      .sort((a, b) => b.count - a.count); // 내림차순 정렬
  };

  const getTripleFrequencyForNumbers = (
    numbers: number[]
  ): { triple: string; count: number }[] => {
    const tripleCounts = new Map<string, number>();

    lottoHistory.forEach((record) => {
      const relevantNumbers = record.winningNumbers.filter((num) =>
        numbers.includes(num)
      );
      for (let i = 0; i < relevantNumbers.length; i++) {
        for (let j = i + 1; j < relevantNumbers.length; j++) {
          for (let k = j + 1; k < relevantNumbers.length; k++) {
            const tripleKey = [
              relevantNumbers[i],
              relevantNumbers[j],
              relevantNumbers[k],
            ]
              .sort((a, b) => a - b)
              .join(",");
            tripleCounts.set(tripleKey, (tripleCounts.get(tripleKey) || 0) + 1);
          }
        }
      }
    });

    return Array.from(tripleCounts.entries())
      .map(([triple, count]) => ({ triple, count }))
      .sort((a, b) => b.count - a.count); // 내림차순 정렬
  };

  const getConsecutiveCounts = (number: number): number => {
    let maxStreak = 0;
    let currentStreak = 0;

    lottoHistory.forEach((record) => {
      if (record.winningNumbers.includes(number)) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return maxStreak;
  };

  const columns = [
    {
      title: (
        <>
          번호
          <Tooltip title="당첨 번호입니다.">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </>
      ),
      dataIndex: "number",
      key: "number",
    },
    {
      title: (
        <>
          최근 출현 회차
          <Tooltip title="해당 번호가 마지막으로 출현한 회차입니다.">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </>
      ),
      dataIndex: "lastAppearance",
      key: "lastAppearance",
    },
    {
      title: (
        <>
          전체 출현 횟수
          <Tooltip title="해당 번호가 전체 당첨 기록에서 출현한 횟수입니다.">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </>
      ),
      dataIndex: "totalOccurrences",
      key: "totalOccurrences",
    },
    {
      title: (
        <>
          평균 간격
          <Tooltip title="번호가 출현하는 회차 간 평균 간격입니다.">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </>
      ),
      dataIndex: "averageGap",
      key: "averageGap",
    },
    {
      title: (
        <>
          평균 위치
          <Tooltip title="번호가 당첨 번호 배열에서 차지하는 평균 위치입니다.">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </>
      ),
      dataIndex: "averagePosition",
      key: "averagePosition",
    },
    {
      title: (
        <>
          연속 출현 횟수
          <Tooltip title="해당 번호가 연속으로 등장한 최대 횟수입니다.">
            <QuestionCircleOutlined style={{ marginLeft: 8 }} />
          </Tooltip>
        </>
      ),
      dataIndex: "consecutiveCount",
      key: "consecutiveCount",
    },
  ];

  const dataSource = numbers.map((number) => ({
    key: number,
    number,
    lastAppearance: getLastAppearance(number),
    totalOccurrences: getTotalOccurrences(number),
    averageGap: getAverageGap(number).toFixed(2),
    averagePosition: getPositionAverage(number).toFixed(2),
    consecutiveCount: getConsecutiveCounts(number),
  }));

  const pairColumns = [
    {
      title: "번호 쌍",
      dataIndex: "pair",
      key: "pair",
    },
    {
      title: "빈도수",
      dataIndex: "count",
      key: "count",
    },
  ];

  const tripleColumns = [
    {
      title: "번호 삼쌍",
      dataIndex: "triple",
      key: "triple",
    },
    {
      title: "빈도수",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <Modal
      title={
        <div>
          <Title level={4}>선택한 번호 통계</Title>
          <NumberContainer numbers={numbers} />
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        rowKey={(record) => record.key.toString()}
        scroll={{ x: "100%" }}
      />

      <Title level={4} style={{ marginTop: 24 }}>
        번호 조합의 과거 당첨 여부
        <Tooltip title="선택한 번호 조합이 과거 당첨 번호와 일치한 회차">
          <QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Tooltip>
      </Title>
      <List
        dataSource={lottoHistory.filter((record) =>
          numbers.every((num) => record.winningNumbers.includes(num))
        )}
        renderItem={(record) => (
          <List.Item>{`제 ${record.drawNumber}회차: ${record.date}`}</List.Item>
        )}
        locale={{ emptyText: "과거 당첨 기록이 없습니다." }}
      />

      <Title level={4} style={{ marginTop: 24 }}>
        번호 쌍 빈도
        <Tooltip title="선택한 번호에서 두 개의 번호가 함께 등장한 빈도">
          <QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Tooltip>
      </Title>
      <Table
        columns={pairColumns}
        dataSource={getPairFrequencyForNumbers(numbers).slice(0, 5)}
        pagination={false}
        rowKey="pair"
      />

      <Title level={4} style={{ marginTop: 24 }}>
        번호 삼쌍 빈도
        <Tooltip title="선택한 번호에서 세 개의 번호가 함께 등장한 빈도">
          <QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Tooltip>
      </Title>
      <Table
        columns={tripleColumns}
        dataSource={getTripleFrequencyForNumbers(numbers).slice(0, 5)}
        pagination={false}
        rowKey="triple"
      />
    </Modal>
  );
};

export default StatisticsPopup;

import React, { useState, useEffect } from "react";
import {
  Tabs,
  List,
  Card,
  Typography,
  Row,
  Col,
  Progress,
  Button,
  DatePicker,
} from "antd";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import LottoCard from "./LottoCard";
import RangeCalendar from "./RangeCalendar";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock 데이터
const mockRecords = [
  {
    id: 1,
    drawNumber: 1154,
    combinations: [
      [4, 16, 26, 33, 34, 43],
      [6, 19, 22, 24, 40, 42],
    ],
    purchaseDate: "2025-01-10",
    memo: "이번 주 행운 번호",
  },
  {
    id: 2,
    drawNumber: 1155,
    combinations: [[7, 14, 21, 28, 35, 42]],
    purchaseDate: "2025-01-17",
    memo: "가족 추천 번호",
  },
  {
    id: 3,
    drawNumber: 1156,
    combinations: [[5, 12, 19, 25, 34, 45]],
    purchaseDate: "2025-01-20",
    memo: "테스트 번호",
  },
];

const DashboardPage: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<[string, string] | null>(
    null
  );
  const [filteredRecords, setFilteredRecords] = useState(mockRecords);

  // 기본 날짜 범위 설정
  useEffect(() => {
    const startDate = mockRecords[0].purchaseDate; // 가장 오래된 날짜
    const endDate = new Date().toISOString().split("T")[0]; // 오늘 날짜
    setSelectedRange([startDate, endDate]);
    setFilteredRecords(
      mockRecords.filter(
        (record) =>
          record.purchaseDate >= startDate && record.purchaseDate <= endDate
      )
    );
  }, []);

  // 날짜 범위 변경 핸들러
  const handleRangeChange = (dates: any) => {
    if (dates) {
      const startDate = dates[0].format("YYYY-MM-DD");
      const endDate = dates[1].format("YYYY-MM-DD");
      setSelectedRange([startDate, endDate]);
      setFilteredRecords(
        mockRecords.filter(
          (record) =>
            record.purchaseDate >= startDate && record.purchaseDate <= endDate
        )
      );
    } else {
      setSelectedRange(null);
      setFilteredRecords(mockRecords);
    }
  };

  return (
    <Layout>
      <Container>
        <Banner>
          📅 당신의 로또 구매 내역, 캘린더와 함께 체계적으로! <br />매 순간의
          기대와 설렘을 기록합니다
        </Banner>
        <Tabs defaultActiveKey="1" style={{ marginTop: "20px" }}>
          {/* 캘린더 탭 */}
          <TabPane tab="캘린더 (날짜 범위 선택)" key="1">
            <RangeCalendar />
          </TabPane>

          {/* 구매 내역 리스트 탭 */}
          <TabPane tab="구매 내역" key="2">
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={mockRecords}
              renderItem={(item) => (
                <List.Item>
                  <Card title={`회차: ${item.drawNumber}`}>
                    <Text>
                      번호:{" "}
                      {item.combinations
                        .map((combo) => combo.join(", "))
                        .join(" / ")}
                    </Text>
                    <br />
                    <Text>구매 날짜: {item.purchaseDate}</Text>
                    <br />
                    <Text>메모: {item.memo}</Text>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>

          {/* 통계 탭 */}
          <TabPane tab="통계" key="3">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Title level={5}>총 구매 횟수</Title>
                  <Text>{filteredRecords.length}회</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Title level={5}>총 지출 금액</Title>
                  <Text>{filteredRecords.length * 10000}원</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Title level={5}>가장 자주 구매한 번호</Title>
                  <Text>6, 16, 26, 33</Text>
                </Card>
              </Col>
            </Row>
            <div style={{ marginTop: "20px" }}>
              <Card>
                <Title level={5}>번호 출현 빈도</Title>
                <Progress percent={50} showInfo format={() => "6번: 50%"} />
                <Progress percent={30} showInfo format={() => "16번: 30%"} />
              </Card>
            </div>
          </TabPane>

          {/* 추천 번호 탭 */}
          <TabPane tab="추천 번호" key="4">
            <Card>
              <Text>추천 번호: 7, 14, 21, 28, 35, 42</Text>
              <br />
              <Button type="primary" style={{ marginTop: "10px" }}>
                새 번호 추천
              </Button>
            </Card>
          </TabPane>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default DashboardPage;

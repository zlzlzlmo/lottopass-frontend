import React, { useState, useEffect } from "react";
import { Tabs, message } from "antd";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";

import { RecordService } from "@/api/recordService";
import { Record } from "@/api/recordService";
import dayjs from "dayjs";
import CalendarTab from "./CalendarTab";
import DatePickerRange from "./DatePickerRange";
import StatisticsTab from "./StatisticsTab";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { TabPane } = Tabs;

const DashboardPage: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<Record[]>([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  const recordService = new RecordService();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const allRecords = await recordService.getAll();
        setRecords(allRecords);
        setFilteredRecords(allRecords);
      } catch (error) {
        console.error("Error fetching records:", error);
        message.error("데이터를 가져오는 데 실패했습니다.");
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = records.filter((record) => {
        const recordDate = dayjs(record.purchaseDate);
        return (
          recordDate.isSameOrAfter(startDate, "day") &&
          recordDate.isSameOrBefore(endDate, "day")
        );
      });

      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [startDate, endDate, records]);

  return (
    <Layout>
      <Container>
        <Banner>
          📅 당신의 로또 구매 내역, 캘린더와 함께 체계적으로! <br />매 순간의
          기대와 설렘을 기록합니다
        </Banner>
        <DatePickerRange
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <Tabs defaultActiveKey="1" style={{ marginTop: "20px" }}>
          <TabPane tab="캘린더 (날짜 범위 선택)" key="1">
            <CalendarTab filteredRecords={filteredRecords} />
          </TabPane>

          <TabPane tab="통계" key="3">
            <StatisticsTab filteredRecords={filteredRecords} />
          </TabPane>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default DashboardPage;

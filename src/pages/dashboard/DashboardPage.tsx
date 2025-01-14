import React from "react";
import { Tabs } from "antd";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";

import dayjs from "dayjs";
import CalendarTab from "./CalendarTab";
import DatePickerRange from "./DatePickerRange";
import StatisticsTab from "./StatisticsTab";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useDashboardRecords } from "./hooks/useDashboardRecords";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { TabPane } = Tabs;

const DashboardPage: React.FC = () => {
  const { dateRange, filteredRecords, deleteRecord, handleDateChange } =
    useDashboardRecords();

  return (
    <Layout>
      <Container>
        <Banner>
          📅 당신의 로또 구매 내역, 캘린더와 함께 체계적으로! <br />매 순간의
          기대와 설렘을 기록합니다
        </Banner>
        <DatePickerRange
          dateRange={dateRange}
          handleDateChange={handleDateChange}
        />
        <Tabs defaultActiveKey="1" style={{ marginTop: "20px" }}>
          <TabPane tab="캘린더 (날짜 범위 선택)" key="1">
            <CalendarTab
              filteredRecords={filteredRecords}
              onDelete={deleteRecord}
            />
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

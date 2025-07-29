import React from "react";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import dayjs from "dayjs";
import CalendarTab from "./CalendarTab";
import DatePickerRange from "./DatePickerRange";
import StatisticsTab from "./StatisticsTab";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useDashboardRecords } from "./hooks/useDashboardRecords";
import { ErrorMessage, LoadingIndicator } from "@/components/common";
import QRScanner from "@/components/QRScanner";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const DashboardPage: React.FC = () => {
  const {
    dateRange,
    filteredRecords,
    isError,
    isLoading,
    error,
    deleteRecord,
    handleDateChange,
    handleRefetch,
  } = useDashboardRecords();

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : undefined}
      />
    );
  }
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
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <Tabs defaultValue="calendar" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">캘린더</TabsTrigger>
              <TabsTrigger value="statistics">통계</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar">
              <CalendarTab
                filteredRecords={filteredRecords}
                onDelete={deleteRecord}
              />
            </TabsContent>
            <TabsContent value="statistics">
              <StatisticsTab filteredRecords={filteredRecords} />
            </TabsContent>
          </Tabs>
        )}
      </Container>
      <QRScanner handleRefetch={handleRefetch} />
    </Layout>
  );
};

export default DashboardPage;

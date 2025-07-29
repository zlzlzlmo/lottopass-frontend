import React, { useState } from 'react';
import { Space, Empty, Spin, Button, Modal, Form, InputNumber } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useSpendingReport } from '../hooks/useSpendingReport';
import { useSpendingAlert } from '../hooks/useSpendingAlert';
import { MonthlySpendingChart } from './MonthlySpendingChart';
import { SpendingSummaryCard } from './SpendingSummaryCard';
import { SpendingAlertBanner } from './SpendingAlertBanner';
import { exportToCSV } from '../utils/exportUtils';

interface SpendingReportTabProps {
  userId?: string;
}

export const SpendingReportTab: React.FC<SpendingReportTabProps> = ({ userId }) => {
  const { monthlySpending, summary, isLoading, isEmpty } = useSpendingReport(userId);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Calculate current spending for alerts
  const currentSpending = React.useMemo(() => {
    const now = new Date();
    const todaySpending = monthlySpending
      .filter((m) => {
        const date = new Date(m.year, m.month - 1);
        return date.toDateString() === now.toDateString();
      })
      .reduce((sum, m) => sum + m.totalAmount, 0);

    const weekSpending = monthlySpending
      .filter((m) => {
        const date = new Date(m.year, m.month - 1);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      })
      .reduce((sum, m) => sum + m.totalAmount, 0);

    const monthSpending = monthlySpending
      .filter((m) => m.year === now.getFullYear() && m.month === now.getMonth() + 1)
      .reduce((sum, m) => sum + m.totalAmount, 0);

    return {
      daily: todaySpending,
      weekly: weekSpending,
      monthly: monthSpending,
    };
  }, [monthlySpending]);

  const { limits, alerts, updateLimits } = useSpendingAlert(currentSpending);

  const handleExport = () => {
    if (!monthlySpending || monthlySpending.length === 0) return;
    
    const csvData = monthlySpending.map((item) => ({
      '연도': item.year,
      '월': item.month,
      '지출액': item.totalAmount,
      '구매횟수': item.purchaseCount,
      '당첨금': item.winAmount,
      '순수익': item.netAmount,
    }));

    exportToCSV(csvData, `로또_지출_리포트_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleSettingsSave = (values: any) => {
    updateLimits({
      daily: values.dailyLimit,
      weekly: values.weeklyLimit,
      monthly: values.monthlyLimit,
    });
    setSettingsModalVisible(false);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Empty
        description="아직 구매 기록이 없습니다"
        style={{ padding: 50 }}
      />
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <SpendingAlertBanner
        alerts={alerts}
        onSettingsClick={() => {
          form.setFieldsValue({
            dailyLimit: limits.daily,
            weeklyLimit: limits.weekly,
            monthlyLimit: limits.monthly,
          });
          setSettingsModalVisible(true);
        }}
      />

      {summary && <SpendingSummaryCard summary={summary} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>월별 지출 추이</h3>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          CSV 내보내기
        </Button>
      </div>

      <MonthlySpendingChart data={monthlySpending.slice(0, 12)} />

      <Modal
        title="지출 한도 설정"
        open={settingsModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setSettingsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSettingsSave}>
          <Form.Item
            name="dailyLimit"
            label="일일 한도"
            rules={[{ required: true, message: '일일 한도를 입력해주세요' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1000}
              max={50000}
              step={1000}
              formatter={(value) => `${value}원`}
              parser={(value) => value!.replace(/원/, '')}
            />
          </Form.Item>
          <Form.Item
            name="weeklyLimit"
            label="주간 한도"
            rules={[{ required: true, message: '주간 한도를 입력해주세요' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={5000}
              max={200000}
              step={5000}
              formatter={(value) => `${value}원`}
              parser={(value) => value!.replace(/원/, '')}
            />
          </Form.Item>
          <Form.Item
            name="monthlyLimit"
            label="월간 한도"
            rules={[{ required: true, message: '월간 한도를 입력해주세요' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={10000}
              max={500000}
              step={10000}
              formatter={(value) => `${value}원`}
              parser={(value) => value!.replace(/원/, '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};
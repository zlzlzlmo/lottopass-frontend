import React from 'react';
import { Card, Row, Col, Statistic, Tag } from 'antd';
import {
  WalletOutlined,
  TrophyOutlined,
  CalculatorOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import type { SpendingSummary } from '../types/spending.types';
import COLORS from '@/constants/colors';

interface SpendingSummaryCardProps {
  summary: SpendingSummary;
}

export const SpendingSummaryCard: React.FC<SpendingSummaryCardProps> = ({ summary }) => {
  const isProfit = summary.netResult > 0;

  return (
    <Card title="지출 요약" className="spending-summary-card">
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Statistic
            title="총 지출"
            value={summary.totalSpent}
            prefix={<WalletOutlined />}
            suffix="원"
            valueStyle={{ color: COLORS.DANGER }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="총 당첨금"
            value={summary.totalWon}
            prefix={<TrophyOutlined />}
            suffix="원"
            valueStyle={{ color: COLORS.SUCCESS }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="순수익"
            value={Math.abs(summary.netResult)}
            prefix={
              <>
                <CalculatorOutlined />
                {summary.netResult < 0 ? '-' : '+'}
              </>
            }
            suffix="원"
            valueStyle={{ color: isProfit ? COLORS.SUCCESS : COLORS.DANGER }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="회수율"
            value={summary.winRate}
            prefix={<PercentageOutlined />}
            suffix="%"
            precision={2}
            valueStyle={{ color: summary.winRate > 100 ? COLORS.SUCCESS : COLORS.WARNING }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card size="small" bordered={false} style={{ backgroundColor: '#f5f5f5' }}>
            <Statistic
              title="월 평균 지출"
              value={summary.monthlyAverage}
              suffix="원"
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" bordered={false} style={{ backgroundColor: '#f5f5f5' }}>
            <Statistic
              title="최고 지출월"
              value={`${summary.mostSpentMonth.year}.${summary.mostSpentMonth.month}`}
              suffix={`(${summary.mostSpentMonth.totalAmount.toLocaleString()}원)`}
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      {summary.bestMonth.netAmount > 0 && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Tag color="success" style={{ fontSize: 14, padding: '4px 12px' }}>
            🎉 최고 수익월: {summary.bestMonth.year}.{summary.bestMonth.month} (+
            {summary.bestMonth.netAmount.toLocaleString()}원)
          </Tag>
        </div>
      )}
    </Card>
  );
};
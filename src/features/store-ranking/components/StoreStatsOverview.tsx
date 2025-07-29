import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ShopOutlined,
  TrophyOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { StoreStats } from '../types/store.types';
import COLORS from '@/constants/colors';

interface StoreStatsOverviewProps {
  stats: StoreStats;
}

export const StoreStatsOverview: React.FC<StoreStatsOverviewProps> = ({ stats }) => {
  return (
    <Card title="전국 로또 판매점 통계" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Statistic
            title="총 판매점"
            value={stats.totalStores}
            prefix={<ShopOutlined />}
            suffix="곳"
            valueStyle={{ color: COLORS.PRIMARY }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="1등 당첨"
            value={stats.totalFirstPrizes}
            prefix={<TrophyOutlined />}
            suffix="회"
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="총 당첨금"
            value={stats.totalPrizeAmount}
            prefix={<DollarOutlined />}
            suffix="억원"
            precision={0}
            valueStyle={{ color: COLORS.SUCCESS }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            bordered={false}
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: COLORS.TEXT_SECONDARY, marginBottom: 4 }}>
                <EnvironmentOutlined /> 최다 당첨 지역
              </div>
              <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                {stats.topCity.name}
              </div>
              <div style={{ color: COLORS.PRIMARY }}>
                {stats.topCity.wins}회
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
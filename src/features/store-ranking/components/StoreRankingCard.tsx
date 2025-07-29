import React from 'react';
import { Card, Tag, Space, Button, Tooltip } from 'antd';
import {
  TrophyOutlined,
  EnvironmentOutlined,
  StarOutlined,
  StarFilled,
  CalendarOutlined,
} from '@ant-design/icons';
import type { StoreRanking } from '../types/store.types';
import COLORS from '@/constants/colors';

interface StoreRankingCardProps {
  store: StoreRanking;
  isFavorite: boolean;
  onToggleFavorite: (storeId: string) => void;
  onClick?: () => void;
}

export const StoreRankingCard: React.FC<StoreRankingCardProps> = ({
  store,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return '#cd7f32'; // bronze
    return COLORS.PRIMARY;
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ marginBottom: 16, position: 'relative' }}
      actions={[
        <Button
          key="favorite"
          type="text"
          icon={isFavorite ? <StarFilled /> : <StarOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(store.storeId);
          }}
          style={{ color: isFavorite ? COLORS.WARNING : undefined }}
        >
          {isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
        </Button>,
      ]}
    >
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <Tag
          color={getRankBadgeColor(store.rank)}
          style={{ fontSize: 18, padding: '4px 12px' }}
        >
          {getRankEmoji(store.rank)} {store.rank}위
        </Tag>
      </div>

      <Card.Meta
        title={
          <div style={{ paddingRight: 80 }}>
            <h3 style={{ margin: 0 }}>{store.storeName}</h3>
          </div>
        }
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <EnvironmentOutlined />
              <span>{store.address}</span>
            </Space>

            {store.distance !== undefined && (
              <Space>
                <span style={{ color: COLORS.TEXT_SECONDARY }}>
                  현재 위치에서 {store.distance.toFixed(1)}km
                </span>
              </Space>
            )}

            <div style={{ marginTop: 16 }}>
              <Space wrap>
                <Tooltip title="1등 당첨 횟수">
                  <Tag icon={<TrophyOutlined />} color="gold">
                    1등 {store.firstPrizeCount}회
                  </Tag>
                </Tooltip>
                <Tooltip title="2등 당첨 횟수">
                  <Tag icon={<TrophyOutlined />} color="silver">
                    2등 {store.secondPrizeCount}회
                  </Tag>
                </Tooltip>
                <Tag color={COLORS.PRIMARY}>
                  총 {store.totalPrizeCount}회 당첨
                </Tag>
              </Space>
            </div>

            {store.lastWinDate && (
              <Space style={{ color: COLORS.TEXT_SECONDARY, fontSize: 12 }}>
                <CalendarOutlined />
                <span>
                  최근 당첨: {store.lastWinDate} ({store.lastWinRound}회차)
                </span>
              </Space>
            )}
          </Space>
        }
      />
    </Card>
  );
};
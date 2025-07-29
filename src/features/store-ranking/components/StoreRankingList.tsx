import React, { useState } from 'react';
import { List, Empty, Spin, Button, Space, message } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useStoreRanking } from '../hooks/useStoreRanking';
import { useStoreFavorites } from '../hooks/useStoreFavorites';
import { StoreRankingCard } from './StoreRankingCard';
import { StoreFilterBar } from './StoreFilterBar';
import { StoreStatsOverview } from './StoreStatsOverview';
import type { StoreFilters, StoreStats } from '../types/store.types';
import { exportStoreRankingToCSV } from '../utils/exportUtils';

export const StoreRankingList: React.FC = () => {
  const [filters, setFilters] = useState<StoreFilters>({
    sortBy: 'totalWins',
    onlyFavorites: false,
  });

  const { stores, isLoading, error, availableCities, totalCount } = useStoreRanking(filters);
  const { favorites, toggleFavorite, isFavorite, getFavoriteCount } = useStoreFavorites();

  // Filter by favorites if needed
  const displayStores = filters.onlyFavorites
    ? stores.filter((store) => isFavorite(store.storeId))
    : stores;

  // Calculate stats
  const stats: StoreStats = React.useMemo(() => {
    const cityWins = stores.reduce((acc, store) => {
      acc[store.city] = (acc[store.city] || 0) + store.totalPrizeCount;
      return acc;
    }, {} as Record<string, number>);

    const topCity = Object.entries(cityWins).reduce(
      (max, [city, wins]) => (wins > max.wins ? { name: city, wins } : max),
      { name: '', wins: 0 }
    );

    return {
      totalStores: totalCount,
      totalFirstPrizes: stores.reduce((sum, s) => sum + s.firstPrizeCount, 0),
      totalPrizeAmount: stores.reduce((sum, s) => sum + s.totalPrizeAmount, 0) / 100000000,
      topCity,
      averageWinsPerStore: totalCount > 0 
        ? stores.reduce((sum, s) => sum + s.totalPrizeCount, 0) / totalCount 
        : 0,
    };
  }, [stores, totalCount]);

  const handleExport = () => {
    if (displayStores.length === 0) {
      message.warning('내보낼 데이터가 없습니다');
      return;
    }
    exportStoreRankingToCSV(displayStores);
    message.success('판매점 랭킹 데이터를 내보냈습니다');
  };

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
        <Button onClick={() => window.location.reload()}>
          <ReloadOutlined /> 새로고침
        </Button>
      </div>
    );
  }

  return (
    <div>
      <StoreStatsOverview stats={stats} />

      <StoreFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        availableCities={availableCities}
        favoriteCount={getFavoriteCount()}
      />

      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Space>
          <span>총 {displayStores.length}개 판매점</span>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={displayStores.length === 0}
          >
            CSV 내보내기
          </Button>
        </Space>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : displayStores.length === 0 ? (
        <Empty
          description={
            filters.onlyFavorites
              ? '즐겨찾기한 판매점이 없습니다'
              : '조건에 맞는 판매점이 없습니다'
          }
        />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 3,
          }}
          dataSource={displayStores.slice(0, 50)} // Show top 50
          renderItem={(store) => (
            <List.Item>
              <StoreRankingCard
                store={store}
                isFavorite={isFavorite(store.storeId)}
                onToggleFavorite={toggleFavorite}
                onClick={() => {
                  // Could navigate to store detail page
                  message.info(`${store.storeName} 상세 정보`);
                }}
              />
            </List.Item>
          )}
          pagination={{
            pageSize: 12,
            showSizeChanger: true,
            pageSizeOptions: ['12', '24', '48'],
            showTotal: (total) => `총 ${total}개`,
          }}
        />
      )}
    </div>
  );
};
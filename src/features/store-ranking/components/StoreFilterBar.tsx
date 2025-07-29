import React from 'react';
import { Select, Space, InputNumber, Switch, Card } from 'antd';
import { FilterOutlined, StarOutlined } from '@ant-design/icons';
import type { StoreFilters } from '../types/store.types';

const { Option } = Select;

interface StoreFilterBarProps {
  filters: StoreFilters;
  onFiltersChange: (filters: StoreFilters) => void;
  availableCities: string[];
  favoriteCount: number;
}

export const StoreFilterBar: React.FC<StoreFilterBarProps> = ({
  filters,
  onFiltersChange,
  availableCities,
  favoriteCount,
}) => {
  const handleChange = (key: keyof StoreFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Space wrap size={[16, 16]} style={{ width: '100%' }}>
        <Space>
          <FilterOutlined />
          <span style={{ fontWeight: 'bold' }}>필터</span>
        </Space>

        <Select
          placeholder="지역 선택"
          value={filters.city}
          onChange={(value) => handleChange('city', value)}
          allowClear
          style={{ width: 150 }}
        >
          {availableCities.map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>

        <Select
          value={filters.sortBy}
          onChange={(value) => handleChange('sortBy', value)}
          style={{ width: 150 }}
        >
          <Option value="totalWins">당첨 횟수순</Option>
          <Option value="recentWins">최근 당첨순</Option>
          <Option value="distance">거리순</Option>
          <Option value="rating">평점순</Option>
        </Select>

        <Space>
          <span>최소 당첨:</span>
          <InputNumber
            min={0}
            max={100}
            value={filters.minWins}
            onChange={(value) => handleChange('minWins', value)}
            style={{ width: 80 }}
          />
          <span>회</span>
        </Space>

        <Space>
          <span>최대 거리:</span>
          <InputNumber
            min={1}
            max={50}
            value={filters.maxDistance}
            onChange={(value) => handleChange('maxDistance', value)}
            style={{ width: 80 }}
          />
          <span>km</span>
        </Space>

        <Space>
          <Switch
            checked={filters.onlyFavorites}
            onChange={(checked) => handleChange('onlyFavorites', checked)}
            checkedChildren={<StarOutlined />}
            unCheckedChildren={<StarOutlined />}
          />
          <span>
            즐겨찾기만 보기 {favoriteCount > 0 && `(${favoriteCount})`}
          </span>
        </Space>
      </Space>
    </Card>
  );
};
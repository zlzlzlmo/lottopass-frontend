import React from 'react';
import { ServerWrapper, serverFetch } from '@/components/server/ServerWrapper';
import { drawService } from '@/api';
import { DrawInfo } from '@/types';
import { Card, Table, Tag, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import LottoBall from '@/components/common/number/LottoBall';

interface DrawListServerProps {
  limit?: number;
}

/**
 * Server Component 패턴을 적용한 추첨 목록 컴포넌트
 * Next.js 마이그레이션 시 실제 Server Component로 전환 가능
 */
async function DrawListServerComponent({ limit = 10 }: DrawListServerProps) {
  // Server Component에서 직접 데이터 페칭
  const draws = await serverFetch(async () => {
    const latestDraw = await drawService.getLatestDraw();
    const promises = Array.from({ length: limit }, (_, i) => 
      drawService.getDrawByNo(latestDraw.drwNo - i)
    );
    return Promise.all(promises);
  });

  const columns: ColumnsType<DrawInfo> = [
    {
      title: '회차',
      dataIndex: 'drwNo',
      key: 'drwNo',
      width: 80,
      render: (drwNo: number) => (
        <Tag color="blue">{drwNo}회</Tag>
      ),
    },
    {
      title: '추첨일',
      dataIndex: 'drwNoDate',
      key: 'drwNoDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('ko-KR'),
    },
    {
      title: '당첨번호',
      key: 'numbers',
      render: (_, record) => (
        <Space>
          <LottoBall number={record.drwtNo1} size="small" />
          <LottoBall number={record.drwtNo2} size="small" />
          <LottoBall number={record.drwtNo3} size="small" />
          <LottoBall number={record.drwtNo4} size="small" />
          <LottoBall number={record.drwtNo5} size="small" />
          <LottoBall number={record.drwtNo6} size="small" />
          <span style={{ margin: '0 8px' }}>+</span>
          <LottoBall number={record.bnusNo} size="small" isBonus />
        </Space>
      ),
    },
    {
      title: '1등 당첨금',
      dataIndex: 'firstWinamnt',
      key: 'firstWinamnt',
      width: 150,
      render: (amount: number) => (
        <strong>{(amount / 100000000).toFixed(1)}억원</strong>
      ),
    },
  ];

  return (
    <Card title="최근 추첨 결과" bordered={false}>
      <Table
        columns={columns}
        dataSource={draws}
        rowKey="drwNo"
        pagination={false}
        size="middle"
      />
    </Card>
  );
}

// 클라이언트 환경에서는 Suspense와 함께 사용
export const DrawListServer: React.FC<DrawListServerProps> = (props) => {
  return (
    <ServerWrapper>
      <React.Suspense fallback={<div>로딩 중...</div>}>
        <DrawListServerComponent {...props} />
      </React.Suspense>
    </ServerWrapper>
  );
};
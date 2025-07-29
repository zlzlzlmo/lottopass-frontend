import type { StoreRanking } from '../types/store.types';

export const exportStoreRankingToCSV = (stores: StoreRanking[]) => {
  const headers = [
    '순위',
    '판매점명',
    '주소',
    '시/도',
    '구/군',
    '1등 당첨',
    '2등 당첨',
    '총 당첨횟수',
    '거리(km)',
  ];

  const rows = stores.map((store) => [
    store.rank,
    store.storeName,
    store.address,
    store.city,
    store.district,
    store.firstPrizeCount,
    store.secondPrizeCount,
    store.totalPrizeCount,
    store.distance ? store.distance.toFixed(1) : '-',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const value = cell?.toString() || '';
          // Escape values containing commas or quotes
          if (value.includes(',') || value.includes('"')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    ),
  ].join('\n');

  // Add BOM for proper Korean encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const filename = `로또_판매점_랭킹_${new Date().toISOString().split('T')[0]}.csv`;

  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
};
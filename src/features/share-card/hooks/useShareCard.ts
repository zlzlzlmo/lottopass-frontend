import { useState } from 'react';
import type { ShareCardData } from '../types/share.types';

export const useShareCard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cardData, setCardData] = useState<ShareCardData | null>(null);

  const openShareCard = (data: ShareCardData) => {
    setCardData(data);
    setIsModalVisible(true);
  };

  const closeShareCard = () => {
    setIsModalVisible(false);
    // Keep cardData for a moment to prevent flicker during close animation
    setTimeout(() => setCardData(null), 300);
  };

  const createResultCard = (
    drawNumber: number,
    numbers: number[],
    bonusNumber?: number,
    prize?: string,
    rank?: string
  ): ShareCardData => ({
    type: 'result',
    title: '로또 당첨 결과',
    subtitle: rank ? `축하합니다! ${rank}에 당첨되셨습니다!` : '당첨 결과를 확인하세요',
    date: new Date().toLocaleDateString('ko-KR'),
    content: {
      drawNumber,
      numbers,
      bonusNumber,
      prize,
      rank,
    },
  });

  const createNumbersCard = (
    generatedNumbers: number[][],
    generationMethod: string = '자동 생성'
  ): ShareCardData => ({
    type: 'numbers',
    title: '나의 행운 번호',
    subtitle: '이번 주 행운의 번호를 확인하세요',
    date: new Date().toLocaleDateString('ko-KR'),
    content: {
      generatedNumbers,
      generationMethod,
    },
  });

  const createStatsCard = (
    totalSpent: number,
    totalWon: number,
    favoriteNumbers: number[],
    winRate: number
  ): ShareCardData => ({
    type: 'stats',
    title: '나의 로또 통계',
    subtitle: '지금까지의 로또 기록을 확인하세요',
    date: new Date().toLocaleDateString('ko-KR'),
    content: {
      stats: {
        totalSpent,
        totalWon,
        favoriteNumbers,
        winRate,
      },
    },
  });

  return {
    isModalVisible,
    cardData,
    openShareCard,
    closeShareCard,
    createResultCard,
    createNumbersCard,
    createStatsCard,
  };
};
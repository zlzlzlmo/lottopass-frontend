import React from 'react';
import LottoBall from '@/components/common/number/LottoBall';
import type { ShareCardContent } from '../types/share.types';
import styles from './ShareCard.module.scss';

interface StatisticsCardProps {
  content: ShareCardContent;
  title: string;
  subtitle?: string;
  date: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  content,
  title,
  subtitle,
  date,
}) => {
  const { stats } = content;
  if (!stats) return null;

  const { totalSpent = 0, totalWon = 0, favoriteNumbers = [], winRate = 0 } = stats;
  const netResult = totalWon - totalSpent;

  return (
    <div className={`${styles.shareCard} ${styles.statsCard}`} id="statistics-card">
      <div className={styles.cardHeader}>
        <div className={styles.logo}>LOTTO PASS</div>
        <div className={styles.date}>{date}</div>
      </div>

      <div className={styles.cardBody}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>총 지출</div>
            <div className={styles.statValue}>{totalSpent.toLocaleString()}원</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>총 당첨금</div>
            <div className={styles.statValue}>{totalWon.toLocaleString()}원</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>순수익</div>
            <div className={styles.statValue}>
              {netResult >= 0 ? '+' : ''}{netResult.toLocaleString()}원
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>회수율</div>
            <div className={styles.statValue}>{winRate.toFixed(1)}%</div>
          </div>
        </div>

        {favoriteNumbers.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <div style={{ fontSize: '16px', marginBottom: '16px', opacity: 0.9 }}>
              자주 선택한 번호
            </div>
            <div className={styles.numbers}>
              {favoriteNumbers.slice(0, 6).map((number, index) => (
                <div key={index} className={styles.ballWrapper}>
                  <LottoBall number={number} size={35} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <p>나의 로또 통계 리포트</p>
        <p className={styles.watermark}>www.lottopass.com</p>
      </div>
    </div>
  );
};
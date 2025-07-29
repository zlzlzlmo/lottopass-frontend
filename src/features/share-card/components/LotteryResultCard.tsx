import React from 'react';
import { Card } from 'antd';
import LottoBall from '@/components/common/number/LottoBall';
import type { ShareCardContent } from '../types/share.types';
import styles from './ShareCard.module.scss';

interface LotteryResultCardProps {
  content: ShareCardContent;
  title: string;
  subtitle?: string;
  date: string;
}

export const LotteryResultCard: React.FC<LotteryResultCardProps> = ({
  content,
  title,
  subtitle,
  date,
}) => {
  const { drawNumber, numbers = [], bonusNumber, prize, rank } = content;

  return (
    <div className={styles.shareCard} id="lottery-result-card">
      <div className={styles.cardHeader}>
        <div className={styles.logo}>LOTTO PASS</div>
        <div className={styles.date}>{date}</div>
      </div>

      <div className={styles.cardBody}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        {drawNumber && (
          <div className={styles.drawNumber}>제 {drawNumber}회</div>
        )}

        <div className={styles.numbersContainer}>
          <div className={styles.numbers}>
            {numbers.map((number, index) => (
              <div key={index} className={styles.ballWrapper}>
                <LottoBall number={number} size={50} />
              </div>
            ))}
            {bonusNumber && (
              <>
                <div className={styles.plus}>+</div>
                <div className={styles.ballWrapper}>
                  <LottoBall number={bonusNumber} size={50} isBonus />
                </div>
              </>
            )}
          </div>
        </div>

        {rank && (
          <div className={styles.result}>
            <div className={styles.rank}>{rank}</div>
            {prize && <div className={styles.prize}>{prize}</div>}
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <p>로또패스에서 확인한 결과입니다</p>
        <p className={styles.watermark}>www.lottopass.com</p>
      </div>
    </div>
  );
};
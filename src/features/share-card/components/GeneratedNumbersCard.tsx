import React from 'react';
import LottoBall from '@/components/common/number/LottoBall';
import type { ShareCardContent } from '../types/share.types';
import styles from './ShareCard.module.scss';

interface GeneratedNumbersCardProps {
  content: ShareCardContent;
  title: string;
  subtitle?: string;
  date: string;
}

export const GeneratedNumbersCard: React.FC<GeneratedNumbersCardProps> = ({
  content,
  title,
  subtitle,
  date,
}) => {
  const { generatedNumbers = [], generationMethod = '랜덤 생성' } = content;

  return (
    <div className={`${styles.shareCard} ${styles.generatedCard}`} id="generated-numbers-card">
      <div className={styles.cardHeader}>
        <div className={styles.logo}>LOTTO PASS</div>
        <div className={styles.date}>{date}</div>
      </div>

      <div className={styles.cardBody}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <div className={styles.drawNumber}>{generationMethod}</div>

        <div className={styles.numbersContainer}>
          {generatedNumbers.map((numbers, groupIndex) => (
            <div key={groupIndex} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>
                {String.fromCharCode(65 + groupIndex)}조
              </div>
              <div className={styles.numbers}>
                {numbers.map((number, index) => (
                  <div key={index} className={styles.ballWrapper}>
                    <LottoBall number={number} size={40} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px', fontSize: '16px', opacity: 0.9 }}>
          행운이 함께하기를 바랍니다! 🍀
        </div>
      </div>

      <div className={styles.cardFooter}>
        <p>로또패스에서 생성한 번호입니다</p>
        <p className={styles.watermark}>www.lottopass.com</p>
      </div>
    </div>
  );
};
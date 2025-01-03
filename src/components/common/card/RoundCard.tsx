import { Card, Button, Typography, Tag, Space } from "antd";
import { formatNumberWithCommas } from "../../../utils/number";
import { getBallColor } from "../../../utils/ballColor";
import { LottoDraw } from "lottopass-shared";
import styles from "./RoundCard.module.scss";

const { Text } = Typography;

interface RoundCardProps extends LottoDraw {
  linkText?: string;
  linkAction?: () => void;
}

const RoundCard: React.FC<RoundCardProps> = ({
  winningNumbers,
  drawNumber,
  date,
  prizeStatistics,
  bonusNumber,
  linkText,
  linkAction,
}) => {
  return (
    <Card
      title={
        <div className={styles.cardHeader}>
          <Text strong>{drawNumber}회 당첨번호</Text>
          <Text type="secondary">[{date}]</Text>
        </div>
      }
      extra={
        linkText && (
          <Button type="link" onClick={linkAction} size="small">
            {linkText}
          </Button>
        )
      }
      className={styles.card}
    >
      {/* 당첨 번호 */}
      <Space className={styles.numbersContainer} wrap>
        {winningNumbers.map((num, index) => (
          <Tag
            color={getBallColor(num)}
            key={index}
            className={`${styles.number} ${index === 6 ? styles.bonus : ""}`}
          >
            {num}
          </Tag>
        ))}
        <Text className={styles.bonusPlus}>+</Text>
        <Tag color="magenta" className={`${styles.number} ${styles.bonus}`}>
          {bonusNumber}
        </Tag>
      </Space>

      {/* 1등 정보 */}
      <div className={styles.prizeInfo}>
        <Text>
          1등{" "}
          <Text strong>
            {formatNumberWithCommas(prizeStatistics.firstPrizeWinnerCount)}명
          </Text>{" "}
          |{" "}
          <Text strong>
            {formatNumberWithCommas(prizeStatistics.firstWinAmount)}원
          </Text>
        </Text>
      </div>
    </Card>
  );
};

export default RoundCard;

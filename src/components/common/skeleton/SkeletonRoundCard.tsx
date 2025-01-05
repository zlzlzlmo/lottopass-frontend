import React from "react";
import { Card, Skeleton, Tag, Space } from "antd";
import styles from "./SkeletonRoundCard.module.scss";

const SkeletonRoundCard: React.FC = () => {
  return (
    <Card className={styles.card}>
      <div className={styles.cardHeader}>
        <Skeleton.Input active size="small" style={{ width: "50px" }} />
        <Skeleton.Input active size="small" style={{ width: "100px" }} />
      </div>

      <Space className={styles.numbersContainer} wrap>
        {Array.from({ length: 6 }).map((_, index) => (
          <Tag key={index} className={styles.skeletonCircle} />
        ))}
        <span className={styles.bonusPlus}>+</span>
        <Tag className={`${styles.skeletonCircle} ${styles.bonus}`} />
      </Space>

      <div className={styles.prizeInfo}>
        <Skeleton.Input active size="small" style={{ width: "70%" }} />
      </div>
    </Card>
  );
};

export default SkeletonRoundCard;

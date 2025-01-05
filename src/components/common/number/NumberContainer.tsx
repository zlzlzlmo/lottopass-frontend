import { getBallColor } from "@/utils/ballColor";
import { Space, Tag, Typography } from "antd";
import React from "react";
import styles from "./NumberContainer.module.scss";

const { Text } = Typography;
interface NumberContainerProps {
  numbers: number[];
  bonusNumber?: number;
}

const NumberContainer: React.FC<NumberContainerProps> = ({
  numbers,
  bonusNumber,
}) => {
  return (
    <Space className={styles.numbersContainer} wrap>
      {numbers.map((num, index) => (
        <Tag
          color={getBallColor(num)}
          key={index}
          className={`${styles.number} ${index === 6 ? styles.bonus : ""}`}
        >
          {num}
        </Tag>
      ))}

      {bonusNumber && (
        <>
          <Text className={styles.bonusPlus}>+</Text>
          <Tag color="magenta" className={`${styles.number} ${styles.bonus}`}>
            {bonusNumber}
          </Tag>
        </>
      )}
    </Space>
  );
};

export default NumberContainer;

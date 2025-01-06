import React from "react";
import { Card, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { WinningRegion } from "lottopass-shared";
import styles from "./StoreCard.module.scss";
import { openMap } from "../../../utils/map";
import { useAppSelector } from "@/redux/hooks";
import { getDistanceText } from "@/utils/distance";

const StoreCard: React.FC<{ distance?: number } & Partial<WinningRegion>> = ({
  method,
  storeName,
  address,
  coordinates,
  distance,
}) => {
  const myLocation = useAppSelector((state) => state.location.myLocation);

  const handleClick = () => {
    if (!coordinates) return;
    openMap(storeName ?? "", coordinates);
  };

  return (
    <Card
      className={styles.storeCard}
      hoverable
      title={
        storeName ? (
          <span className={styles.storeName}>{storeName}</span>
        ) : (
          <span className={styles.placeholder}>매장 이름 없음</span>
        )
      }
      extra={
        method ? (
          <span className={styles.methodTag}>
            {method === "자동" ? "🌀 자동" : "✍ 수동"}
          </span>
        ) : (
          <span className={styles.placeholder}>방법 정보 없음</span>
        )
      }
    >
      <p>
        <strong>주소:</strong>{" "}
        {address || <span className={styles.placeholder}>주소 정보 없음</span>}
      </p>
      <p>
        {myLocation !== null ? (
          <strong>{getDistanceText(distance)}</strong>
        ) : (
          <span className={styles.placeholder}>
            위치 정보를 활성화해주세요.
          </span>
        )}
      </p>
      <Button
        type="primary"
        icon={<EnvironmentOutlined />}
        onClick={handleClick}
        className={styles.navigateButton}
        block
        disabled={!coordinates}
      >
        길찾기
      </Button>
    </Card>
  );
};

export default StoreCard;

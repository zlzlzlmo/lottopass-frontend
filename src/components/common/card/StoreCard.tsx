import React from "react";
import { Card, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { WinningRegion } from "lottopass-shared";
import styles from "./StoreCard.module.scss";
import { useGeoLocation } from "../../../context/\blocation/locationContext";

const StoreCard: React.FC<Partial<WinningRegion>> = ({
  method,
  storeName,
  address,
  coordinates,
}) => {
  const { state, calculateDistanceFromMyLocation } = useGeoLocation();
  const { currentLocation } = state;

  const openMap = () => {
    if (!coordinates) return;
    window.open(
      `https://map.kakao.com/link/map/${storeName},${coordinates.lat},${coordinates.lng}`,
      "_blank"
    );
  };

  const distance =
    currentLocation && coordinates
      ? calculateDistanceFromMyLocation(coordinates)
      : null;

  return (
    <Card
      className={styles.storeCard}
      hoverable
      title={<span className={styles.storeName}>{storeName}</span>}
      extra={
        <span className={styles.methodTag}>
          {method === "자동" ? "🌀 자동" : "✍ 수동"}
        </span>
      }
    >
      <p>
        <strong>주소:</strong> {address}
      </p>
      <p>
        {distance !== null ? (
          <strong>거리: {distance.toFixed(2)} km</strong>
        ) : (
          "위치 정보를 활성화해주세요."
        )}
      </p>
      <Button
        type="primary"
        icon={<EnvironmentOutlined />}
        onClick={openMap}
        className={styles.navigateButton}
        block
      >
        길찾기
      </Button>
    </Card>
  );
};

export default StoreCard;

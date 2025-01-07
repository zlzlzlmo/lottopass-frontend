import React from "react";
import { Card, Button, Typography, Space } from "antd";
import { PhoneOutlined, EnvironmentOutlined } from "@ant-design/icons";
import styles from "./StoreCard.module.scss";
import { useAppSelector } from "@/redux/hooks";
import { getDistanceText } from "@/utils/distance";

const { Title, Text } = Typography;

interface StoreCardProps {
  fullAddress: string;
  latitude: number;
  longitude: number;
  storeName: string;
  phone: string | null;

  distance?: number;
}

const StoreCard: React.FC<StoreCardProps> = ({
  storeName,
  fullAddress,
  phone,
  distance,
  latitude,
  longitude,
}) => {
  const myLocation = useAppSelector((state) => state.location.myLocation);
  const handleNavigate = () => {
    const kakaoMapsUrl = myLocation
      ? `https://map.kakao.com/link/to/${storeName},${latitude},${longitude}` // 길찾기
      : `https://map.kakao.com/link/map/${storeName},${latitude},${longitude}`; // 지도보기
    window.open(kakaoMapsUrl, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${phone}`, "_self");
  };

  return (
    <Card className={styles.storeCard}>
      <Space direction="vertical" size="small" className={styles.content}>
        <Title level={5} className={styles.storeName}>
          {storeName}
        </Title>
        <Text type="secondary" className={styles.address}>
          {fullAddress}
        </Text>
        <Text type="secondary" className={styles.distance}>
          {getDistanceText(distance)}
        </Text>
      </Space>
      <div className={styles.actions}>
        <Button
          type="primary"
          icon={<EnvironmentOutlined />}
          onClick={handleNavigate}
          className={styles.navigateButton}
        >
          {myLocation ? "길찾기" : "지도보기"}
        </Button>
        <Button
          type="default"
          icon={<PhoneOutlined />}
          onClick={handleCall}
          className={styles.callButton}
        >
          전화하기
        </Button>
      </div>
    </Card>
  );
};

export default StoreCard;

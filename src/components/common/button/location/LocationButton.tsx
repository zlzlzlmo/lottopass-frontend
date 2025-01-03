import { Button } from "antd";
import { CompassOutlined } from "@ant-design/icons";
import styles from "./LocationButton.module.scss";
import { useGeoLocation } from "../../../../context/\blocation/locationContext";
import { setMyLocation } from "../../../../context/\blocation/locationActions";
import { useState } from "react";

const LocationButton = () => {
  const { dispatch } = useGeoLocation();
  const [loading, setLoading] = useState(false);

  const handleMyLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(
          setMyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        );
        setLoading(false);
      },
      (error) => {
        alert("위치 정보 조회 실패");
        dispatch(setMyLocation(null));
        console.error("Error getting location:", error);
        setLoading(false);
      }
    );
  };
  return (
    <Button
      type="dashed"
      icon={<CompassOutlined />}
      onClick={handleMyLocation}
      className={styles.enableLocationButton}
      loading={loading}
    >
      {loading ? "위치 정보 확인중" : "내 위치 사용"}
    </Button>
  );
};

export default LocationButton;

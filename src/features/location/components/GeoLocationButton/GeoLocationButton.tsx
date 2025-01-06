import React, { useState } from "react";
import { Button, Space, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAddress, setError, setLocation } from "../../locationSlice";
import { CompassOutlined } from "@ant-design/icons";
import { locationService } from "@/api";
import { showError, getErrorMessage } from "@/utils/error";

const { Text } = Typography;

const locationErrorMessages = [
  { code: 1, message: "위치 정보 접근이 거부되었습니다." },
  { code: 2, message: "위치 정보를 사용할 수 없습니다." },
  { code: 3, message: "위치 정보를 가져오는 데 실패했습니다." },
  { code: 0, message: "알 수 없는 오류가 발생했습니다." },
];

interface GeoLocationButtonProps {
  onLocationSelect: (province: string, city: string) => void;
}

const GeoLocationButton: React.FC<GeoLocationButtonProps> = ({
  onLocationSelect,
}) => {
  const dispatch = useAppDispatch();
  const myLocation = useAppSelector((state) => state.location.myLocation);
  const myAddress = useAppSelector((state) => state.location.myAddress);
  const [isFetching, setIsFetching] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      const errorMessage = "브라우저에서 위치 정보를 지원하지 않습니다.";
      dispatch(setError(errorMessage));
      showError(errorMessage);
      return;
    }

    setIsFetching(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setLocation({ latitude, longitude }));
        setIsFetching(false);

        const address = await locationService.getCurrentMyLocation({
          latitude,
          longitude,
        });

        const parts = address.split(" ");
        const province = parts[0];
        const city = parts.length > 2 ? `${parts[1]} ${parts[2]}` : parts[1];

        onLocationSelect(province, city);
        dispatch(setAddress(address));
      },
      (error) => {
        const errorMessage = getErrorMessage(error.code, locationErrorMessages);
        dispatch(setError(errorMessage));
        showError(errorMessage); // 에러 표시
        setIsFetching(false);
      }
    );
  };

  return (
    <div style={{ marginTop: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          icon={<CompassOutlined />}
          type={myLocation ? "dashed" : "default"}
          loading={isFetching}
          onClick={handleGetLocation}
        >
          {myLocation ? "위치 재설정하기" : "내 위치 가져오기"}
        </Button>

        {myLocation && (
          <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
            현재 위치:{" "}
            {myAddress ?? `${myLocation.latitude} ${myLocation.longitude}`}
          </Text>
        )}
      </Space>
    </div>
  );
};

export default GeoLocationButton;

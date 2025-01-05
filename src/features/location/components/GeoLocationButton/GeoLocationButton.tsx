import React, { useState } from "react";
import { Button, message, Space, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAddress, setError, setLocation } from "../../locationSlice";
import { CompassOutlined } from "@ant-design/icons";
import { locationService } from "@/api";

const { Text } = Typography;

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

  const provinceMapping: Record<string, string> = {
    경기도: "경기",
    서울특별시: "서울",
    부산광역시: "부산",
    강원도: "강원특별자치도",
    // 추가 매핑...
  };

  // 도 매칭 함수
  const matchProvince = (province: string): string => {
    return provinceMapping[province] || province; // 매칭되지 않으면 원본 반환
  };

  type AddressParts = {
    province: string; // 도/특별시
    city: string; // 시/군/구
  };

  const parseAddress = (address: string): AddressParts => {
    const parts = address.split(" ");

    // 도와 시/구로 분리
    const province = parts[0]; // 첫 번째 값은 도
    let city = "";

    if (parts.length > 2) {
      // 시/군/구가 2개 이상의 값으로 이루어진 경우
      city = `${parts[1]} ${parts[2]}`;
    } else {
      // 시/군/구가 하나의 값으로만 이루어진 경우
      city = parts[1];
    }

    return { province, city };
  };

  const showError = (errorMessage: string) => {
    message.error({
      content: errorMessage,
      duration: 3, // 3초 후 자동 사라짐
      style: { marginTop: "10px" }, // 페이지 상단 간격 조정
    });
  };

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

        const { province, city } = parseAddress(address);

        // const matchedProvince = matchProvince(province);
        onLocationSelect(matchProvince(province), city);
        dispatch(setAddress(address));
      },
      (error) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보를 가져오는 데 실패했습니다.";
            break;
          default:
            errorMessage = "알 수 없는 오류가 발생했습니다.";
        }
        dispatch(setError(errorMessage));
        showError(errorMessage); // 상단에 에러 메시지 표시
        setIsFetching(false);
      }
    );
  };

  return (
    <div style={{ marginTop: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 위치 가져오기 및 재설정 버튼 */}
        <Button
          icon={<CompassOutlined />}
          type={myLocation ? "dashed" : "default"}
          loading={isFetching}
          onClick={handleGetLocation}
        >
          {myLocation ? "위치 재설정하기" : "내 위치 가져오기"}
        </Button>

        {/* 현재 위치 표시 */}
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

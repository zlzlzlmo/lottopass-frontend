/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Button, Space, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAddress, setError, setLocation } from "../../locationSlice";
import { CompassOutlined } from "@ant-design/icons";
import { locationService } from "@/api";
import { showError, getErrorMessage } from "@/utils/error";
import FlexContainer from "@/components/common/container/FlexContainer";

const { Text } = Typography;

type AddressParts = {
  province: string; // 도/특별시
  city: string; // 시/군/구
};

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

  const parseAddress = (address: string): AddressParts => {
    const parts = address.split(" ");

    // 도와 시/구로 분리
    const province = parts[0];
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

        try {
          const address = await locationService.getCurrentMyLocation({
            latitude,
            longitude,
          });
          const { province, city } = parseAddress(address);
          dispatch(setAddress(address));
          onLocationSelect(province, city);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          showError("KaKao API Error : 주소 변환 실패");
        }
      },
      (error) => {
        const errorMessage = getErrorMessage(error.code, locationErrorMessages);
        dispatch(setError(errorMessage));
        showError(errorMessage);
        setIsFetching(false);
      }
    );
  };

  return (
    <FlexContainer direction="column" gap={5}>
      <Button
        icon={<CompassOutlined />}
        type={myLocation ? "dashed" : "default"}
        loading={isFetching}
        onClick={handleGetLocation}
      >
        {myLocation ? "위치 재설정하기" : "내 위치 가져오기"}
      </Button>

      <div>
        {myAddress && (
          <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
            현재 위치: {myAddress ?? myAddress}
          </Text>
        )}
      </div>
    </FlexContainer>
  );
};

export default GeoLocationButton;

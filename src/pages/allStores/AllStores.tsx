import React, { useState } from "react";
import { Button, Card, Space, Row, Col, Divider, Spin } from "antd";
import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";
import RegionSelectBox from "../storeInfo/selectBox/RegionSelectBox";
import LocationButton from "../../components/common/button/location/LocationButton";
import { useStore } from "../../context/store/storeContext";
import { getAllStores, Store } from "../../api/axios/regionApi";
import { useGeoLocation } from "../../context/\blocation/locationContext";
import { calculateDistance } from "../../utils/distance";
import { decode } from "entities";

const AllStores: React.FC = () => {
  const { state: locationState } = useGeoLocation();
  const { currentLocation } = locationState;
  const { state } = useStore();
  const { selectedRegion, regionsByProvince } = state;
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("distance");

  const decodeCustom = (text: string) => {
    return text
      .replace(/&&#35;40;/g, "(") // "&&#35;40;" → "("
      .replace(/&&#35;41;/g, ")"); // "&&#35;41;" → ")"
  };

  const handleSearch = async () => {
    if (!selectedRegion.province || !regionsByProvince) return;
    if (
      regionsByProvince[selectedRegion.province].length > 1 &&
      (!selectedRegion.province || !selectedRegion.city)
    )
      return;

    console.log("res : ");
    setLoading(true);

    try {
      const response = await getAllStores(
        selectedRegion.province.substring(0, 2),
        selectedRegion.city ?? ""
      );

      if (response.status === "success") {
        const addedDistanceStores = response.data.reduce((acc, v) => {
          if (currentLocation)
            v["DISTANCE"] = calculateDistance(currentLocation, {
              lat: v.LATITUDE,
              lng: v.LONGITUDE,
            });
          return [...acc];
        }, response.data);

        console.log("addedDistanceStores ; ", addedDistanceStores);
        setStores(addedDistanceStores);
      } else {
        //  setError(response.message || "데이터를 가져오는데 실패했습니다.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      //    setError("서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     fetchStores();
  //   }, []);

  const sortedStores = stores.sort((a, b) => {
    if (sortOption === "distance") return (a.DISTANCE ?? 0) - (b.DISTANCE ?? 0);
    if (sortOption === "name") return a.FIRMNM.localeCompare(b.FIRMNM);
    // if (sortOption === "address") return a.address.localeCompare(b.address);
    return 0;
  });

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        로또 판매점 찾기
      </h1>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <RegionSelectBox />
        <Row gutter={[16, 16]} justify="space-between">
          <LocationButton />
          <Button type="primary" size="large" block onClick={handleSearch}>
            검색
          </Button>
        </Row>

        <Divider>판매점 목록</Divider>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Spin size="large" tip="판매점 정보를 불러오는 중..." />
          </div>
        ) : stores.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            선택한 지역에 판매점 정보가 없습니다.
          </p>
        ) : (
          <Row gutter={[16, 16]}>
            {sortedStores.map((store, i) => (
              <Col key={i} xs={24} sm={12}>
                <Card
                  title={decodeCustom(store.FIRMNM)}
                  extra={
                    <Space>
                      <Button
                        icon={<EnvironmentOutlined />}
                        size="small"
                        type="link"
                        onClick={() =>
                          console.log(`지도 보기: ${store.FIRMNM}`)
                        }
                      >
                        지도
                      </Button>
                      {store.RTLRSTRTELNO && (
                        <Button
                          icon={<PhoneOutlined />}
                          size="small"
                          type="link"
                          href={`tel:${store.RTLRSTRTELNO}`}
                        >
                          전화
                        </Button>
                      )}
                    </Space>
                  }
                  style={{ marginBottom: "20px" }}
                >
                  <p>주소: {store.BPLCDORODTLADRES}</p>
                  <p>
                    거리: {store.DISTANCE ? store.DISTANCE.toFixed(1) : "-"} km
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Space>
    </div>
  );
};

export default AllStores;

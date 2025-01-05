import React, { useEffect, useState } from "react";
import { Button, Card, Space, Row, Col, Spin, Select } from "antd";
import { EnvironmentOutlined, PhoneOutlined } from "@ant-design/icons";
import RegionSelectBox from "../winningStores/selectBox/RegionSelectBox";
import { useStore } from "../../context/store/storeContext";
import { getAllStores } from "../../api/axios/regionApi";
import { calculateDistance } from "../../utils/distance";
import { StoreInfo } from "lottopass-shared";
import { openMap } from "../../utils/map";
import { useGeoLocation } from "../../context/\blocation/locationContext";
import Layout from "../../components/layout/Layout";
import GeoLocationButton from "@/features/location/components/GeoLocationButton/GeoLocationButton";

type StoreWithDistance = StoreInfo & { distance: number | null };

const { Option } = Select;

const AllStores: React.FC = () => {
  const { state: locationState } = useGeoLocation();
  const { currentLocation } = locationState;
  const { state } = useStore();
  const { selectedRegion, regionsByProvince } = state;
  const [rawStores, setRawStores] = useState<StoreInfo[]>([]);
  const [stores, setStores] = useState<StoreWithDistance[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("distance");

  const addDistanceToStores = (
    stores: StoreInfo[],
    currentLocation: { lat: number; lng: number } | null
  ): StoreWithDistance[] => {
    return stores.map((store) => ({
      ...store,
      distance: currentLocation
        ? calculateDistance(currentLocation, {
            lat: store.latitude,
            lng: store.longitude,
          })
        : null,
    }));
  };

  const handleSearch = async () => {
    if (!selectedRegion.province || !regionsByProvince) return;
    if (
      regionsByProvince[selectedRegion.province].length > 1 &&
      (!selectedRegion.province || !selectedRegion.city)
    )
      return;

    setLoading(true);

    try {
      const response = await getAllStores(
        selectedRegion.province.substring(0, 2),
        selectedRegion.city ?? ""
      );

      if (response.status === "success") {
        setRawStores(response.data);
        const stores = addDistanceToStores(response.data, currentLocation);
        setStores(stores);
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  };

  const sortedStores = stores.sort((a, b) => {
    if (sortOption === "distance")
      return (a.distance ?? Infinity) - (b.distance ?? Infinity);
    if (sortOption === "name") return a.storeName.localeCompare(b.storeName);
    return 0;
  });

  useEffect(() => {
    if (rawStores.length <= 0) return;
    const stores = addDistanceToStores(rawStores, currentLocation);
    setStores(stores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  return (
    <Layout>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <RegionSelectBox />

          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <GeoLocationButton />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                value={sortOption}
                onChange={(value) => setSortOption(value)}
                style={{ width: "100%" }}
                size="large"
              >
                <Option value="distance">거리순</Option>
                <Option value="name">이름순</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Button type="primary" block size="large" onClick={handleSearch}>
                검색
              </Button>
            </Col>
          </Row>

          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" tip="판매점 정보를 불러오는 중..." />
            </div>
          ) : stores.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              선택한 지역에 판매점 정보가 없습니다.
            </p>
          ) : (
            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              {sortedStores.map((store, i) => (
                <Col key={i} xs={24} sm={12}>
                  <Card
                    title={store.storeName}
                    extra={
                      <Space>
                        <Button
                          icon={<EnvironmentOutlined />}
                          size="small"
                          type="link"
                          onClick={() =>
                            openMap(store.storeName, {
                              lat: store.latitude,
                              lng: store.longitude,
                            })
                          }
                        >
                          지도
                        </Button>
                        {store.phone && (
                          <Button
                            icon={<PhoneOutlined />}
                            size="small"
                            type="link"
                            href={`tel:${store.phone}`}
                          >
                            전화
                          </Button>
                        )}
                      </Space>
                    }
                    style={{ marginBottom: "20px" }}
                  >
                    <p>주소: {store.fullAddress}</p>
                    <p>
                      거리: {store.distance ? store.distance.toFixed(1) : "-"}{" "}
                      km
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Space>
      </div>
    </Layout>
  );
};

export default AllStores;

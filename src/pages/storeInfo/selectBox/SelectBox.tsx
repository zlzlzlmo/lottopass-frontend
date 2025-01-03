import { Select, Row, Col, Skeleton } from "antd";
import { useStore } from "../../../context/store/storeContext";
import { setSelectedRegion } from "../../../context/store/storeActions";

const { Option } = Select;

const SelectBox = () => {
  const { state, dispatch } = useStore();
  const { regionsByProvince, selectedRegion } = state;
  const { province, city } = selectedRegion;

  if (!regionsByProvince) {
    return (
      <div style={{ padding: "20px" }}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}>
        <Select
          style={{ width: "100%" }}
          placeholder="도/시를 선택하세요"
          value={province}
          onChange={(value) => dispatch(setSelectedRegion("province", value))}
          allowClear
        >
          {Object.keys(regionsByProvince).map((region) => (
            <Option key={region} value={region}>
              {region}
            </Option>
          ))}
        </Select>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Select
          style={{ width: "100%" }}
          placeholder="시(구/군)을 선택하세요"
          value={city}
          onChange={(value) => dispatch(setSelectedRegion("city", value))}
          allowClear
          disabled={!province}
        >
          {province &&
            regionsByProvince[province].map((region) => (
              <Option key={region.id} value={region.city}>
                {region.city}
              </Option>
            ))}
        </Select>
      </Col>
    </Row>
  );
};

export default SelectBox;

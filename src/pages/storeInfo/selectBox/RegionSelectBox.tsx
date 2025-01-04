import { Select, Row, Col, Skeleton } from "antd";
import { useStore } from "../../../context/store/storeContext";
import { setSelectedRegion } from "../../../context/store/storeActions";

const { Option } = Select;

const RegionSelectBox: React.FC = () => {
  const { state, dispatch } = useStore();
  const { regionsByProvince, selectedRegion } = state;
  const { province, city } = selectedRegion;

  if (!regionsByProvince) {
    return (
      <div style={{ padding: "20px" }}>
        <Skeleton active paragraph={{ rows: 1 }} />
      </div>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
        <Select
          placeholder="도/시를 선택하세요"
          value={province}
          onChange={(value) => dispatch(setSelectedRegion("province", value))}
          allowClear
          style={{ width: "100%" }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {Object.keys(regionsByProvince).map((region) => (
            <Option key={region} value={region}>
              {region}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={12}>
        <Select
          placeholder="시/구를 선택하세요"
          value={city}
          onChange={(value) => dispatch(setSelectedRegion("city", value))}
          allowClear
          style={{ width: "100%" }}
          disabled={!province}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
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

export default RegionSelectBox;

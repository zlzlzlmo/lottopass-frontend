import { Select, Row, Col, Skeleton } from "antd";
import { useGroupedRegions } from "@/features/location/hooks/useGroupedRegions";

const { Option } = Select;

interface RegionSelectBoxProps {
  province: string;
  city: string;
  onProvinceSelect?: (province: string) => void;
  onCitySelect?: (city: string) => void;
}

const RegionSelectBox: React.FC<RegionSelectBoxProps> = ({
  province,
  city,
  onCitySelect,
  onProvinceSelect,
}) => {
  const { groupedData, isLoading, isError } = useGroupedRegions();

  if (isLoading) {
    return (
      <div style={{ padding: "20px" }}>
        <Skeleton active paragraph={{ rows: 1 }} />
      </div>
    );
  }

  if (!groupedData || isError) return <></>;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
        <Select
          placeholder="도/시를 선택하세요"
          value={province || undefined}
          onChange={(value) => {
            if (onProvinceSelect) onProvinceSelect(value);
          }}
          allowClear
          style={{ width: "100%" }}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {Object.keys(groupedData).map((region) => (
            <Option key={region} value={region}>
              {region}
            </Option>
          ))}
        </Select>
      </Col>
      <Col xs={24} sm={12}>
        <Select
          placeholder="시/구를 선택하세요"
          value={city || undefined}
          onChange={(value) => {
            if (onCitySelect) onCitySelect(value);
          }}
          allowClear
          style={{ width: "100%" }}
          disabled={!province}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          {province &&
            groupedData[province].map((region) => (
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

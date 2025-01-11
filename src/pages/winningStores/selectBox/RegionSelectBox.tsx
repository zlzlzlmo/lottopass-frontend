import { Skeleton } from "antd";
import { useGroupedRegions } from "@/features/location/hooks/useGroupedRegions";
import RegionSelect from "./RegionSelect";
import FlexContainer from "@/components/common/container/FlexContainer";

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
    <FlexContainer direction="column" gap={10}>
      <RegionSelect
        placeholder="도/시를 선택하세요"
        value={province}
        options={Object.keys(groupedData)} // "서울", "부산" 등
        onChange={(value) => {
          if (onProvinceSelect) onProvinceSelect(value);
        }}
      />

      <RegionSelect
        placeholder="시/구를 선택하세요"
        value={city}
        options={province ? groupedData[province].map(({ city }) => city) : []} // 선택된 도/시의 시/구만 표시
        onChange={(value) => {
          if (onCitySelect) onCitySelect(value);
        }}
        disabled={!province} // 도/시가 선택되지 않았을 경우 비활성화
      />
    </FlexContainer>
  );
};

export default RegionSelectBox;

import React from "react";
import { Slider, InputNumber, Row, Col, Typography } from "antd";

// RangeSelector 컴포넌트 정의
interface RangeSelectorProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const { Text } = Typography;

interface RangeSelectorProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const handleSliderChange = (value: [number, number]) => {
    onChange(value);
  };

  const handleInputChange = (newValue: number | null, index: number) => {
    if (newValue === null) return;
    const updatedValue = [...value] as [number, number];
    updatedValue[index] = Math.min(Math.max(newValue, min), max);

    // 오른쪽 값이 왼쪽 값보다 작아지는 것을 방지
    if (index === 0 && updatedValue[0] > updatedValue[1]) {
      updatedValue[1] = updatedValue[0];
    } else if (index === 1 && updatedValue[1] < updatedValue[0]) {
      updatedValue[0] = updatedValue[1];
    }

    onChange(updatedValue);
  };

  return (
    <>
      <Slider
        range
        min={min}
        max={max}
        value={value}
        onChange={(value) => handleSliderChange(value as [number, number])}
        tooltip={{
          formatter: (val) => `${val}회`,
        }}
        style={{ marginBottom: "20px" }}
      />
      <Row gutter={16} style={{ marginBottom: "20px", alignItems: "center" }}>
        <Col span={11} style={{ display: "flex", alignItems: "center" }}>
          <InputNumber
            min={min}
            max={max}
            value={value[0]}
            onChange={(val) => handleInputChange(val, 0)}
            style={{ width: "100%" }}
          />
          <Text type="secondary" style={{ marginLeft: "8px" }}>
            회차
          </Text>
        </Col>
        <Col span={2} style={{ textAlign: "center" }}>
          <Text type="secondary">~</Text>
        </Col>
        <Col span={11} style={{ display: "flex", alignItems: "center" }}>
          <InputNumber
            min={min}
            max={max}
            value={value[1]}
            onChange={(val) => handleInputChange(val, 1)}
            style={{ width: "100%" }}
          />
          <Text type="secondary" style={{ marginLeft: "8px" }}>
            회차
          </Text>
        </Col>
      </Row>
    </>
  );
};

export default RangeSelector;

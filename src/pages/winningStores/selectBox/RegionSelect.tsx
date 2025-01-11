import React from "react";
import { Select } from "antd";

const { Option } = Select;

interface RegionSelectProps {
  placeholder: string;
  value?: string;
  options?: string[];
  onChange?: (value: string) => void;
  allowClear?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const RegionSelect: React.FC<RegionSelectProps> = ({
  placeholder,
  value,
  options = [],
  onChange,
  allowClear = true,
  style = { width: "100%" },
  disabled = false,
}) => {
  return (
    <Select
      placeholder={placeholder}
      value={value || undefined}
      onChange={(value) => {
        if (onChange) onChange(value);
      }}
      allowClear={allowClear}
      style={{ ...style, height: "50px" }}
      disabled={disabled}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      {options.map((option, index) => (
        <Option key={index} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  );
};

export default RegionSelect;

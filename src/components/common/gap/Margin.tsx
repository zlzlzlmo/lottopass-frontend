import React from "react";

interface MarginProps {
  size?: number;
  direction?: "vertical" | "horizontal";
}

const Margin: React.FC<MarginProps> = ({
  size = 16,
  direction = "vertical",
}) => {
  const style = {
    display: direction === "vertical" ? "block" : "inline-block",
    width: direction === "horizontal" ? size : "auto",
    height: direction === "vertical" ? size : "auto",
  };

  return <span style={style} />;
};

export default Margin;

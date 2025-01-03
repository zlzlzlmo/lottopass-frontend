import React from "react";
import styles from "./FlexContainer.module.scss";

interface FlexContainerProps {
  direction?: "row" | "column";
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  align?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  gap?: number;
  wrap?: boolean;
  className?: string;
  children: React.ReactNode;
}

const FlexContainer: React.FC<FlexContainerProps> = ({
  direction = "row",
  justify = "flex-start",
  align = "stretch",
  gap = 0,
  wrap = false,
  className = "",
  children,
}) => {
  return (
    <div
      className={`${styles.flexContainer} ${className}`}
      style={{
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        gap: `${gap}px`,
        flexWrap: wrap ? "wrap" : "nowrap",
      }}
    >
      {children}
    </div>
  );
};

export default FlexContainer;
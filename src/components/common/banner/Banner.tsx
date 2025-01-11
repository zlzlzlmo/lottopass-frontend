import React from "react";
import COLORS from "@/constants/colors";

interface BannerProps {
  children: React.ReactNode | React.ReactNode[];
}

const Banner: React.FC<BannerProps> = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: COLORS.DARK_BLUE,
        padding: "10px 20px",
        textAlign: "center",
        color: COLORS.NEUTRAL_LIGHT,
        borderRadius: "8px",
        marginBottom: "16px",
        fontSize: "16px",
        fontWeight: "bold",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

export default Banner;

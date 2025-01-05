import React from "react";
import { Divider } from "antd";

interface PageTitleProps {
  children: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
  return <Divider plain>{children}</Divider>;
};

export default PageTitle;
